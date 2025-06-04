import { ActionResponseUnion } from '../models/baseResponse';
import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { NoteSearchArgs, NoteArgs } from '../dto/noteArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GqlUser } from '../core/decorators/gql-decorators';
import { CompanyEvaluationNoteService } from './company-evaluation-note.service';
import {
  CompanyEvaluationNote,
  CompanyEvaluationNotesResponseUnion,
  CompanyEvaluationNoteUnion,
} from '../models/company-evaluation-note';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';

@Resolver(() => CompanyEvaluationNote)
@UseInterceptors(GqlLoggingInterceptor)
export class CompanyEvaluationNoteResolver {
  constructor(private readonly noteService: CompanyEvaluationNoteService) {}

  @Query(() => CompanyEvaluationNotesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  companyEvaluationNotes(@Args() noteSearchArgs: NoteSearchArgs): Promise<typeof CompanyEvaluationNotesResponseUnion> {
    return this.noteService.searchNotes(noteSearchArgs);
  }

  @ResolveField()
  parentNote(@Parent() note) {
    return note.parentNote?.id || null;
  }

  @Mutation(() => CompanyEvaluationNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createCompanyEvaluationNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof CompanyEvaluationNoteUnion> {
    return this.noteService.createNote({ ...noteArgs, createdBy: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteCompanyEvaluationNote(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.noteService.deleteNote(deleteArgs, user.sub);
  }

  @Mutation(() => CompanyEvaluationNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateCompanyEvaluationNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof CompanyEvaluationNoteUnion> {
    return this.noteService.updateNote(noteArgs, user.sub);
  }
}
