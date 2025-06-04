import { gql } from '@apollo/client';

const CREATE_CERTIFICATION_GQL = gql`
  mutation createCertification(
    $companyId: String!
    $name: String!
    $type: String
    $description: String
    $certificationDate: String
    $expirationDate: String
    $issuedBy: String
    $certificationNumber: String
  ) {
    createCertification(
      companyId: $companyId
      name: $name
      type: $type
      description: $description
      certificationDate: $certificationDate
      expirationDate: $expirationDate
      issuedBy: $issuedBy
      certificationNumber: $certificationNumber
    ) {
      ... on Certification {
        id
        name
        type
        description
        certificationDate
        expirationDate
        issuedBy
        certificationNumber
      }
    }
  }
`;

const UPDATE_CERTIFICATION_GQL = gql`
  mutation updateCertification(
    $id: String!
    $name: String
    $type: String
    $description: String
    $certificationDate: String
    $expirationDate: String
    $issuedBy: String
    $certificationNumber: String
  ) {
    updateCertification(
      id: $id
      name: $name
      type: $type
      description: $description
      certificationDate: $certificationDate
      expirationDate: $expirationDate
      issuedBy: $issuedBy
      certificationNumber: $certificationNumber
    ) {
      ... on Certification {
        id
        name
        type
        description
        certificationDate
        expirationDate
        issuedBy
        certificationNumber
      }
    }
  }
`;

const CertificationMutations = {
  CREATE_CERTIFICATION_GQL,
  UPDATE_CERTIFICATION_GQL,
};

export default CertificationMutations;
