import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { DeleteArgs } from '../dto/deleteArgs';
import { NoteArgs, NoteSearchArgs } from '../dto/noteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { ProjectNote, ProjectNotesResponseUnion, ProjectNoteUnion } from '../models/project-note';
import { ProjectNoteService } from './project-note.service';

@Resolver(() => ProjectNote)
@UseInterceptors(GqlLoggingInterceptor)
export class ProjectNoteResolver {
  constructor(private readonly noteService: ProjectNoteService) {}

  @Query(() => ProjectNotesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  projectNotes(@Args() noteSearchArgs: NoteSearchArgs): Promise<typeof ProjectNotesResponseUnion> {
    return this.noteService.searchNotes(noteSearchArgs);
  }

  @ResolveField()
  parentNote(@Parent() note) {
    return note?.parentNote?.id;
  }

  @Mutation(() => ProjectNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createProjectNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof ProjectNoteUnion> {
    return this.noteService.createNote({ ...noteArgs, createdBy: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteProjectNote(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.noteService.deleteNote(deleteArgs, user.sub);
  }

  @Mutation(() => ProjectNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateProjectNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof ProjectNoteUnion> {
    return this.noteService.updateNote(noteArgs, user.sub);
  }
}
