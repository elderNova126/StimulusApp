import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginationDTO, IPagination } from '../shared/pagination.interface';
import { TENANT_CONNECTION } from '../database/database.constants';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { IOrderDTO } from '../shared/order.interface';
import { CompanyEvaluationNote } from './company-evaluation-note.entity';

@Injectable()
export class CompanyEvaluationNoteService {
  private readonly noteRepository: Repository<CompanyEvaluationNote>;
  readonly searchFields = [];

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.noteRepository = connection.getRepository(CompanyEvaluationNote);
  }

  getNotes(filters: CompanyEvaluationNote, order: IOrderDTO, pagination: IPaginationDTO) {
    const { limit, page } = pagination ?? {};
    const { key = 'created', direction = 'asc' } = order ?? {};

    let paginationParams: IPagination;

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }

    return this.noteRepository.findAndCount({
      relations: ['companyEvaluation', 'parentNote'],
      order: {
        [key]: direction,
      },
      where: filters,
      ...paginationParams,
    });
  }

  createNote(note: CompanyEvaluationNote): Promise<CompanyEvaluationNote> {
    return this.noteRepository.save(note);
  }

  async updateNote(id: number, note: CompanyEvaluationNote, userId: string): Promise<CompanyEvaluationNote> {
    const noteToUpdate = await this.noteRepository.findOneOrFail({ where: { id } });

    if (!userId || noteToUpdate.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    return this.noteRepository.save({ ...note, id });
  }

  async deleteNote(id: number, userId: string) {
    const noteToDelete = await this.noteRepository.findOneOrFail({
      where: { id },
      relations: ['replies'],
    });

    if (noteToDelete.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }

    const getAllNestedReplies = async (note: CompanyEvaluationNote) => {
      const replies = note.replies ?? [];

      const nestedReplies: any = await Promise.all(replies.map(getAllNestedReplies));

      return [...replies, ...nestedReplies?.flat()];
    };

    const noteReplies = await getAllNestedReplies(noteToDelete);
    await this.noteRepository.remove([...noteReplies, noteToDelete]);
  }
}
