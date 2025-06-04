import { gql } from '@apollo/client';

const CREATE_NEW_API_KEY = gql`
  mutation createNewApiKey($name: String!) {
    createNewApiKey(name: $name) {
      ... on ApiKey {
        id
        apiKey
        name
        tenantId
        status
        created
      }
    }
  }
`;

const UPDATE_API_KEY = gql`
  mutation updateApiKey($id: String!, $name: String!, $status: String, $apikey: String, $expire: String) {
    updateApiKey(id: $id, name: $name, status: $status) {
      ... on ApiKey {
        id
        apikey
        name
        expire
        created
        tenantId
        status
      }
    }
  }
`;

const CHANGE_STATUS_API_KEY = gql`
  mutation changeStatusApiKey($id: String!, $status: String!) {
    updateApiKey(id: $id, status: $status) {
      ... on ApiKey {
        id
        name
        created
        tenantId
        status
      }
    }
  }
`;
const REMOVE_API_KEY = gql`
  mutation removeApiKey($id: String!) {
    removeApiKey(id: $id) {
      ... on OperationSuccessfully {
        successful
      }
    }
  }
`;

const ExternalSystemAuthMutations = {
  CHANGE_STATUS_API_KEY,
  CREATE_NEW_API_KEY,
  REMOVE_API_KEY,
  UPDATE_API_KEY,
};

export default ExternalSystemAuthMutations;
