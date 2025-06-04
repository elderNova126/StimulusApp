import { gql } from '@apollo/client';

const UPDATE_MY_PROFILE = gql`
  mutation updateMyProfile(
    $givenName: String
    $surname: String
    $jobTitle: String
    $mobilePhone: String
    $mail: String
  ) {
    updateMyProfile(
      givenName: $givenName
      surname: $surname
      jobTitle: $jobTitle
      mobilePhone: $mobilePhone
      mail: $mail
    ) {
      id
      givenName
      surname
      jobTitle
      mobilePhone
      mail
      accountEnabled
    }
  }
`;
const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile(
    $externalAuthSystemId: String!
    $givenName: String
    $surname: String
    $jobTitle: String
    $mobilePhone: String
    $mail: String
    $accountEnabled: Boolean
  ) {
    updateUserProfile(
      externalAuthSystemId: $externalAuthSystemId
      givenName: $givenName
      surname: $surname
      jobTitle: $jobTitle
      mobilePhone: $mobilePhone
      mail: $mail
      accountEnabled: $accountEnabled
    ) {
      id
      givenName
      surname
      jobTitle
      mobilePhone
      mail
      accountEnabled
    }
  }
`;
const UPDATE_USER_STATUS = gql`
  mutation updateUserProfile($externalAuthSystemId: String!, $accountEnabled: Boolean) {
    updateUserProfile(externalAuthSystemId: $externalAuthSystemId, accountEnabled: $accountEnabled) {
      id
      accountEnabled
    }
  }
`;
const DELETE_USER = gql`
  mutation deleteTenantUser($externalAuthSystemId: String!) {
    deleteTenantUser(externalAuthSystemId: $externalAuthSystemId) {
      ... on BaseResponse {
        done
      }
    }
  }
`;
const INVITE_USER_GQL = gql`
  mutation inviteTenantUser($email: String!, $resend: Boolean) {
    inviteTenantUser(email: $email, resend: $resend) {
      id
      tenant
      surname
      givenName
      mail
      email
      jobTitle
      mobilePhone
      accountEnabled
    }
  }
`;
const INVITE_USER_TO_PROJECT = gql`
  mutation createProjectCollaboration($userId: String!, $projectId: Float!, $userType: String!) {
    createProjectCollaboration(userId: $userId, projectId: $projectId, userType: $userType) {
      id
      status
      userType
      userId
      user {
        id
        givenName
        surname
        jobTitle
        externalAuthSystemId
        email
      }
    }
  }
`;

const UPLOAD_ASSET = gql`
  mutation ($file: Upload!, $companyId: String) {
    uploadAsset(file: $file, companyId: $companyId) {
      ... on Asset {
        id
        url
        filename
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const DELETE_ASSET = gql`
  mutation ($companyId: String, $userId: String) {
    deleteAsset(companyId: $companyId, userId: $userId) {
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

const UserMutations = {
  UPDATE_MY_PROFILE,
  UPDATE_USER_PROFILE,
  UPDATE_USER_STATUS,
  DELETE_USER,
  INVITE_USER_GQL,
  INVITE_USER_TO_PROJECT,
  UPLOAD_ASSET,
  DELETE_ASSET,
};

export default UserMutations;
