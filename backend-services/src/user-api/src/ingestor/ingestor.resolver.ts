import { UploadReportUnion } from './../models/blob';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { IngestorService } from './ingestor.service';
import { FileUpload } from 'graphql-upload';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { ContextProviderService } from '../core/context-provider.service';

@Resolver('Ingestor')
@UseInterceptors(GqlLoggingInterceptor)
export class IngestorResolver {
  constructor(
    private readonly ingestorService: IngestorService,
    private readonly contextProviderService: ContextProviderService
  ) {}

  @Mutation(() => UploadReportUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async uploadFile(
    @GqlUser() user,
    @Args({ name: 'file', type: () => GraphQLUpload }) { createReadStream, filename }: FileUpload
  ): Promise<typeof UploadReportUnion> {
    const readStream = createReadStream().on('error', () => false);
    const ret = await this.ingestorService.uploadAzureStream(readStream, filename, user);
    return ret;
  }

  @Mutation(() => UploadReportUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async multipleUpload(
    @Args({ name: 'archiveName', type: () => String }) archiveName: string,
    @Args({ name: 'companyFile', type: () => GraphQLUpload, nullable: true }) companyFile: FileUpload,
    @Args({ name: 'contingencyFile', type: () => GraphQLUpload, nullable: true }) contingencyFile: FileUpload,
    @Args({ name: 'insuranceFile', type: () => GraphQLUpload, nullable: true }) insuranceFile: FileUpload,
    @Args({ name: 'certificationFile', type: () => GraphQLUpload, nullable: true }) certificationFile: FileUpload,
    @Args({ name: 'productFile', type: () => GraphQLUpload, nullable: true }) productFile: FileUpload,
    @Args({ name: 'contactFile', type: () => GraphQLUpload, nullable: true }) contactFile: FileUpload,
    @Args({ name: 'locationFile', type: () => GraphQLUpload, nullable: true }) locationFile: FileUpload,
    @GqlUser() user
  ): Promise<typeof UploadReportUnion> {
    return this.ingestorService.archiveAndUpload(
      {
        archiveName,
        companyFile,
        contingencyFile,
        insuranceFile,
        certificationFile,
        productFile,
        contactFile,
        locationFile,
      },
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async uploadFileCsv(
    @GqlUser() user,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload
  ): Promise<typeof UploadReportUnion> {
    const readStream = createReadStream().on('error', () => false);
    const blobContentType = 'text/csv';
    const { tenantId } = this.contextProviderService.getScopeContext();
    const container = tenantId.toLowerCase() + '-csv';
    const ret = await this.ingestorService.uploadAzureStream(readStream, filename, user, blobContentType, container);
    return ret;
  }
}
