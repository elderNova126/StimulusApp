import { gql } from '@apollo/client';

const PROJECT_EVALUATION = gql`
  query projectEvaluation($projectId: Float!) {
    projectEvaluation(projectId: $projectId) {
      ... on Evaluation {
        id
        metrics {
          id
          category
          question
          keyId
        }
      }
    }
  }
`;

const SEARCH_TOTALSPEND_DASHBOARD = gql`
  query getTotalSpendDashboard($timePeriodFilter: String, $granularityFilter: String) {
    getTotalSpendDashboard(timePeriodFilter: $timePeriodFilter, granularityFilter: $granularityFilter) {
      ... on TotalSpendDashboardResponse {
        results {
          name
          Spent
        }
        count
        checkPrevYear
      }
    }
  }
`;

const CHECK_TOTALSPENT_DASHBOARD = gql`
  {
    checkDataSpentDashboard {
      ... on TotalSpendDashboardResponse {
        hasData
        prevYear
        currentYear
      }
    }
  }
`;

const EvaluationQueries = {
  PROJECT_EVALUATION,
  SEARCH_TOTALSPEND_DASHBOARD,
  CHECK_TOTALSPENT_DASHBOARD,
};
export default EvaluationQueries;
