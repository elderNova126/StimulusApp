import { Scope } from '@nestjs/common';
import { AssetsAzureStorageCredentialService } from './assets-azure-storage-credential.service';
import { ASSETS_AZURE_STORAGE_CREDENTIAL, AZURE_STORAGE_CREDENTIAL } from './azure-storage-credential.constants';
import { AzureStorageCredentialService } from './azure-storage-credential.service';

export const azureStorageCredentialProviders = [
  {
    provide: ASSETS_AZURE_STORAGE_CREDENTIAL,
    scope: Scope.REQUEST,
    useFactory: async (azureStorageCredentialService: AssetsAzureStorageCredentialService) => {
      return await azureStorageCredentialService.getBlobCredential();
    },
    inject: [ASSETS_AZURE_STORAGE_CREDENTIAL],
  },
  {
    provide: AZURE_STORAGE_CREDENTIAL,
    scope: Scope.REQUEST,
    useFactory: async (azureStorageCredentialService: AzureStorageCredentialService) => {
      return await azureStorageCredentialService.getBlobCredential();
    },
    inject: [AZURE_STORAGE_CREDENTIAL],
  },
  {
    provide: AZURE_STORAGE_CREDENTIAL,
    useExisting: AzureStorageCredentialService,
  },
  {
    provide: ASSETS_AZURE_STORAGE_CREDENTIAL,
    useExisting: AssetsAzureStorageCredentialService,
  },
  AzureStorageCredentialService,
  AssetsAzureStorageCredentialService,
];
