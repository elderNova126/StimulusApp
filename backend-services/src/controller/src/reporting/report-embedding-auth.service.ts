import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationContext } from 'adal-node';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';

@Injectable()
export class ReportingEmbeddingAuthService {
  private readonly tenantPowerBiAuthorityUrl: string;
  private readonly powerBiScope: string;
  private readonly powerBiClientId: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly stimulusSecretClientService: StimulusSecretClientService
  ) {
    const powerBiAuthorityUrl = this.configService.get<string>('POWER_BI_AUTHORITY_URL');
    const powerBiTenantId = this.configService.get<string>('POWER_BI_TENANT_ID');
    this.tenantPowerBiAuthorityUrl = powerBiAuthorityUrl.replace('common', powerBiTenantId);
    this.powerBiScope = this.configService.get<string>('POWER_BI_SCOPE');
    this.powerBiClientId = this.configService.get<string>('POWER_BI_CLIENT_ID');
  }

  private getPowerBiCLientSecretName(): string {
    return `POWER-BI-CLIENT-SECRET`;
  }

  async getAccessToken(): Promise<any> {
    const context = new AuthenticationContext(this.tenantPowerBiAuthorityUrl);
    const { value: powerBiClientSecret } = await this.stimulusSecretClientService.getSecret(
      this.getPowerBiCLientSecretName()
    );
    return new Promise((resolve, reject) => {
      context.acquireTokenWithClientCredentials(
        this.powerBiScope,
        this.powerBiClientId,
        powerBiClientSecret,
        (err, tokenResponse) => {
          if (err) {
            reject(tokenResponse == null ? err : tokenResponse);
          }
          resolve(tokenResponse);
        }
      );
    });
  }
}
