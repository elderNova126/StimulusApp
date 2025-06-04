import { gql } from '@apollo/client';

const ACTIVITY_LOG_GQL = gql`
  query tenantActivityLog(
    $timestampFrom: String
    $timestampTo: String
    $userId: String
    $notUserId: String
    $projectId: Float
    $companyId: String
    $page: Float
    $limit: Float
  ) {
    searchEvents(
      fromTimestamp: $timestampFrom
      toTimestamp: $timestampTo
      userId: $userId
      notUserId: $notUserId
      projectId: $projectId
      companyId: $companyId
      limit: $limit
      page: $page
    ) {
      results {
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
      }
      count
    }
  }
`;
const TenantQueries = {
  ACTIVITY_LOG_GQL,
};

export default TenantQueries;
