import { gql } from '@apollo/client';

const USER_TENANTS = () => gql`
  {
    userTenants {
      id
      isDefault
      provisionStatus
      name
      tenantCompany {
        ein
      }
    }
  }
`;

const USER_ACCOUNT = gql`
  {
    userAccount {
      id
      stimulusPlan
    }
  }
`;
const USER_ROLE_GQL = gql`
  {
    userTenantRoles {
      id
      name
      internal
    }
  }
`;

const USER_PROJECTS_GQL = gql`
  {
    searchProjects(limit: 1000) {
      ... on ProjectsResponse {
        results {
          id
          title
        }
      }
    }
  }
`;

const USER_PROFILE_GQL = gql`
  query userProfile($externalAuthSystemId: String) {
    userProfile(externalAuthSystemId: $externalAuthSystemId) {
      id
      tenant
      givenName
      surname
      mail
      jobTitle
      mobilePhone
    }
  }
`;

const GET_USER_BY_NAME = gql`
  query getUserByname($surname: String) {
    getUserByName(surname: $surname) {
      ... on UsersProfileResult {
        results {
          id
          externalAuthSystemId
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
    }
  }
`;

const GET_USER_BY_ID = gql`
  query getUserById($externalAuthSystemId: String) {
    getUserById(externalAuthSystemId: $externalAuthSystemId) {
      ... on UserProfileResult {
        id
        surname
        givenName
      }
    }
  }
`;

const ACCOUNT_INFO = gql`
  query accountInfo {
    accountInfo {
      ... on AccountInfo {
        active
        inactive
        archived
        total
        convertedFromExternal
      }
    }
  }
`;

const TENANT_USERS_GQL = gql`
  query tenantUsers($typeOfList: String, $page: Float, $limit: Float) {
    tenantUsers(typeOfList: $typeOfList, page: $page, limit: $limit) {
      results {
        id
        externalAuthSystemId
        tenant
        surname
        givenName
        mail
        email
        jobTitle
        mobilePhone
        accountEnabled
      }
      count
    }
  }
`;

const TENANT_MY_USERS_GQL = gql`
  {
    tenantMyUsers {
      id
      externalAuthSystemId
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

const UserQueries = {
  GET_USER_BY_ID,
  GET_USER_BY_NAME,
  USER_ACCOUNT,
  USER_PROFILE_GQL,
  USER_PROJECTS_GQL,
  USER_ROLE_GQL,
  USER_TENANTS,
  ACCOUNT_INFO,
  TENANT_USERS_GQL,
  TENANT_MY_USERS_GQL,
};

export default UserQueries;
