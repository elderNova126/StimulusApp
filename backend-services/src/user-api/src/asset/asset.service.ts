import { BlockBlobClient } from '@azure/storage-blob';
import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { AssetsAzureStorageCredentialService } from '../azure-storage-credential/assets-azure-storage-credential.service';
import {
  ASSETS_AZURE_STORAGE_CREDENTIAL,
  AZURE_STORAGE_CREDENTIAL,
} from '../azure-storage-credential/azure-storage-credential.constants';
import { ContextProviderService } from '../core/context-provider.service';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { AssetArgs } from '../dto/assetArgs';
import { AttachmentSearchArgs } from '../dto/attachmentArgs';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { AssetsResponseUnion } from '../models/asset';
import { ActionResponseUnion } from '../models/baseResponse';
import { BlobMetadataMapping, BlobMetadataProperties, BlobObj, BlobResult, BlobResultUnion } from '../models/blob';
import { ProjectAttachmentsResponseUnion } from '../models/projectAttachment';
import {
  AssetSupportedExtensions,
  CONTAINER_ASSET_SUFFIX,
  CONTAINER_COMPANY_SUFFIX,
  CONTAINER_PROJECT_SUFFIX,
  MimeTypeMapping,
  ProjectSupportedExtensions,
} from './asset.constants';
import { CompanyAttachmentSearchArgs } from 'src/dto/companyAttachmentArgs';
import { CompanyAttachmentsResponseUnion } from 'src/models/companyAttachment';

@Injectable()
export class AssetService {
  private readonly dataServiceMethods: any;
  private readonly ONE_MEGABYTE = 1024 * 1024;
  private readonly uploadOptions = { bufferSize: 4 * this.ONE_MEGABYTE, maxBuffers: 20 };

