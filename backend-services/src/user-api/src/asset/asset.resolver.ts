import { NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { AssetArgs } from '../dto/assetArgs';
import { AttachmentSearchArgs } from '../dto/attachmentArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { AssetsResponseUnion, AssetUnion } from '../models/asset';
import { ActionResponseUnion } from '../models/baseResponse';
import { BlobResultUnion } from '../models/blob';
import { ProjectAttachmentsResponseUnion, ProjectAttachmentUnion } from '../models/projectAttachment';
import { BlobReportUnion } from './../models/blob';
import { AssetService } from './asset.service';
import { CompanyAttachmentsResponseUnion } from 'src/models/companyAttachment';
import { CompanyAttachmentSearchArgs } from 'src/dto/companyAttachmentArgs';

@Resolver()
@UseInterceptors(GqlLoggingInterceptor)
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}

  @Query(() => BlobResultUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async listFilesFromSources(): Promise<typeof BlobResultUnion> {
    return this.assetService.listBlobsInTenantContainer();
  }

  @Query(() => BlobReportUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async getUploadReports(): Promise<typeof BlobReportUnion> {
    const response: any = await this.assetService.listBlobsInTenantContainer();
    let uploadReports;

    if (response.results?.length) {
      const uploadReportsResponse = await this.assetService.getUploadReportsByNames(
        response.results.map((blob) => blob.id)
      );
      uploadReports = uploadReportsResponse.results ?? [];
    }

    return {
      results: uploadReports
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .map((uploadReport) => ({
          blob: response.results.find((blob) => blob.id === uploadReport.fileName),
          uploadReport,
        })),
      count: response.results.length,
    };
  }

  @Mutation(() => ProjectAttachmentUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async uploadProjectAttachment(
    @GqlUser() user,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Args() attachmentSearchArgs: AttachmentSearchArgs
  ): Promise<typeof ProjectAttachmentUnion> {
    const { projectId } = attachmentSearchArgs;
    const readStream = createReadStream().on('error', () => false);
    const ret = await this.assetService.uploadProjectAttachment(readStream, filename, user, projectId);
    return ret;
  }

  @Query(() => ProjectAttachmentsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  projectAttachmentsDetails(
    @Args() assetSearchArgs: AttachmentSearchArgs
  ): Promise<typeof ProjectAttachmentsResponseUnion> {
    return this.assetService.searchAttachments(assetSearchArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async deleteProjectAttachment(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    const { results, count }: any = await this.assetService.searchAttachments(deleteArgs);
    if (count === 0) {
      throw new NotFoundException();
    }
    const asset = results[0];

    return this.assetService.deleteAttachment(asset, user.sub);
  }

  @Mutation(() => CompanyAttachmentsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async uploadCompanyAttachment(
    @GqlUser() user,
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args() attachmentSearchArgs: CompanyAttachmentSearchArgs
  ): Promise<typeof CompanyAttachmentsResponseUnion> {
    const { companyId, isPrivate, type } = attachmentSearchArgs;
    const results = [];

    for (const file of files) {
      const { createReadStream, filename } = await file;
      const readStream = createReadStream().on('error', () => false);
      const result = await this.assetService.uploadCompanyAttachment(
        readStream,
        filename,
        user,
        companyId,
        isPrivate,
        type
      );
      results.push(result);
    }

    return { results, count: results.length };
  }

  @Query(() => CompanyAttachmentsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  companyAttachmentsDetails(
    @Args() assetSearchArgs: CompanyAttachmentSearchArgs
  ): Promise<typeof CompanyAttachmentsResponseUnion> {
    return this.assetService.searchCompanyAttachmentsByCompany(assetSearchArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async deleteCompanyAttachment(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    const { results, count }: any = await this.assetService.searchCompanyAttachments(deleteArgs);
    if (count === 0) {
      throw new NotFoundException();
    }
    const asset = results[0];

    return this.assetService.deleteCompanyAttachment(asset, user.sub);
  }

  @Mutation(() => AssetUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async uploadAsset(
    @GqlUser() user,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Args() assetArgs: AssetArgs
  ): Promise<typeof AssetUnion> {
    const { companyId } = assetArgs;
    const readStream = createReadStream().on('error', () => false);
    const ret = await this.assetService.uploadAsset(readStream, filename, user, companyId);
    return ret.asset;
  }

  @Query(() => AssetsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  assetDetails(@Args() assetSearchArgs: AssetArgs, @GqlUser() user): Promise<typeof AssetsResponseUnion> {
    if (Object.keys(assetSearchArgs).length !== 0) return this.assetService.searchAssets(assetSearchArgs);
    else return this.assetService.searchAssets({ userId: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async deleteAsset(@Args() deleteArgs: AssetArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    const { results }: any = await this.assetService.searchAssets(deleteArgs);
    let asset;
    if (results?.length > 0) asset = results[0];
    else throw new NotFoundException();
    return this.assetService.deleteAsset(asset, user.sub);
  }
}
