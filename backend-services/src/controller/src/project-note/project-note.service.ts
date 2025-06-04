import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { ProjectNote } from './project-note.entity';

@Injectable()
export class ProjectNoteService {
  private readonly noteRepository: Repository<ProjectNote>;
  readonly searchFields = [];

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.noteRepository = connection.getRepository(ProjectNote);
  }

  getNotes(filters: ProjectNote, order: IOrderDTO, pagination: IPaginationDTO) {
    const { limit, page } = pagination;
    const { key = 'created', direction = 'asc' } = order;

    let paginationParams: IPagination;

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }

    return this.noteRepository.findAndCount({
      relations: ['project', 'parentNote'],
      order: {
        [key]: direction,
      },
      where: filters,
      ...paginationParams,
    });
  }

  createNote(note: ProjectNote): Promise<ProjectNote> {
    return this.noteRepository.save(note);
  }

  async updateNote(id: number, note: ProjectNote, userId: string): Promise<ProjectNote> {
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

    const getAllNestedReplies = async (note: ProjectNote) => {
      const replies = note.replies ?? [];

      const nestedReplies: any = await Promise.all(replies.map(getAllNestedReplies));

      return [...replies, ...nestedReplies?.flat()];
    };
    const noteReplies = await getAllNestedReplies(noteToDelete);
    await this.noteRepository.remove([...noteReplies, noteToDelete]);
  }
}