  constructor(
    private readonly contextProviderService: ContextProviderService,
    private readonly logger: StimulusLogger,
    @Inject(AZURE_STORAGE_CREDENTIAL) private readonly azureStorageCredential,
    @Inject(ASSETS_AZURE_STORAGE_CREDENTIAL)
    private readonly attachmentsAzureStorageCredential: AssetsAzureStorageCredentialService,
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.logger.context = AssetService.name;
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async listBlobsInTenantContainer(): Promise<typeof BlobResultUnion> {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const containers = [tenantId.toLowerCase(), tenantId.toLowerCase() + '-csv'];
    const blobsResult = new BlobResult();

    for (const containerName of containers) {
      const containerClient = this.azureStorageCredential.blobServiceClient.getContainerClient(containerName);
      for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
        const blobObj = new BlobObj();
        blobObj.id = blob.name;
        blobObj.source = blob.properties.contentType === 'text/csv' ? 'CSV' : 'JSON';
        blobObj.uploadTime = blob.properties.createdOn;
        for (const property of BlobMetadataProperties) {
          if (blob.metadata[property]) {
            blobObj[BlobMetadataMapping[property]] = blob.metadata[property];
          }
        }
        blobsResult.results.push(blobObj);
      }
      blobsResult.count += blobsResult.results.length;
    }
    return blobsResult;
  }
  getUploadReportsByNames(names: string[]) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUploadReports, {
      nameId: names,
    });
  }

  private getFileNameExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

  private getProjectContainerName() {
    const { tenantId } = this.contextProviderService.getScopeContext();
    return `${tenantId}-${CONTAINER_PROJECT_SUFFIX}`.toLowerCase();
  }

  private getAssetContainerName() {
    const { tenantId } = this.contextProviderService.getScopeContext();
    return `${tenantId}-${CONTAINER_ASSET_SUFFIX}`.toLowerCase();
  }

  async getBlobMetadata(blobURL: string) {
    const pathArray = blobURL.split('/');
    const containerName = pathArray[pathArray.length - 2];
    const containerClient = this.attachmentsAzureStorageCredential.blobServiceClient.getContainerClient(containerName);
    const blobName = pathArray[pathArray.length - 1];
    const blobClient = containerClient.getBlobClient(blobName);
    return await blobClient.getProperties();
  }

  async downloadAttachment(blobURL: string): Promise<NodeJS.ReadableStream> {
    const containerName = this.getProjectContainerName();
    return this.downloadAzureBlob(blobURL, containerName);
  }

  async downloadCompanyAttachment(blobURL: string): Promise<NodeJS.ReadableStream> {
    const containerName = CONTAINER_COMPANY_SUFFIX;
    return this.downloadAzureBlob(blobURL, containerName);
  }

  async downloadAsset(blobURL: string): Promise<NodeJS.ReadableStream> {
    return this.downloadAzureBlob(blobURL);
  }

  private async downloadAzureBlob(blobURL: string, containerName?: string): Promise<NodeJS.ReadableStream> {
    const pathArray = blobURL.split('/');
    const blobName = pathArray[pathArray.length - 1];
    if (!containerName) containerName = pathArray[pathArray.length - 2];
    const containerClient = this.attachmentsAzureStorageCredential.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlobResponse = await blobClient.download();
    return downloadBlobResponse.readableStreamBody;
  }

  async uploadProjectAttachment(stream: Readable, filename: string, user, projectId) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const containerName = `${tenantId}-${CONTAINER_PROJECT_SUFFIX}`.toLowerCase();
    const extension = this.getFileNameExtension(filename);
    if (extension in ProjectSupportedExtensions) {
      this.logger.error(`Wrong file extension for an attachment. Filename: ${filename}`);
      return false;
    }
    const blobName =
      filename.substring(0, filename.lastIndexOf('.')).split(' ').join('_') + `${uuid()}` + '.' + extension;

    const result = await this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchProjects, {
      projectPayload: {
        project: {
          id: projectId,
          deleted: false,
        },
      },
    });
    if (result?.error) {
      this.logger.error(`Project not found, maybe wrong projectId. ProjectId: ${projectId}`);
      return false;
    }
    const project = result.results[0];
    const metadata = {
      tenantId,
      userName: user ? user.given_name + ' ' + user?.family_name : '',
      userId: user?.sub,
      originalName: filename,
      projectId: project.id.toString(),
    };
    const { blockBlobClient } = await this.uploadAttachment(stream, blobName, containerName, metadata);
    try {
      const blobProperties = await blockBlobClient.getProperties();
      const projectAttachment = controller.ProjectAttachment.fromObject({
        createdBy: metadata.userId,
        filename: blobName,
        originalFilename: filename,
        url: blockBlobClient.url,
        size: blobProperties.contentLength,
        project: {
          id: project.id,
        },
      });
      return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createProjectAttachment, {
        projectAttachment: controller.ProjectAttachment.toObject(projectAttachment, { defaults: false }),
      });
    } catch (e) {
      this.logger.error(`Failed to upload attachment with error ${e}`);
    }
  }

  async uploadCompanyAttachment(stream: Readable, filename: string, user, companyId, isPrivate, type) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const containerName = CONTAINER_COMPANY_SUFFIX.toLowerCase();
    const extension = this.getFileNameExtension(filename);
    if (extension in ProjectSupportedExtensions) {
      this.logger.error(`Wrong file extension for an attachment. Filename: ${filename}`);
      return false;
    }
    const blobName =
      filename.substring(0, filename.lastIndexOf('.')).split(' ').join('_') + `${uuid()}` + '.' + extension;

    const metadata = {
      tenantId,
      userName: user ? user.given_name + ' ' + user?.family_name : '',
      userId: user?.sub,
      originalName: filename,
      companyId,
      isPrivate: isPrivate.toString(),
    };
    const { blockBlobClient } = await this.uploadAttachment(stream, blobName, containerName, metadata);
    try {
      const blobProperties = await blockBlobClient.getProperties();
      const companyAttachment = controller.CompanyAttachment.fromObject({
        createdBy: metadata.userId,
        filename: blobName,
        originalFilename: filename,
        url: blockBlobClient.url,
        size: blobProperties.contentLength,
        isPrivate: isPrivate,
        type: type,
        company: {
          id: companyId,
        },
        tenant: {
          id: tenantId,
        },
      });
      return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCompanyAttachment, {
        companyAttachment: controller.CompanyAttachment.toObject(companyAttachment, { defaults: false }),
      });
    } catch (e) {
      this.logger.error(`Failed to upload attachment with error ${e}`);
    }
  }

  searchCompanyAttachmentsByCompany(
    attachmentSearchArgs: CompanyAttachmentSearchArgs
  ): Promise<typeof CompanyAttachmentsResponseUnion> {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const { orderBy, direction, companyId, page, limit, type } = attachmentSearchArgs;
    const pagination = { page, limit };
    const order = { orderBy, direction };
    const attachmentSearchGrpcArgs: any = { companyId, type, tenantId, pagination, order };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getCompanyAttachmentsByCompanyId,
      attachmentSearchGrpcArgs
    );
  }

  searchCompanyAttachments(
    attachmentSearchArgs: CompanyAttachmentSearchArgs
  ): Promise<typeof CompanyAttachmentsResponseUnion> {
    const { orderBy, direction, page, limit, ...companyAttachment } = attachmentSearchArgs;
    const pagination = { page, limit };
    const order = { orderBy, direction };
    const attachmentSearchGrpcArgs: any = { companyAttachment, pagination, order };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getCompanyAttachments,
      attachmentSearchGrpcArgs
    );
  }

  searchAttachments(attachmentSearchArgs: AttachmentSearchArgs): Promise<typeof ProjectAttachmentsResponseUnion> {
    const { orderBy, direction, projectId, page, limit, ...projectAttachment } = attachmentSearchArgs;
    const pagination = { page, limit };
    const order = { orderBy, direction };
    const attachmentSearchGrpcArgs: any = { projectAttachment, pagination, order };

    if (projectId) {
      attachmentSearchGrpcArgs.projectAttachment.project = { id: projectId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getProjectAttachments,
      attachmentSearchGrpcArgs
    );
  }

  private deleteAzureBlob(containerName: string, filename: string) {
    const containerClient = this.attachmentsAzureStorageCredential.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(filename);
    blobClient.delete();
  }

  deleteAttachment(attachment, userId: string): Promise<typeof ActionResponseUnion> {
    const containerName = this.getProjectContainerName();
    try {
      this.deleteAzureBlob(containerName, attachment.filename);
    } catch (err) {
      this.logger.error(`Failed to remove attachment with error ${err}`);
    }
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteProjectAttachment, {
      id: attachment.id,
      userId,
    });
  }

  deleteCompanyAttachment(attachment, userId: string): Promise<typeof ActionResponseUnion> {
    const containerName = CONTAINER_COMPANY_SUFFIX;
    try {
      this.deleteAzureBlob(containerName, attachment.filename);
    } catch (err) {
      this.logger.error(`Failed to remove attachment with error ${err}`);
    }
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteCompanyAttachment, {
      id: attachment.id,
      userId,
    });
  }

  async uploadAttachment(_stream: Readable, blobName: string, containerName: string, metadata) {
    const containerClient = this.attachmentsAzureStorageCredential.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
    if (!(await containerClient.exists())) {
      this.logger.error(`Container ${containerName} does not exists!`);
      return { result: false };
    }
    try {
      const result = await blockBlobClient.uploadStream(
        _stream,
        this.uploadOptions.bufferSize,
        this.uploadOptions.maxBuffers,
        {
          blobHTTPHeaders: {
            blobContentType: MimeTypeMapping[this.getFileNameExtension(blobName)] || 'application/octet-stream',
          },
          metadata,
        }
      );
      return { result, blockBlobClient };
    } catch (err) {
      this.logger.error(
        `Error saving attachment in azure ${err} blobName: ${blobName}, containerName: ${containerName}, metadata: ${JSON.stringify(
          metadata
        )}`
      );
      return { result: false };
    }
  }

  async uploadAsset(stream: Readable, filename: string, user, companyId) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const containerName = `${tenantId}-${CONTAINER_ASSET_SUFFIX}`.toLowerCase();
    const extension = this.getFileNameExtension(filename);
    if (extension in AssetSupportedExtensions) {
      this.logger.error(`Wrong file extension for an attachment. Filename: ${filename}`);
      return false;
    }
    const blobName =
      filename.substring(0, filename.lastIndexOf('.')).split(' ').join('_') + `${uuid()}` + '.' + extension;
    const metadata = {
      tenantId,
      userName: user ? user.given_name + ' ' + user?.family_name : '',
      userId: user?.sub,
      originalName: filename,
    };

    if (companyId) {
      const result = await this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchCompanies, {
        company: {
          id: companyId,
        },
      });
      if (result?.error) {
        this.logger.error(`Company not found, maybe wrong companyId. ProjectId: ${companyId}`);
        return false;
      }
      const company = result.results[0];
      const keyCompanyId = 'companyId';
      metadata[keyCompanyId] = company.id;
    }

    const { blockBlobClient } = await this.uploadAttachment(stream, blobName, containerName, metadata);
    const assetWithRelation = controller.AssetWithRelation.fromObject({
      asset: {
        createdBy: metadata.userId,
        filename: blobName,
        originalFilename: filename,
        url: blockBlobClient.url,
      },
    });

    if (companyId) {
      assetWithRelation.company = { id: companyId };
    } else {
      assetWithRelation.user = { externalAuthSystemId: metadata.userId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createAsset, {
      assetPayload: controller.AssetWithRelation.toObject(assetWithRelation, { defaults: false }),
    });
  }

  deleteAsset(assetWithRelation, userId: string): Promise<typeof ActionResponseUnion> {
    const { asset } = assetWithRelation;
    const containerName = this.getAssetContainerName();
    this.deleteAzureBlob(containerName, asset.filename);
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteAsset, {
      id: asset.id,
      userId,
    });
  }

  searchAssets(assetSearchArgs: AssetArgs): Promise<typeof AssetsResponseUnion> {
    const { companyId, userId, id } = assetSearchArgs;
    const assetSearchGrpcArgs: any = { assetPayload: { ...(id && { asset: { id } }) } };

    if (companyId) {
      assetSearchGrpcArgs.assetPayload.company = { id: companyId };
    }

    if (userId) {
      assetSearchGrpcArgs.assetPayload.user = { externalAuthSystemId: userId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getAssets, assetSearchGrpcArgs);
  }
}
