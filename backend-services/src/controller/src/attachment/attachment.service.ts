import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { Attachment } from './attachment.entity';

@Injectable()
export class AttachmentService {
  private readonly attachmentRepository: Repository<Attachment>;

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.attachmentRepository = connection.getRepository(Attachment);
  }

  createAttachment(attachment: any): Promise<Attachment> {
    return this.attachmentRepository.save(attachment);
  }

  async updateAttachment(id: number, attachment: Attachment, userId: string): Promise<Attachment> {
    const attachmentToUpdate = await this.attachmentRepository.findOneOrFail({ where: { id } });

    if (!userId || attachmentToUpdate.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    return this.attachmentRepository.save({ ...attachment, id });
  }

  async deleteAttachment(id: number, userId: string) {
    const attachmentToDelete = await this.attachmentRepository.findOneOrFail({ where: { id } });

    if (attachmentToDelete.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    await this.attachmentRepository.remove(attachmentToDelete);
  }

  getAttachments(filters: Attachment, order: IOrderDTO, pagination: IPaginationDTO) {
    const { limit, page } = pagination;
    const { key = 'created', direction = 'asc' } = order;
    let paginationParams: IPagination;

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }

    return this.attachmentRepository.findAndCount({
      relations: ['project'],
      order: {
        [key]: direction,
      },
      where: filters,
      ...paginationParams,
    });
  }
}
