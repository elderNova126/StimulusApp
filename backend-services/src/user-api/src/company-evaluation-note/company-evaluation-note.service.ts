import { ActionResponseUnion } from '../models/baseResponse';
import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { NoteSearchArgs, NoteArgs } from '../dto/noteArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { CompanyEvaluationNotesResponseUnion, CompanyEvaluationNoteUnion } from '../models/company-evaluation-note';

@Injectable()
export class CompanyEvaluationNoteService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  searchNotes(noteSearchArgs: NoteSearchArgs): Promise<typeof CompanyEvaluationNotesResponseUnion> {
    const { query, page, companyEvaluationId, limit, ...note } = noteSearchArgs;
    const pagination = { page, limit };
    const noteSearchGrpcArgs: any = { note, query, pagination };

    if (companyEvaluationId) {
      noteSearchGrpcArgs.note.companyEvaluation = { id: companyEvaluationId };
    }
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanyEvaluationNotes,
      noteSearchGrpcArgs
    );
  }

  createNote(noteArgs: NoteArgs): Promise<typeof CompanyEvaluationNoteUnion> {
    const { parentNoteId, companyEvaluationId, ...noteData } = noteArgs;
    const createNoteArgs: any = noteData;

    if (parentNoteId) {
      createNoteArgs.parentNote = { id: parentNoteId };
    }
    if (companyEvaluationId) {
      createNoteArgs.companyEvaluation = { id: companyEvaluationId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCompanyEvaluationNote, {
      note: createNoteArgs,
    });
  }

  deleteNote(noteArgs: DeleteArgs, userId: string): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteCompanyEvaluationNote, {
      ...noteArgs,
      userId,
    });
  }

  updateNote(noteArgs: NoteArgs, userId: string): Promise<typeof CompanyEvaluationNoteUnion> {
    const { parentNoteId, ...noteData } = noteArgs;
    const updateNoteArgs: any = noteData;

    if (parentNoteId) {
      updateNoteArgs.parentNote = { id: parentNoteId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCompanyEvaluationNote, {
      note: updateNoteArgs,
      userId,
    });
  }
}
