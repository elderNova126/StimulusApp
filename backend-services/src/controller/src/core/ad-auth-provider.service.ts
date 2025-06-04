import { AuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/IAuthenticationProvider';
import { AuthenticationProviderOptions } from '@microsoft/microsoft-graph-client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Scope, Injectable } from '@nestjs/common';
import { StimulusLogger } from '../logging/stimulus-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class AdAuthProvider implements AuthenticationProvider {
  private readonly adGraphClientId: string;
  private readonly adGraphClientSecret: string;
  private readonly adGraphTenant: string;
  private readonly adGraphScope: string = 'https://graph.microsoft.com/.default';
  private readonly adGraphGrantType: string = 'client_credentials';
  private readonly adGraphUrl: string;

  constructor(
    private readonly configService: ConfigService,
    protected readonly logger: StimulusLogger
  ) {
    this.adGraphClientId = this.configService.get<string>('AD_GRAPH_CLIENT_ID');
    this.adGraphClientSecret = this.configService.get<string>('AD_GRAPH_CLIENT_SECRET');
    this.adGraphTenant = this.configService.get<string>('AD_GRAPH_TENANT');
    this.adGraphUrl = `https://login.microsoftonline.com/${this.adGraphTenant}/oauth2/v2.0/token`;
    this.logger.context = AdAuthProvider.name;
  }
  async getAccessToken(_authenticationProviderOptions?: AuthenticationProviderOptions): Promise<string> {
    const params = new URLSearchParams();
    params.append('client_id', this.adGraphClientId);
    params.append('scope', this.adGraphScope);
    params.append('grant_type', this.adGraphGrantType);
    params.append('client_secret', this.adGraphClientSecret);
    this.logger.log(this.adGraphUrl);
    const authResultBody = await axios.post(this.adGraphUrl, params);
    return authResultBody.data.access_token;
  }
}
