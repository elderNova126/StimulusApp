import { Inject, Injectable } from '@nestjs/common';
import archiver from 'archiver';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { AZURE_STORAGE_CREDENTIAL } from '../azure-storage-credential/azure-storage-credential.constants';
import { ContextProviderService } from '../core/context-provider.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ControllerGrpcClientService } from './../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from './../core/proto.constants';
import { UploadReportUnion } from './../models/blob';
import { UPLOAD_BLOB_PERMISSIONS, UPLOAD_CONTAINER } from './ingestor.constants';
import { SAS } from './sas.interface';

@Injectable()
export class IngestorService {
  private readonly dataServiceMethods: any;

  constructor(
    private readonly contextProviderService: ContextProviderService,
    private readonly logger: StimulusLogger,
    @Inject(AZURE_STORAGE_CREDENTIAL) private readonly azureStorageCredential,
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.logger.context = IngestorService.name;
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  private getContainerName(tenantId: string) {
    return tenantId.toLowerCase();
  }

  async archiveAndUpload(args: any, user) {
    const {
      archiveName,
      companyFile,
      certificationFile,
      insuranceFile,
      contactFile,
      contingencyFile,
      productFile,
      locationFile,
    } = args;

    const manifest: any = { timeStamp: new Date().toLocaleString() };

    const archive = archiver('zip');
    if (companyFile) {
      const readStream = companyFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: companyFile.filename });
      manifest.company = [companyFile.filename];
    }
    if (certificationFile) {
      const readStream = certificationFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: certificationFile.filename });
      manifest.certification = [certificationFile.filename];
    }
    if (insuranceFile) {
      const readStream = insuranceFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: insuranceFile.filename });
      manifest.insurance = [insuranceFile.filename];
    }
    if (contactFile) {
      const readStream = contactFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: contactFile.filename });
      manifest.contact = [contactFile.filename];
    }
    if (contingencyFile) {
      const readStream = contingencyFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: contingencyFile.filename });
      manifest.contingency = [contingencyFile.filename];
    }
    if (productFile) {
      const readStream = productFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: productFile.filename });
      manifest.product = [productFile.filename];
    }
    if (locationFile) {
      const readStream = locationFile.createReadStream().on('error', () => false);
      archive.append(readStream, { name: locationFile.filename });
      manifest.location = [locationFile.filename];
    }
    archive.append(JSON.stringify(manifest), { name: 'manifest.json' });

    archive.finalize();
    return this.uploadAzureStream(archive, `${archiveName.replace('.zip', '')}.zip`, user);
  }

  async uploadAzureStream(
    stream: Readable,
    blobName: string,
    user,
    blobContentType = 'application/zip',
    containerName?
  ): Promise<typeof UploadReportUnion> {
    const ONE_MEGABYTE = 1024 * 1024;
    const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
    const { tenantId } = this.contextProviderService.getScopeContext();
    if (typeof containerName === 'undefined') containerName = this.getContainerName(tenantId);
    const containerClient = this.azureStorageCredential.blobServiceClient.getContainerClient(containerName);
    const blobNameId = blobName.replace('.zip', `${uuid()}.zip`);
    const blockBlobClient = containerClient.getBlockBlobClient(blobNameId);
    const metadata = {
      tenantId,
      userName: user ? user.given_name + ' ' + user?.family_name : '',
      userId: user?.sub,
      originalName: blobName,
    };
    if (!(await containerClient.exists())) {
      this.logger.log(`Container ${containerName} does not exists!`);
      return { error: true };
    }
    try {
      const report = await this.controllerGrpcClientDataService.callProcedure(
        this.dataServiceMethods.createUploadReport,
        {
          userId: user?.sub,
          fileName: blobNameId,
        }
      );

      await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
        blobHTTPHeaders: { blobContentType },
        metadata,
      });
      return report;
    } catch (err) {
      return { error: true };
    }
  }

  async generateSAS(): Promise<SAS> {
    const startsDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const containerClient = this.azureStorageCredential.blobServiceClient.getContainerClient(UPLOAD_CONTAINER);
    const sas = await containerClient.generateSasUrl({
      startsOn: startsDate,
      expiresOn: expiryDate,
      permissions: UPLOAD_BLOB_PERMISSIONS,
    });
    return { sas };
  }
}
