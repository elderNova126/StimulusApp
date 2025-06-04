export class EmbedConfig {
  reportsDetail: PowerBiReportDetails[];
  embedToken: EmbedToken;
}

export class EmbedToken {
  expiration: Date;
  token: string;
  tokenId: string;
}

export class PowerBiReportDetails {
  reportId: string;
  reportName: string;
  embedUrl: string;
  constructor(reportId: string, reportName: string, embedUrl: string) {
    this.reportId = reportId;
    this.reportName = reportName;
    this.embedUrl = embedUrl;
  }
}
