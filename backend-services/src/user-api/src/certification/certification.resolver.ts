import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from 'src/core/decorators/gql-decorators';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { CertificationArgs, CertificationSearchArgs } from '../dto/certificationArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { CertificationResultUnion, CertificationUnion } from '../models/certification';
import { CertificationService } from './certification.service';

@Resolver('Certification')
@UseInterceptors(GqlLoggingInterceptor)
export class CertificationResolver {
  constructor(private readonly certificationService: CertificationService) {}

  @Query(() => [CertificationResultUnion])
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  certifications(@Args() certificationSearchArgs: CertificationSearchArgs) {
    return this.certificationService.searchCertifications(certificationSearchArgs);
  }

  @Mutation(() => CertificationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createCertification(
    @Args() certificationSearchArgs: CertificationSearchArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ) {
    return this.certificationService.createCertification(certificationSearchArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteCertification(@Args() deleteArgs: DeleteArgs) {
    return this.certificationService.deleteCertification(deleteArgs);
  }

  @Mutation(() => CertificationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateCertification(
    @Args() certificationArgs: CertificationArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof CertificationUnion> {
    return this.certificationService.updateCertification(certificationArgs, tracingArgs, user.sub);
  }
}
