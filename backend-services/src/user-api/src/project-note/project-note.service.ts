import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { NoteSearchArgs, NoteArgs } from '../dto/noteArgs';
import { ProjectNoteUnion, ProjectNotesResponseUnion } from '../models/project-note';
import { DeleteArgs } from '../dto/deleteArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';

@Injectable()
export class ProjectNoteService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  searchNotes(noteSearchArgs: NoteSearchArgs): Promise<typeof ProjectNotesResponseUnion> {
    const { orderBy, direction, projectId, page, limit, ...note } = noteSearchArgs;
    const pagination = { page, limit };
    const order = { orderBy, direction };
    const noteSearchGrpcArgs: any = { note, pagination, order };

    if (projectId) {
      noteSearchGrpcArgs.note.project = { id: projectId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchProjectNotes,
      noteSearchGrpcArgs
    );
  }

  createNote(noteArgs: NoteArgs): Promise<typeof ProjectNoteUnion> {
    const { projectId, parentNoteId, ...noteData } = noteArgs;
    const createNoteArgs: any = noteData;

    if (projectId) {
      createNoteArgs.project = { id: projectId };
    }
    if (parentNoteId) {
      createNoteArgs.parentNote = { id: parentNoteId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createProjectNote, {
      note: createNoteArgs,
    });
  }

  deleteNote(noteArgs: DeleteArgs, userId: string): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteProjectNote, {
      ...noteArgs,
      userId,
    });
  }

  updateNote(noteArgs: NoteArgs, userId: string): Promise<typeof ProjectNoteUnion> {
    const { projectId, parentNoteId, ...noteData } = noteArgs;
    const updateNoteArgs: any = noteData;

    if (projectId) {
      updateNoteArgs.project = { id: projectId };
    }
    if (parentNoteId) {
      updateNoteArgs.parentNote = { id: parentNoteId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateProjectNote, {
      note: updateNoteArgs,
      userId,
    });
  }
}
