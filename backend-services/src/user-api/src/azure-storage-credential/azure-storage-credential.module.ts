import { Module, Global } from '@nestjs/common';
import { azureStorageCredentialProviders } from './azure-storage-credential.providers';

@Global()
@Module({
  imports: [],
  providers: [...azureStorageCredentialProviders],
  exports: [...azureStorageCredentialProviders],
})
export class AzureStorageCredentialModule {}
