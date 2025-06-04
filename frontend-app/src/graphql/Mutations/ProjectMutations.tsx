import { gql } from '@apollo/client';

const ADD_TO_PROJECT_GQL = gql`
  mutation updateProject($id: Float!, $companyId: String!, $companyType: String!) {
    updateProject(id: $id, companyId: $companyId, companyType: $companyType) {
      ... on Project {
        __typename
        id
        projectCompany {
          __typename
          id
          company {
            id
          }
        }
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const UPDATE_PROJECT_STATUS = gql`
  mutation updateProject($id: Float!, $status: String!, $startDate: String, $endDate: String) {
    updateProject(id: $id, status: $status, startDate: $startDate, endDate: $endDate) {
      ... on Project {
        id
        status
        startDate
        endDate
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const UPDATE_PROJECT_TYPE = gql`
  mutation updateProject($id: Float!, $type: String!) {
    updateProject(id: $id, type: $type) {
      __typename
      ... on Project {
        id
        type
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const UPDATE_PROJECT_ONGOING = gql`
  mutation updateProject($id: Float!, $ongoing: Boolean!) {
    updateProject(id: $id, ongoing: $ongoing) {
      __typename
      ... on Project {
        id
        ongoing
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const ARCHIVE_PROJECT = gql`
  mutation updateProject($id: Float) {
    updateProject(id: $id, archived: true) {
      __typename
      ... on Project {
        id
        archived
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation deleteProject($id: Float) {
    deleteProject(id: $id) {
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

const UPDATE_PROJECT_COMPANIES = gql`
  mutation updateProjectCompanies($projectId: Float!, $companyId: String!, $companyType: String) {
    updateProjectCompanies(projectId: $projectId, companyId: $companyId, companyType: $companyType) {
      __typename
      ... on ProjectCompany {
        id
        type
        companyId
        company {
          id
          legalBusinessName
          doingBusinessAs
        }
        project {
          id
        }
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const UPDATE_PROJECT_GQL = gql`
  mutation updateProject(
    $id: Float!
    $title: String!
    $description: String
    $keywords: String
    $contract: Float!
    $expectedStartDate: String!
    $expectedEndDate: String
    $budget: Float!
    $selectionCriteria: [String!]
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      keywords: $keywords
      contract: $contract
      expectedStartDate: $expectedStartDate
      expectedEndDate: $expectedEndDate
      budget: $budget
      selectionCriteria: $selectionCriteria
    ) {
      ... on Project {
        id
        title
        description
        keywords
        contract
        expectedStartDate
        expectedEndDate
        budget
        selectionCriteria
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CREATE_PROJECT_GQL = gql`
  mutation createProject(
    $title: String
    $description: String
    $keywords: String
    $contract: Float
    $expectedStartDate: String!
    $expectedEndDate: String
    $budget: Float
    $selectionCriteria: [String!]
    $parentProjectTreeId: Float
  ) {
    createProject(
      title: $title
      description: $description
      keywords: $keywords
      contract: $contract
      expectedStartDate: $expectedStartDate
      expectedEndDate: $expectedEndDate
      budget: $budget
      selectionCriteria: $selectionCriteria
      parentProjectTreeId: $parentProjectTreeId
    ) {
      ... on Project {
        id
        title
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const DELETE_PROJECT_NOTE_GQL = gql`
  mutation deleteProjectNote($id: Float!) {
    deleteProjectNote(id: $id) {
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

const CREATE_PROJECT_NOTE_GQL = gql`
  mutation createProjectNote($projectId: Float!, $body: String!, $parentNoteId: Float) {
    createProjectNote(projectId: $projectId, body: $body, parentNoteId: $parentNoteId) {
      ... on ProjectNote {
        id
        body
        createdBy
        created
        parentNote
      }
    }
  }
`;

const UPDATE_PROJECT_NOTE_GQL = gql`
  mutation updateProjectNote($id: Float!, $body: String!) {
    updateProjectNote(id: $id, body: $body) {
      __typename
      ... on ProjectNote {
        id
        body
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CANCEL_PROJECT_GQL = gql`
  mutation cancelProject($id: Float!) {
    cancelProject(id: $id) {
      __typename
      ... on Project {
        id
        status
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CLONE_PROJECT = gql`
  mutation cloneProject(
    $id: Float!
    $title: String!
    $relation: String!
    $includeDescription: Boolean!
    $includeSuppliers: Boolean!
    $includeNotes: Boolean!
    $includeCriteria: Boolean!
    $includePeople: Boolean!
    $includeBudget: Boolean!
    $includeKeywords: Boolean!
    $includeAttatchment: Boolean!
    $people: [String!]
    $userId: String!
  ) {
    cloneProject(
      id: $id
      title: $title
      relation: $relation
      includeDescription: $includeDescription
      includeSuppliers: $includeSuppliers
      includeNotes: $includeNotes
      includeCriteria: $includeCriteria
      includePeople: $includePeople
      people: $people
      userId: $userId
      includeBudget: $includeBudget
      includeKeywords: $includeKeywords
      includeAttatchment: $includeAttatchment
    ) {
      __typename
      ... on Project {
        id
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const ACCEPT_PROJECT_INVITATION = gql`
  mutation acceptCollaboration($id: String!) {
    acceptCollaboration(id: $id) {
      id
      status
    }
  }
`;

const REJECT_PROJECT_INVITATION = gql`
  mutation rejectCollaboration($id: String!) {
    rejectCollaboration(id: $id) {
      id
      status
    }
  }
`;

const CANCEL_PROJECT_COLLABORATION = gql`
  mutation cancelCollaboration($id: String!) {
    cancelCollaboration(id: $id) {
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

const DELETE_PROJECT_ATTACHMENT_GQL = gql`
  mutation deleteProjectAttachment($id: Float!) {
    deleteProjectAttachment(id: $id) {
      ... on BaseResponse {
        done
        error
      }
    }
  }
`;

const UPLOAD_PROJECT_ATTACHMENT_GQL = gql`
  mutation uploadProjectAttachment($file: Upload!, $projectId: Float!) {
    uploadProjectAttachment(file: $file, projectId: $projectId) {
      ... on ProjectAttachment {
        id
        url
        filename
        createdBy
        originalFilename
        size
      }
    }
  }
`;

const ProjectMutations = {
  ACCEPT_PROJECT_INVITATION,
  REJECT_PROJECT_INVITATION,
  CANCEL_PROJECT_COLLABORATION,
  DELETE_PROJECT_ATTACHMENT_GQL,
  UPLOAD_PROJECT_ATTACHMENT_GQL,
  ADD_TO_PROJECT_GQL,
  ARCHIVE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT_ONGOING,
  UPDATE_PROJECT_STATUS,
  UPDATE_PROJECT_TYPE,
  CREATE_PROJECT_GQL,
  UPDATE_PROJECT_COMPANIES,
  UPDATE_PROJECT_GQL,
  CREATE_PROJECT_NOTE_GQL,
  UPDATE_PROJECT_NOTE_GQL,
  DELETE_PROJECT_NOTE_GQL,
  CANCEL_PROJECT_GQL,
  CLONE_PROJECT,
};

export default ProjectMutations;
