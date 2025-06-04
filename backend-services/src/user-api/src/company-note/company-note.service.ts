import { ActionResponseUnion } from '../models/baseResponse';
import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { NoteSearchArgs, NoteArgs } from '../dto/noteArgs';
import { CompanyNoteUnion, CompanyNotesResponseUnion } from '../models/company-note';
import { DeleteArgs } from '../dto/deleteArgs';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';

@Injectable()
export class CompanyNoteService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  searchNotes(noteSearchArgs: NoteSearchArgs): Promise<typeof CompanyNotesResponseUnion> {
    const { query, page, limit, ...note } = noteSearchArgs;
    const pagination = { page, limit };
    const noteSearchGrpcArgs: any = { note, query, pagination };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanyNotes,
      noteSearchGrpcArgs
    );
  }

  createNote(noteArgs: NoteArgs): Promise<typeof CompanyNoteUnion> {
    const { parentNoteId, ...noteData } = noteArgs;
    const createNoteArgs: any = noteData;

    if (parentNoteId) {
      createNoteArgs.parentNote = { id: parentNoteId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCompanyNote, {
      note: createNoteArgs,
    });
  }

  deleteNote(noteArgs: DeleteArgs, userId: string): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteCompanyNote, {
      ...noteArgs,
      userId,
    });
  }

  updateNote(noteArgs: NoteArgs, userId: string): Promise<typeof CompanyNoteUnion> {
    const { parentNoteId, ...noteData } = noteArgs;
    const updateNoteArgs: any = noteData;

    if (parentNoteId) {
      updateNoteArgs.parentNote = { id: parentNoteId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCompanyNote, {
      note: updateNoteArgs,
      userId,
    });
  }
}
