import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { CompanyNote } from './company-note.entity';
import { CompanyNoteService } from './company-note.service';

@Controller('projectNote')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CompanyNoteController {
  constructor(
    private noteService: CompanyNoteService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = CompanyNoteController.name;
  }

  @GrpcMethod('DataService', 'SearchCompanyNotes')
  async searchNotes(data: any): Promise<{ results: CompanyNote[]; count: number }> {
    const { query, note: filters, pagination } = data;
    const [results, count] = await this.noteService.getNotes(filters, query, pagination);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateCompanyNote')
  async createNote(data: any): Promise<CompanyNote> {
    return this.noteService.createNote(data.note);
  }

  @GrpcMethod('DataService', 'DeleteCompanyNote')
  async deleteNote(data: any): Promise<any> {
    const { id, userId } = data;
    await this.noteService.deleteNote(id, userId);

    return { done: true }; // otherwise an error will be thrown by noteService
  }

  @GrpcMethod('DataService', 'UpdateCompanyNote')
  updateNote(data: any): Promise<CompanyNote> {
    const { userId } = data;
    const { id, ...note } = data.note;

    return this.noteService.updateNote(id, note, userId);
  }
}
