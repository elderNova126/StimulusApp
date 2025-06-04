import { gql } from '@apollo/client';

const ADD_TO_COMPANY_LIST = gql`
  mutation addCompanyToList($listId: String!, $companyIds: [String!]) {
    addToCompanyList(id: $listId, companyIds: $companyIds) {
      __typename
      ... on CompanyList {
        id
        createdBy
        companyIds
        companies {
          results {
            id
            legalBusinessName
            doingBusinessAs
            stimulusScore {
              ... on StimulusScoreResponse {
                results {
                  id
                  scoreValue
                }
                count
              }
            }
            tenantCompanyRelation {
              id
              isFavorite
              isToCompare
              type
              status
            }
          }
        }
        name
        isPublic
      }
    }
  }
`;

const UPDATE_COMPANY_LIST = gql`
  mutation updateCompanyList($id: String!, $name: String!) {
    updateCompanyList(id: $id, name: $name) {
      __typename
      ... on CompanyList {
        id
        name
      }
    }
  }
`;

const DELETE_COMPANY_LIST = gql`
  mutation deleteCompanyList($id: Float!) {
    deleteCompanyList(id: $id) {
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
const REMOVE_COMPANY_FROM_LIST = gql`
  mutation removeFromCompanyList($listId: String!, $companyIds: [String!], $tenantId: String) {
    removeFromCompanyList(id: $listId, companyIds: $companyIds, tenantId: $tenantId) {
      __typename
      ... on CompanyList {
        id
        createdBy
        companyIds
        companies {
          results {
            id
            legalBusinessName
            doingBusinessAs
            stimulusScore {
              ... on StimulusScoreResponse {
                results {
                  id
                  scoreValue
                }
                count
              }
            }
            tenantCompanyRelation {
              id
              isFavorite
              isToCompare
              type
              status
            }
          }
        }
        name
        isPublic
      }
    }
  }
`;

const CREATE_COMPANY_LIST = gql`
  mutation createCompanyList($name: String!) {
    createCompanyList(name: $name) {
      ... on CompanyList {
        id
        name
        isPublic
        companies {
          results {
            id
          }
        }
      }
    }
  }
`;

const CLONE_COMPANY_LIST = gql`
  mutation cloneCompanyList($id: String!, $name: String!) {
    cloneCompanyList(id: $id, name: $name) {
      ... on CompanyList {
        id
        name
        isPublic
        companies {
          results {
            id
          }
        }
      }
    }
  }
`;

const CREATE_SHARE_LIST = gql`
  mutation createSharedList($listId: String!, $listName: String!, $userId: String!, $tenantId: String) {
    createSharedList(listId: $listId, listName: $listName, userId: $userId, tenantId: $tenantId) {
      __typename
      ... on SharedList {
        id
        status
        user {
          id
          email
        }
        tenant {
          id
          name
        }
      }
    }
  }
`;

const CHANGE_STATUS_SHARED_LIST = gql`
  mutation changeStatusSharedList($id: String!, $listId: String!, $status: String) {
    changeStatusSharedList(id: $id, listId: $listId, status: $status) {
      __typename
      ... on SharedList {
        id
        status
        user {
          id
          email
        }
        tenant {
          id
          name
        }
      }
    }
  }
`;

const ListsMutations = {
  ADD_TO_COMPANY_LIST,
  CREATE_COMPANY_LIST,
  CLONE_COMPANY_LIST,
  UPDATE_COMPANY_LIST,
  DELETE_COMPANY_LIST,
  REMOVE_COMPANY_FROM_LIST,
  CREATE_SHARE_LIST,
  CHANGE_STATUS_SHARED_LIST,
};

export default ListsMutations;
