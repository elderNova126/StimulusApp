import { gql } from '@apollo/client';

const CREATE_INSURANCE_GQL = gql`
  mutation createInsurance(
    $companyId: String!
    $name: String!
    $type: String
    $description: String
    $coverageStart: String!
    $coverageEnd: String!
    $coverageLimit: Float!
  ) {
    createInsurance(
      companyId: $companyId
      name: $name
      type: $type
      description: $description
      coverageStart: $coverageStart
      coverageEnd: $coverageEnd
      coverageLimit: $coverageLimit
    ) {
      ... on Insurance {
        id
        name
        type
        description
        coverageStart
        coverageEnd
        coverageLimit
      }
    }
  }
`;

const UPDATE_INSURANCE_GQL = gql`
  mutation updateInsurance(
    $id: String!
    $name: String
    $type: String
    $description: String
    $coverageStart: String
    $coverageEnd: String
    $coverageLimit: Float
  ) {
    updateInsurance(
      id: $id
      name: $name
      type: $type
      description: $description
      coverageStart: $coverageStart
      coverageEnd: $coverageEnd
      coverageLimit: $coverageLimit
    ) {
      ... on Insurance {
        id
        name
        type
        description
        coverageStart
        coverageEnd
        coverageLimit
      }
    }
  }
`;

const InsuranceMutations = {
  CREATE_INSURANCE_GQL,
  UPDATE_INSURANCE_GQL,
};

export default InsuranceMutations;
