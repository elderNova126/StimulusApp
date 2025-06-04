import { gql } from '@apollo/client';

const CREATE_CONTINGENCY_GQL = gql`
  mutation createContingency($companyId: String!, $name: String, $type: String, $description: String) {
    createContingency(companyId: $companyId, name: $name, type: $type, description: $description) {
      ... on Contingency {
        id
        name
        type
        description
      }
    }
  }
`;

const UPDATE_CONTINGENCY_GQL = gql`
  mutation updateContingency($id: String!, $name: String, $type: String, $description: String) {
    updateContingency(id: $id, name: $name, type: $type, description: $description) {
      ... on Contingency {
        id
        name
        type
        description
      }
    }
  }
`;

const ContingencyMutations = {
  CREATE_CONTINGENCY_GQL,
  UPDATE_CONTINGENCY_GQL,
};

export default ContingencyMutations;
