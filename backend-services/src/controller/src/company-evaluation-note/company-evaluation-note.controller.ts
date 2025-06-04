import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { UserService } from '../user/user.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CompanyEvaluationNote } from './company-evaluation-note.entity';
import { CompanyEvaluationNoteService } from './company-evaluation-note.service';

@Controller('companyEvaluationNote')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CompanyEvaluationNoteController {
  constructor(
    private noteService: CompanyEvaluationNoteService,
    private userService: UserService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = CompanyEvaluationNoteController.name;
  }

  @GrpcMethod('DataService', 'SearchCompanyEvaluationNotes')
  async searchNotes(data: any): Promise<{ results: CompanyEvaluationNote[]; count: number }> {
    const { note: filters, pagination, order } = data;

    const [results, count] = await this.noteService.getNotes(filters, order, pagination);

    let finalNotes = [];

    if (count > 0) {
      const userIds = [...new Set(results.map((note) => note.createdBy).filter((i) => i))]; // remove duplicate ids to minimize AD calls
      try {
        const { value: users } = await this.userService.getADUsersByExternalIds(userIds);

        finalNotes = results.map((note) => {
          const user = users.find((userObj) => userObj.id === note.createdBy);

          return { ...note, createdByName: `${user?.givenName ?? ''} ${user?.surname ?? ''}` };
        });
      } catch (error) {
        this.logger.error(`Failed to get AD users error: `, error);
      }
    }

    return { results: finalNotes, count };
  }

  @GrpcMethod('DataService', 'CreateCompanyEvaluationNote')
  async createNote(data: any): Promise<CompanyEvaluationNote> {
    const note: any = await this.noteService.createNote(data.note);

    const currentUser = await this.userService.getADUserByExternalId(note.createdBy);

    note.createdByName = `${currentUser?.givenName ?? ''} ${currentUser?.surname ?? ''}`;

    return note;
  }

  @GrpcMethod('DataService', 'DeleteCompanyEvaluationNote')
  async deleteNote(data: any): Promise<any> {
    const { id, userId } = data;

    await this.noteService.deleteNote(id, userId);

    return { done: true }; // otherwise an error will be thrown by noteService
  }

  @GrpcMethod('DataService', 'UpdateCompanyEvaluationNote')
  updateNote(data: any): Promise<CompanyEvaluationNote> {
    const {
      note: { id, ...note },
      userId,
    } = data;

    return this.noteService.updateNote(id, note, userId);
  }
}
