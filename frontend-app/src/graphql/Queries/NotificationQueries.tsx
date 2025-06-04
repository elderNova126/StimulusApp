import { gql } from '@apollo/client';

const HOME_ALERTS_GQL = gql`
  {
    notifications(page: 1, limit: 25) {
      ... on NotificationResponse {
        results {
          id
          created
          read
          event {
            id
            userId
            userName
            entityId
            entityType
            created
            body
            code
            meta {
              companyId
              departmentId
              userName
              companyName
              projectName
              listId
              listName
              userInvited
              departmentName
              actionType
              status
              type
              settingValue
              setting
              answers
              updates {
                id
                from
                to
              }
            }
          }
        }
        count
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const POLLING_ALERTS_GQL = gql`
  query pollingAlerts($timestamp: String!, $notUserId: String!) {
    notifications(fromTimestamp: $timestamp) {
      ... on NotificationResponse {
        results {
          id
          created
          read
          event {
            id
            userId
            userName
            entityId
            created
            body
            code
            meta {
              companyId
              departmentId
              userName
              companyName
              projectName
              listId
              listName
              departmentName
              actionType
              status
              type
              setting
              settingValue
              answers
              updates {
                id
                from
                to
              }
            }
          }
        }
        count
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
    searchEvents(fromTimestamp: $timestamp, notUserId: $notUserId) {
      count
    }
  }
`;

const NOTIFICATIONS_GQL = gql`
  query notifications(
    $projectsOnly: Boolean
    $companiesOnly: Boolean
    $read: Boolean
    $projectIds: [Float!]
    $page: Float
    $limit: Float
  ) {
    notifications(
      projectsOnly: $projectsOnly
      companiesOnly: $companiesOnly
      projectIds: $projectIds
      read: $read
      page: $page
      limit: $limit
    ) {
      ... on NotificationResponse {
        results {
          id
          created
          read
          event {
            id
            userId
            userName
            entityId
            entityType
            created
            body
            code
            meta {
              companyId
              projectId
              departmentId
              listId
              listName
              userName
              companyName
              projectName
              departmentName
              actionType
              status
              type
              settingValue
              setting
              answers
              updates {
                id
                from
                to
              }
            }
            user {
              id
              givenName
              surname
            }
          }
        }
        count
      }
    }
  }
`;

const NOTIFICATIONS_PROFILE_LIST_GQL = gql`
  {
    userNotificationProfile {
      id
      subscribedProjects
      subscribedProjectCompanies
      subscribedCompanies
    }
  }
`;

const AlertQueries = {
  NOTIFICATIONS_PROFILE_LIST_GQL,
  NOTIFICATIONS_GQL,
  POLLING_ALERTS_GQL,
  HOME_ALERTS_GQL,
};
export default AlertQueries;
