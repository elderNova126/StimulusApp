import { gql } from '@apollo/client';

const GET_REPORT_DATA = gql`
  query reportData($tenantName: String!) {
    reportData(tenantName: $tenantName) {
      ... on ReportDataResponse {
        reportData {
          accessToken
          embedUrl
          reportPage
        }
      }
    }
  }
`;

const ReportDataQueries = {
  GET_REPORT_DATA,
};

export default ReportDataQueries;
