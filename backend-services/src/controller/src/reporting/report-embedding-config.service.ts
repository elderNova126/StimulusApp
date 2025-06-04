import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EmbedConfig, PowerBiReportDetails } from './powerbi-models.class';
import { ReportingEmbeddingAuthService } from './report-embedding-auth.service';

@Injectable()
export class ReportingEmbeddingConfigService {
  constructor(private readonly reportingEmbeddingAuthService: ReportingEmbeddingAuthService) {}

  private getAuthHeader(accessToken) {
    // Function to append Bearer against the Access Token
    return 'Bearer '.concat(accessToken);
  }

  private async getRequestHeaders(): Promise<any> {
    // Store authentication token
    // Get the response from the authentication request
    const tokenResponse = await this.reportingEmbeddingAuthService.getAccessToken();

    // Extract AccessToken from the response
    const token = tokenResponse.accessToken;

    return {
      'Content-Type': 'application/json',
      Authorization: this.getAuthHeader(token),
    };
  }

  private async getEmbedTokenForMultipleReportsInSingleWorkspace(
    reportIds,
    datasetIds,
    targetWorkspaceId
  ): Promise<any> {
    const formData = {} as any;

    // Add report ids in the request
    formData.reports = [];
    for (const reportId of reportIds) {
      formData.reports.push({
        id: reportId,
      });
    }

    // Add dataset ids in the request
    formData.datasets = [];
    for (const datasetId of datasetIds) {
      formData.datasets.push({
        id: datasetId,
      });
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData.targetWorkspaces = [];
      formData.targetWorkspaces.push({
        id: targetWorkspaceId,
      });
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = await this.getRequestHeaders();

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const { data: result } = await axios.post(embedTokenApi, formData, {
      headers,
    });

    return result;
  }

  private async getEmbedTokenForSingleReportInSingleWorkspace(reportId, datasetIds, targetWorkspaceId): Promise<any> {
    // Add report id in the request
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
    } as any;

    // Add dataset ids in the request
    formData.datasets = [];
    for (const datasetId of datasetIds) {
      formData.datasets.push({
        id: datasetId,
      });
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData.targetWorkspaces = [];
      formData.targetWorkspaces.push({
        id: targetWorkspaceId,
      });
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = await this.getRequestHeaders();

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const { data: result } = await axios.post(embedTokenApi, formData, {
      headers,
    });

    return result;
  }

  private async getReportInfo(workspaceId, reportId): Promise<any> {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await this.getRequestHeaders();
    // Get report info by calling the PowerBI REST API
    const { data: resultJson } = await axios.get(reportInGroupApi, {
      headers,
    });
    return resultJson;
  }

  async getEmbedParamsReport(workspaceId, reportId): Promise<any> {
    const resultJson = await this.getReportInfo(workspaceId, reportId);

    // Add report data for embedding
    const reportDetails = new PowerBiReportDetails(resultJson.id, resultJson.name, resultJson.embedUrl);

    const reportEmbedConfig = new EmbedConfig();

    // Create mapping for report and Embed URL
    reportEmbedConfig.reportsDetail = [reportDetails];

    // Create list of datasets
    const datasetIds = [resultJson.datasetId];

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await this.getEmbedTokenForSingleReportInSingleWorkspace(
      reportId,
      datasetIds,
      workspaceId
    );

    return reportEmbedConfig;
  }

  async getEmbedParamsForMultipleReportsSingleWorkspace(workspaceId, reportIds): Promise<any> {
    // EmbedConfig object
    const reportEmbedConfig = new EmbedConfig();

    // Create array of embedReports for mapping
    reportEmbedConfig.reportsDetail = [];

    // Create Array of datasets
    const datasetIds = [];

    const reportInfoPromises = [];
    // Get datasets and Embed URLs for all the reports
    for (const reportId of reportIds) {
      reportInfoPromises.push(this.getReportInfo(workspaceId, reportId));
    }

    const reportInfoResults = await Promise.all(reportInfoPromises);

    for (const reportInfo of reportInfoResults) {
      // Store result into PowerBiReportDetails object
      const reportDetails = new PowerBiReportDetails(reportInfo.id, reportInfo.name, reportInfo.embedUrl);

      // Create mapping for reports and Embed URLs
      reportEmbedConfig.reportsDetail.push(reportDetails);

      // Push datasetId of the report into datasetIds array
      datasetIds.push(reportInfo.datasetId);
    }

    // refresh the dataset to update imported tables
    const headers = await this.getRequestHeaders();
    for (const datasetId of datasetIds) {
      const body = {
        notifyOption: 'NoNotification',
      };
      const url = `https://api.powerbi.com/v1.0//myorg/groups/${workspaceId}/datasets/${datasetId}/refreshes`;
      try {
        await axios.post(url, body, { headers });
      } catch (error) {
        console.log(error);
      }
    }
    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await this.getEmbedTokenForMultipleReportsInSingleWorkspace(
      reportIds,
      datasetIds,
      workspaceId
    );
    return reportEmbedConfig;
  }
}
