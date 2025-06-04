import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import guid from 'guid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const msal = require('@azure/msal-node');

class PowerBiReportDetails {
  id: string;
  name: string;
  embedUrl: string;

  constructor(id: string, name: string, embedUrl: string) {
    this.id = id;
    this.name = name;
    this.embedUrl = embedUrl;
  }
}

class EmbedConfig {
  public type: any;
  public reportsDetail: PowerBiReportDetails[];
  public embedToken: any;
}

@Injectable()
export class ReportService {
  private config: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly stimulusSecretClientService: StimulusSecretClientService
  ) {}

  private getPowerBiClientSecretName(): string {
    return `POWER-BI-CLIENT-SECRET`;
  }

  async getReportData(tenantName: string) {
    const { value: powerBiClientSecret } = await this.stimulusSecretClientService.getSecret(
      this.getPowerBiClientSecretName()
    );

    this.config = this.createConfig(tenantName, powerBiClientSecret);
    const configCheckResult = this.validateConfig();

    if (configCheckResult) {
      throw new HttpException('Invalid configuration', HttpStatus.BAD_REQUEST);
    }

    const result = await this.getEmbedInfo(tenantName);
    // console.log(result);

    return result;
  }

  private createConfig(tenantName: string, powerBiClientSecret: string) {
    const config = {
      powerBiApiUrl: this.configService.get<string>('POWER_BI_API_URL'),
      authenticationMode: this.configService.get<string>('POWER_BI_AUTH_MODE'),
      workspaceId: this.configService.get<string>('POWER_BI_WORKSPACE_ID'),
      reportId: this.configService.get<string>('POWER_BI_REPORT_ID'),
      tenantId: this.configService.get<string>('POWER_BI_TENANT_ID'),
      clientId: this.configService.get<string>('POWER_BI_CLIENT_ID'),
      clientSecret: powerBiClientSecret,
      authorityUrl: this.configService.get<string>('POWER_BI_AUTHORITY_URL'),
      scopeBase: this.configService.get<string>('POWER_BI_SCOPE'),
      pbiRoles: ['client_filter'],
      pbiUsername: tenantName,
    };
    return config;
  }

  private validateConfig() {
    const config = this.config;
    if (!config.authenticationMode) {
      return 'AuthenticationMode is empty. Please choose MasterUser or ServicePrincipal in config.json.';
    }

    if (
      config.authenticationMode.toLowerCase() !== 'masteruser' &&
      config.authenticationMode.toLowerCase() !== 'serviceprincipal'
    ) {
      return 'AuthenticationMode is wrong. Please choose MasterUser or ServicePrincipal in config.json';
    }

    if (!config.clientId) {
      return 'ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.';
    }

    if (!guid.isGuid(config.clientId)) {
      return 'ClientId must be a Guid object. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.';
    }

    if (!config.reportId) {
      return 'ReportId is empty. Please select a report you own and fill its Id in config.json.';
    }

    if (!guid.isGuid(config.reportId)) {
      return 'ReportId must be a Guid object. Please select a report you own and fill its Id in config.json.';
    }

    if (!config.workspaceId) {
      return 'WorkspaceId is empty. Please select a group you own and fill its Id in config.json.';
    }

    if (!guid.isGuid(config.workspaceId)) {
      return 'WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in config.json.';
    }

    if (!config.authorityUrl) {
      return 'AuthorityUrl is empty. Please fill valid AuthorityUrl in config.json.';
    }

    if (config.authenticationMode.toLowerCase() === 'masteruser') {
      if (!config.pbiUsername || !config.pbiUsername.trim()) {
        return 'PbiUsername is empty. Please fill Power BI username in config.json.';
      }

      if (!config.pbiPassword || !config.pbiPassword.trim()) {
        return 'PbiPassword is empty. Please fill password of Power BI username in config.json.';
      }
    } else if (config.authenticationMode.toLowerCase() === 'serviceprincipal') {
      if (!config.clientSecret || !config.clientSecret.trim()) {
        return 'ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in config.json.';
      }

      if (!config.tenantId) {
        return 'TenantId is empty. Please fill the TenantId in config.json.';
      }

      if (!guid.isGuid(config.tenantId)) {
        return 'TenantId must be a Guid object. Please select a workspace you own and fill its Id in config.json.';
      }
    }
  }

  private async getEmbedInfo(tenantName: string) {
    const config = this.config;
    // Get the Report Embed details

    // Get report details and embed token
    const embedParams = await this.getEmbedParamsForSingleReport(config.workspaceId, config.reportId, tenantName);

    const accessToken: string = embedParams.embedToken.token;
    const { name: reportPage, embedUrl } = embedParams.reportsDetail[0];

    return {
      reportData: {
        accessToken: accessToken,
        embedUrl: embedUrl,
        reportPage: reportPage,
      },
    };
  }

  /**
   * Get embed params for a single report for a single workspace
   * @param {string} workspaceId
   * @param {string} reportId
   * @param {string} additionalDatasetId - Optional Parameter
   * @return EmbedConfig object
   */
  async getEmbedParamsForSingleReport(workspaceId, reportId, tenantName, additionalDatasetId = null) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await this.getRequestHeader();
    // // Get report info by calling the PowerBI REST API
    const response = await axios.get(reportInGroupApi, { headers });
    const resultJson = response.data;

    // Add report data for embedding
    const reportDetails = new PowerBiReportDetails(resultJson.id, resultJson.name, resultJson.embedUrl);
    const reportEmbedConfig = new EmbedConfig();

    // Create mapping for report and Embed URL
    reportEmbedConfig.reportsDetail = [reportDetails];

    // Create list of datasets
    const datasetIds = [resultJson.datasetId];

    // Append additional dataset to the list to achieve dynamic binding later
    if (additionalDatasetId) {
      datasetIds.push(additionalDatasetId);
    }
    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await this.getEmbedTokenForSingleReportSingleWorkspace(
      reportId,
      datasetIds,
      workspaceId,
      tenantName
    );

    return reportEmbedConfig;
  }

  /**
   * Get Embed token for single report, multiple datasets, and an optional target workspace
   * @param {string} reportId
   * @param {Array<string>} datasetIds
   * @param {string} targetWorkspaceId - Optional Parameter
   * @return EmbedToken
   */
  async getEmbedTokenForSingleReportSingleWorkspace(reportId, datasetIds, targetWorkspaceId, tenantName) {
    // Add report id in the request
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
    };

    // Add dataset ids in the request
    formData['datasets'] = [];
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      });
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = [];
      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      });
    }

    // console.log('tenantName', tenantName);

    formData['identities'] = [];
    formData['identities'].push({
      username: tenantName,
      roles: ['client_filter'],
      datasets: datasetIds,
    });

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = await this.getRequestHeader();

    const { data: result } = await axios.post(embedTokenApi, formData, { headers });

    return result;
  }

  /**
   * Get Request header
   * @return Request header with Bearer token
   */
  async getRequestHeader() {
    // Get the response from the authentication request
    const tokenResponse = await this.getAccessToken();

    // Extract AccessToken from the response
    const token = tokenResponse.accessToken;
    return {
      'Content-Type': 'application/json',
      Authorization: this.getAuthHeader(token),
    };
  }

  private async getAccessToken() {
    const config = this.config;
    // Create a config variable that store credentials from config.json

    const msalConfig = {
      auth: {
        clientId: config.clientId,
        authority: `${config.authorityUrl}${config.tenantId}`,
        clientSecret: '',
      },
    };
    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === 'masteruser') {
      const clientApplication = new msal.PublicClientApplication(msalConfig);

      const usernamePasswordRequest = {
        scopes: [config.scopeBase],
        username: config.pbiUsername,
        password: config.pbiPassword,
      };

      return clientApplication.acquireTokenByUsernamePassword(usernamePasswordRequest);
    }

    // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    if (config.authenticationMode.toLowerCase() === 'serviceprincipal') {
      msalConfig.auth.clientSecret = config.clientSecret;
      const clientApplication = new msal.ConfidentialClientApplication(msalConfig);

      const clientCredentialRequest = {
        scopes: [config.scopeBase],
      };
      return clientApplication.acquireTokenByClientCredential(clientCredentialRequest);
    }
  }

  private getAuthHeader(accessToken) {
    // Function to append Bearer against the Access Token
    return 'Bearer '.concat(accessToken);
  }
}
