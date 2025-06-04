import { gql } from '@apollo/client';

const CREATE_BADGE = gql`
  mutation createBadge(
    $badgeName: String!
    $badgeDescription: String
    $badgeDateStatus: String!
    $badgeDateLabel: String
  ) {
    createBadge(
      badgeName: $badgeName
      badgeDescription: $badgeDescription
      badgeDateStatus: $badgeDateStatus
      badgeDateLabel: $badgeDateLabel
    ) {
      ... on Badge {
        badgeName
        badgeDescription
        badgeDateStatus
        badgeDateLabel
      }
    }
  }
`;

const UPDATE_BADGE = gql`
  mutation updateBadge(
    $id: String!
    $badgeName: String
    $badgeDescription: String
    $badgeDateStatus: String
    $badgeDateLabel: String
  ) {
    updateBadge(
      id: $id
      badgeName: $badgeName
      badgeDescription: $badgeDescription
      badgeDateStatus: $badgeDateStatus
      badgeDateLabel: $badgeDateLabel
    ) {
      ... on Badge {
        id
        badgeName
        badgeDescription
        badgeDateStatus
        badgeDateLabel
      }
    }
  }
`;

const DELETE_BADGE = gql`
  mutation deleteBadge($id: String) {
    deleteBadge(id: $id) {
      __typename
      ... on BaseResponse {
        done
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CREATE_BADGE_TENANT_RELATIONSHIPS = gql`
  mutation createBadgeTenantRelationship($badgeDate: String, $badgeId: String!, $tenantCompanyRelationshipId: String!) {
    createBadgeTenantRelationship(
      badgeDate: $badgeDate
      badgeId: $badgeId
      tenantCompanyRelationshipId: $tenantCompanyRelationshipId
    ) {
      ... on BadgeTenantCompanyRelationship {
        id
        badgeId
        tenantCompanyRelationshipId
        badgeDate
      }
    }
  }
`;

const UPDATE_BADGE_TENANT_RELATIONSHIPS = gql`
  mutation updateBadgeTenantRelationship(
    $id: String!
    $badgeDate: String
    $badgeId: String!
    $tenantCompanyRelationshipId: String!
  ) {
    updateBadgeTenantRelationship(
      id: $id
      badgeDate: $badgeDate
      badgeId: $badgeId
      tenantCompanyRelationshipId: $tenantCompanyRelationshipId
    ) {
      ... on BadgeTenantCompanyRelationship {
        id
        badgeId
        tenantCompanyRelationshipId
        badgeDate
      }
    }
  }
`;

const DELETE_BADGE_TENANT_RELATIONSHIPS = gql`
  mutation deleteBadgeTenantRelationship($ids: [String!]) {
    deleteBadgeTenantRelationship(ids: $ids) {
      __typename
      ... on BaseResponse {
        done
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const BadgeMutations = {
  CREATE_BADGE,
  UPDATE_BADGE,
  DELETE_BADGE,
  CREATE_BADGE_TENANT_RELATIONSHIPS,
  UPDATE_BADGE_TENANT_RELATIONSHIPS,
  DELETE_BADGE_TENANT_RELATIONSHIPS,
};

export default BadgeMutations;
