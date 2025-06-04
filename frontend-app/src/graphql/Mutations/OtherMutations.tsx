import { gql } from '@apollo/client';

const CREATE_TENANT_GQL = gql`
  mutation createTenant(
    $stimulusPlan: String!
    $postalCode: String!
    $nameOnCard: String!
    $cardNumber: String!
    $cardExpirationDate: String!
    $duns: String!
    $departmentName: String!
    $companyName: String!
    $ein: String!
  ) {
    createTenant(
      stimulusPlan: $stimulusPlan
      postalCode: $postalCode
      nameOnCard: $nameOnCard
      cardNumber: $cardNumber
      cardExpirationDate: $cardExpirationDate
      duns: $duns
      departmentName: $departmentName
      name: $companyName
      ein: $ein
      paymentMethod: "credit_card"
      country: "USA"
    )
  }
`;

const SINGLE_UPLOAD = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      ... on UploadReport {
        id
        status
        fileName
        affectedCompanies
        errorsCount
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const MULTIPLE_UPLOAD = gql`
  mutation multipleUpload(
    $archiveName: String!
    $companyFile: Upload
    $certificationFile: Upload
    $contingencyFile: Upload
    $productFile: Upload
    $locationFile: Upload
    $insuranceFile: Upload
    $contactFile: Upload
  ) {
    multipleUpload(
      archiveName: $archiveName
      companyFile: $companyFile
      certificationFile: $certificationFile
      contingencyFile: $contingencyFile
      productFile: $productFile
      locationFile: $locationFile
      insuranceFile: $insuranceFile
      contactFile: $contactFile
    ) {
      ... on UploadReport {
        id
        status
        fileName
        affectedCompanies
        errorsCount
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;
const UPLOAD_CSV = gql`
  mutation ($file: Upload!) {
    uploadFileCsv(file: $file)
  }
`;

const ISSUE_CONTEXT_TOKEN_GQL = gql`
  mutation issueContextToken($tenantId: String!) {
    issueContextToken(tenantId: $tenantId) {
      token
    }
  }
`;

const REQUEST_ACCESS_GQL = gql`
  mutation {
    requestAccess {
      success
    }
  }
`;

const OtherMutations = {
  CREATE_TENANT_GQL,
  SINGLE_UPLOAD,
  ISSUE_CONTEXT_TOKEN_GQL,
  REQUEST_ACCESS_GQL,
  UPLOAD_CSV,
  MULTIPLE_UPLOAD,
};

export default OtherMutations;
