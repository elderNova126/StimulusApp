import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { CompanyAttachment } from './company-attachment.entity';

@Injectable()
export class CompanyAttachmentService {
  private readonly attachmentRepository: Repository<CompanyAttachment>;

  constructor(@Inject(GLOBAL_CONNECTION) connection) {
    this.attachmentRepository = connection.getRepository(CompanyAttachment);
  }

  createAttachment(attachment: any): Promise<CompanyAttachment> {
    return this.attachmentRepository.save(attachment);
  }

  async updateAttachment(id: number, attachment: CompanyAttachment, userId: string): Promise<CompanyAttachment> {
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

  getAttachments(filters: CompanyAttachment, order: IOrderDTO, pagination: IPaginationDTO) {
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
      relations: ['company', 'tenant'],
      order: {
        [key]: direction,
      },
      where: filters,
      ...paginationParams,
    });
  }

  getAttachmentsByCompanyId(
    companyId: number,
    type: string,
    tenantId: number,
    order: IOrderDTO,
    pagination: IPaginationDTO
  ) {
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
      relations: ['company', 'tenant'],
      order: {
        [key]: direction,
      },
      where: [
        { isPrivate: false, company: { id: companyId }, type: type },
        { isPrivate: true, company: { id: companyId }, tenant: { id: tenantId }, type: type },
      ],
      ...paginationParams,
    });
  }
}
