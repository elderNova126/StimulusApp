import { Injectable } from '@nestjs/common';
import { KeyVaultSecret, GetSecretOptions, SecretClient } from '@azure/keyvault-secrets';
import { ConfigService } from '@nestjs/config';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class StimulusSecretClientService extends SecretClient {
  private readonly configService: ConfigService;
  constructor(configService: ConfigService) {
    const credential = new DefaultAzureCredential();
    const azureVaultUrl = configService.get<string>('AZURE_VAULT_URL');
    super(azureVaultUrl, credential);
    this.configService = configService;
  }
  public getSecret(secretName: string, options?: GetSecretOptions): Promise<KeyVaultSecret> {
    const useLocalKvEnvVarSecrets = this.configService.get<string>('USE_LOCAL_KV_ENV_VAR_SECRETS');
    if (useLocalKvEnvVarSecrets === 'true') {
      return Promise.resolve({
        name: secretName,
        value: this.configService.get<string>(secretName),
      } as KeyVaultSecret);
    } else {
      return super.getSecret(secretName, options);
    }
  }
}
