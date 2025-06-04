import { gql } from '@apollo/client';

const BADGE_TENANT = gql`
  {
    badges {
      ... on BadgeResponse {
        results {
          id
          badgeName
          badgeDescription
          badgeDateStatus
          badgeDateLabel
          tenant {
            id
            name
          }
          badgeTenantCompanyRelationships {
            id
            badgeId
            tenantCompanyRelationshipId
            badgeDate
          }
        }
        count
      }
    }
  }
`;

const BadgesQueries = {
  BADGE_TENANT,
};

export default BadgesQueries;
