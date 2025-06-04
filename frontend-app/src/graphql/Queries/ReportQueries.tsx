import { gql } from '@apollo/client';

const GET_REPORTS = gql`
  query getAllReports {
    reports {
      ... on ReportResponse {
        reports {
          id
          type
          code
          workspaceId
          reportId
        }
      }
    }
  }
`;

const GET_EMBED_REPORT_VARIABLES = gql`
  query reportsParameters($workspaceId: String!, $reportIds: [String!]) {
    reportsParameters(workspaceId: $workspaceId, reportIds: $reportIds) {
      ... on EmbedParamsResponse {
        reportsDetail {
          reportId
          reportName
          embedUrl
        }
        embedToken {
          token
          tokenId
          expiration
        }
      }
    }
  }
`;

const DATA_FILES_LIST = gql`
  query getUploadReports {
    getUploadReports {
      ... on BlobReportResponse {
        results {
          blob {
            name
            source
            uploadTime
            userName
          }
          uploadReport {
            id
            status
            fileName
            affectedCompanies
            errorsCount
          }
        }
      }
    }
  }
`;

const ReportQueries = {
  DATA_FILES_LIST,
  GET_EMBED_REPORT_VARIABLES,
  GET_REPORTS,
};

export default ReportQueries;
