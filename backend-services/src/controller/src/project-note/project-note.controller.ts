import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { ProjectNote } from './project-note.entity';
import { ProjectNoteService } from './project-note.service';

@Controller('projectNote')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ProjectNoteController {
  constructor(
    private noteService: ProjectNoteService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = ProjectNoteController.name;
  }

  @GrpcMethod('DataService', 'SearchProjectNotes')
  async searchNotes(data: any): Promise<{ results: ProjectNote[]; count: number }> {
    const { note: filters, pagination, order } = data;

    const [results, count] = await this.noteService.getNotes(filters, order, pagination);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateProjectNote')
  async createNote(data: any): Promise<ProjectNote> {
    return this.noteService.createNote(data.note);
  }

  @GrpcMethod('DataService', 'DeleteProjectNote')
  async deleteNote(data: any): Promise<any> {
    const { id, userId } = data;

    await this.noteService.deleteNote(id, userId);

    return { done: true }; // otherwise an error will be thrown by noteService
  }

  @GrpcMethod('DataService', 'UpdateProjectNote')
  updateNote(data: any): Promise<ProjectNote> {
    const {
      note: { id, ...note },
      userId,
    } = data;

    return this.noteService.updateNote(id, note, userId);
  }
}
