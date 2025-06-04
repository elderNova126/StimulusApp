import { gql } from '@apollo/client';

const NOTIFICATION_SUBSCRIBE_CATEGORY_GQL = gql`
  mutation subscribeToCategoryTopic($category: String!) {
    subscribeToCategoryTopic(category: $category) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL = gql`
  mutation unsubscribeFromCategoryTopic($category: String!) {
    unsubscribeFromCategoryTopic(category: $category) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;
const NOTIFICATION_SUBSCRIBE_GQL = gql`
  mutation subscribeToTopic($projectIds: [Float!], $companyIds: [String!], $projectCompanyIds: [String!]) {
    subscribeToTopic(projectIds: $projectIds, companyIds: $companyIds, projectCompanyIds: $projectCompanyIds) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const NOTIFICATION_UNSUBSCRIBE_GQL = gql`
  mutation unsubscribeFromTopic($projectIds: [Float!], $companyIds: [String!], $projectCompanyIds: [String!]) {
    unsubscribeFromTopic(projectIds: $projectIds, companyIds: $companyIds, projectCompanyIds: $projectCompanyIds) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const READ_NOTIFICATION_GQL = gql`
  mutation readNotification($id: String!) {
    readNotification(id: $id) {
      ... on Notification {
        id
        read
      }
    }
  }
`;
const NotificationsMutations = {
  NOTIFICATION_SUBSCRIBE_CATEGORY_GQL,
  NOTIFICATION_SUBSCRIBE_GQL,
  NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL,
  NOTIFICATION_UNSUBSCRIBE_GQL,
  READ_NOTIFICATION_GQL,
};
export default NotificationsMutations;
