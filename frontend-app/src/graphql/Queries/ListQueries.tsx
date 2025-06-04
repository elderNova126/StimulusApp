import { gql } from '@apollo/client';

const GET_COLLABORATORS_LIST = gql`
  query getCollaboratorsList($listId: String, $tenantId: String) {
    GetCollaboratorsList(listId: $listId, tenantId: $tenantId) {
      ... on CollaboratorsResult {
        results {
          id
          givenName
          surname
          status
          sharedListId
        }
      }
    }
  }
`;

const GET_INVITATIONS_LIST = gql`
  query getInvitationsLists {
    GetSharedList {
      ... on SharedListResult {
        results {
          id
          status
          createdBy
          created
          tenant {
            id
            name
          }
          user {
            id
            email
          }
          companyList {
            id
            name
            companies
            createdBy
            created
          }
        }
        count
      }
    }
  }
`;

const ListQueries = {
  GET_COLLABORATORS_LIST,
  GET_INVITATIONS_LIST,
};

export default ListQueries;
