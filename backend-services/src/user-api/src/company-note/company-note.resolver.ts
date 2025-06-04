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
import { CompanyNote, CompanyNotesResponseUnion, CompanyNoteUnion } from '../models/company-note';
import { CompanyNoteService } from './company-note.service';

@Resolver(() => CompanyNote)
@UseInterceptors(GqlLoggingInterceptor)
export class CompanyNoteResolver {
  constructor(private readonly noteService: CompanyNoteService) {}

  @Query(() => CompanyNotesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  companyNotes(@Args() noteSearchArgs: NoteSearchArgs): Promise<typeof CompanyNotesResponseUnion> {
    return this.noteService.searchNotes(noteSearchArgs);
  }

  @ResolveField()
  parentNote(@Parent() note) {
    return note.parentNote?.id || null;
  }

  @Mutation(() => CompanyNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createCompanyNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof CompanyNoteUnion> {
    return this.noteService.createNote({ ...noteArgs, createdBy: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteCompanyNote(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.noteService.deleteNote(deleteArgs, user.sub);
  }

  @Mutation(() => CompanyNoteUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateCompanyNote(@Args() noteArgs: NoteArgs, @GqlUser() user): Promise<typeof CompanyNoteUnion> {
    return this.noteService.updateNote(noteArgs, user.sub);
  }
}
