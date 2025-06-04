import { StorageSharedKeyCredential, newPipeline, BlobServiceClient } from '@azure/storage-blob';

export class AssetsAzureStorageCredentialService {
  private sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.ASSETS_AZURE_STORAGE_ACCOUNT_NAME,
    process.env.ASSETS_AZURE_STORAGE_ACCOUNT_ACCESS_KEY
  );
  private pipeline = newPipeline(this.sharedKeyCredential);
  public blobServiceClient = new BlobServiceClient(process.env.ASSETS_AZURE_STORAGE_CONNECTION_STRING, this.pipeline);

  public async getBlobCredential(): Promise<BlobServiceClient> {
    return this.blobServiceClient;
  }
}
