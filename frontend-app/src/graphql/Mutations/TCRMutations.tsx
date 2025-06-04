import { gql } from '@apollo/client';

const CHANGE_SETTINGS_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isFavorite: Boolean, $isToCompare: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isFavorite: $isFavorite, isToCompare: $isToCompare) {
      __typename
      ... on TenantCompanyRelation {
        id
        isFavorite
        isToCompare
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CHANGE_FAVORITE_SETTING_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isFavorite: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isFavorite: $isFavorite) {
      __typename
      ... on TenantCompanyRelation {
        id
        isFavorite
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CHANGE_COMPARISON_SETTING_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isToCompare: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isToCompare: $isToCompare) {
      __typename
      ... on TenantCompanyRelation {
        id
        isToCompare
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const BULK_CHANGE_FAVORITE_SETTING_GQL = gql`
  mutation bulkUpdateTenantCompanyRelations($companyIds: [String!], $isFavorite: Boolean) {
    bulkUpdateTenantCompanyRelations(companyIds: $companyIds, isFavorite: $isFavorite) {
      __typename
      ... on TenantCompanyRelationResponse {
        results {
          id
          isFavorite
        }
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const TCRMutations = {
  CHANGE_COMPARISON_SETTING_GQL,
  CHANGE_FAVORITE_SETTING_GQL,
  CHANGE_SETTINGS_GQL,
  BULK_CHANGE_FAVORITE_SETTING_GQL,
};
export default TCRMutations;
