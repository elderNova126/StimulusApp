import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ContactResponseUnion, ContactUnion } from '../models/contact';
import { ContactService } from './contact.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { ContactSearchArgs, ContactArgs } from '../dto/contactArgs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TracingArgs } from '../dto/tracingArgs';
import { GqlUser } from '../core/decorators/gql-decorators';

@Resolver('Contact')
@UseInterceptors(GqlLoggingInterceptor)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Query(() => ContactResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  contacts(@Args() contactSearchArgs: ContactSearchArgs): Promise<typeof ContactResponseUnion> {
    return this.contactService.searchContacts(contactSearchArgs);
  }

  @Mutation(() => ContactUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createContact(
    @Args() contactArgs: ContactArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ContactUnion> {
    return this.contactService.createContact(contactArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteContact(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.contactService.deleteContact(deleteArgs);
  }

  @Mutation(() => ContactUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateContact(
    @Args() contactArgs: ContactArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ContactUnion> {
    return this.contactService.updateContact(contactArgs, tracingArgs, user.sub);
  }
}
