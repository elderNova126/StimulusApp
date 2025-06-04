import { Inject, Injectable } from '@nestjs/common';
import { Connection, In, Like, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { CompanyNote } from './company-note.entity';

@Injectable()
export class CompanyNoteService {
  private readonly noteRepository: Repository<CompanyNote>;
  readonly searchFields = [];

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.noteRepository = connection.getRepository(CompanyNote);
  }

  async getNotes(filters: CompanyNote, searchQuery: string, pagination: IPaginationDTO) {
    let queryFilters: any = filters;
    const { limit = 10, page = 1 } = pagination;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    let paginationParams: IPagination;

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }

    return this.noteRepository.findAndCount({
      relations: ['parentNote'],
      order: {
        created: 'ASC',
      },
      where: queryFilters,
      ...paginationParams,
    });
  }

  createNote(note: CompanyNote): Promise<CompanyNote> {
    const entity = Object.assign(new CompanyNote(), note);
    return this.noteRepository.save(entity);
  }

  async updateNote(id: number, note: CompanyNote, userId: string): Promise<CompanyNote> {
    const noteToUpdate = await this.noteRepository.findOneOrFail({
      where: { id },
    });

    if (noteToUpdate.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    const entity = Object.assign(noteToUpdate, note);
    return this.noteRepository.save(entity);
  }

  async deleteNote(id: number, userId: string) {
    const noteToDelete = await this.noteRepository.findOneOrFail({
      where: { id },
      relations: ['replies'],
    });

    if (noteToDelete.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }

    const getAllNestedReplies = async (note: CompanyNote) => {
      const replies = note.replies ?? [];
      const nestedReplies: any = await Promise.all(replies.map(getAllNestedReplies));

      return [...replies, ...nestedReplies?.flat()];
    };
    const noteReplies = await getAllNestedReplies(noteToDelete);
    await this.noteRepository.remove([...noteReplies, noteToDelete]);
  }

  async deleteNotesByCompanyId(companyId: string) {
    const notesToDelete = await this.noteRepository.find({
      where: { companyId },
    });

    await this.noteRepository.remove(notesToDelete);
  }

  async deleteNotesByCompanyIdInTenant(companies: string[], tenantConnection: Connection) {
    const noteRepository = tenantConnection.getRepository(CompanyNote);
    const notesToDelete = await noteRepository.find({
      where: { companyId: In(companies) },
    });
    if (notesToDelete.length > 0) {
      await noteRepository.remove(notesToDelete);
    }
  }
}
