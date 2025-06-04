import { gql } from '@apollo/client';

const GET_API_KEYS = gql`
  {
    getApiKeys {
      ... on ApiKeysResults {
        results {
          id
          tenantId
          apiKey
          status
          created
          name
        }
        count
      }
    }
  }
`;

const ExternalSystemAuthQueries = {
  GET_API_KEYS,
};

export default ExternalSystemAuthQueries;
