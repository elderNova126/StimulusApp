import { StorageSharedKeyCredential, newPipeline, BlobServiceClient } from '@azure/storage-blob';

export class AzureStorageCredentialService {
  private sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
  );
  private pipeline = newPipeline(this.sharedKeyCredential);
  private blobServiceClient = new BlobServiceClient(process.env.AZURE_STORAGE_CONNECTION_STRING, this.pipeline);

  public async getBlobCredential(): Promise<BlobServiceClient> {
    return this.blobServiceClient;
  }
}
