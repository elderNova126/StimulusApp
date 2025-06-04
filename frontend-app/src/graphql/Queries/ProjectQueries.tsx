import { gql } from '@apollo/client';
import { getScoreQueryNameFromCompanyId, getTargetScoreQueryNameFromCompanyId } from '../Queries/Utils';
import { computeScoreSearchGQL, computeTargetScoreGql } from './Utils';

const PROJECT_NOTES_GQL = (projectId: number, limit?: number) => {
  const limitParam = limit ? `limit: ${limit}` : '';
  return gql`
  {
    projectNotes(projectId: ${projectId}, ${limitParam}) {
      ... on ProjectNotesResponse{
        results{
          id
          body
          createdBy
          created
          parentNote
        },
        count
      }
    }
  }`;
};

const HOME_PROJECTS_GQL = () => gql`
  {
    searchAllProjects(status: "INPROGRESS", page: 1, limit: 5) {
      ... on ProjectsResponse {
        results {
          id
          description
          status
          title
          expectedEndDate
          targetScore
          startDate
          budget
          projectCompany {
            id
            type
            company {
              id
              legalBusinessName
              doingBusinessAs
            }
          }
        }
        count
      }
    }
  }
`;

const PROJECT_DETAILS_GQL = (id: number | undefined) => gql`
  {
    searchProjects(
      id: ${id},
      ) {
      ... on ProjectsResponse{
        results{
          id
          isContinuedByProject{
            id
            title
          }
          continuationOfProject{
            id
            title
          }
          budget
          description
          status
          title
          created
          createdBy
          expectedStartDate
          expectedEndDate
          startDate
          endDate
          keywords
          evaluation {
            id
            metrics{
              id
              category
              question
              exceptionalValue
              unsatisfactoryValue
              metExpectationsValue
              keyId
              isDefault
            }
          }
          contract
          ongoing
          archived
          selectionCriteria
          treeProjectId
          parentProjectTreeId
        }
        count
      }
    }
  }
`;

const PROJECT_DETAILS_TO_UPDATE_GQL = (id: number | undefined) => gql`
{
  searchProjects(
   id: ${id}
  ) {
    ... on ProjectsResponse{
      results{
        id
        description
        type
        budget
        title
        keywords
        contract
        expectedStartDate
        expectedEndDate
        status
        ongoing
        selectionCriteria
      }
    }
  }
}
`;

const PROJECTS_GQL_CLASSIFIED_BY_STATUS = gql`
  query searchProjectsClassifiedByStatus(
    $ongoing: Boolean
    $archived: Boolean
    $deleted: Boolean
    $companyId: String
    $userId: String
  ) {
    searchProjectsClassifiedByStatus(
      ongoing: $ongoing
      archived: $archived
      companyId: $companyId
      userId: $userId
      deleted: $deleted
    ) {
      ... on ProjectStatusClassifiedResponse {
        results {
          companyId
          NEW
          OPEN
          INREVIEW
          INPROGRESS
          COMPLETED
          CANCELED
        }
        count
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;
const PROJECTS_GQL = gql`
  query searchAllProjects(
    $page: Float!
    $limit: Float!
    $statusIn: [String!]
    $title: String
    $ongoing: Boolean
    $archived: Boolean
    $deleted: Boolean
    $companyId: String
    $userId: String
    $accessType: String
    $startDate: String
    $endDate: String
    $expectedEndDate: String
    $expectedStartDate: String
  ) {
    searchAllProjects(
      statusIn: $statusIn
      page: $page
      limit: $limit
      title: $title
      deleted: $deleted
      ongoing: $ongoing
      archived: $archived
      orderBy: "project.startDate"
      direction: "DESC"
      companyId: $companyId
      userId: $userId
      accessType: $accessType
      startDate: $startDate
      endDate: $endDate
      expectedEndDate: $expectedEndDate
      expectedStartDate: $expectedStartDate
    ) {
      ... on ProjectsResponse {
        results {
          id
          description
          status
          title
          targetScore
          expectedStartDate
          expectedEndDate
          startDate
          endDate
          projectCompany {
            id
            type
            company {
              id
              legalBusinessName
              doingBusinessAs
            }
          }
        }
        count
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const PROJECTS_PENDING_REVIEW_GQL = gql`
  query searchProjects(
    $page: Float!
    $limit: Float!
    $createdBy: String!
    $title: String
    $expectedStartDate: String
    $endDate: String
  ) {
    searchProjects(
      page: $page
      limit: $limit
      createdBy: $createdBy
      type: "PENDING"
      expectedStartDate: $expectedStartDate
      endDate: $endDate
      title: $title
    ) {
      ... on ProjectsResponse {
        results {
          id
          description
          status
          title
          targetScore
          expectedStartDate
          expectedEndDate
          startDate
          endDate
          projectCompany {
            id
            type
            company {
              id
              legalBusinessName
              doingBusinessAs
            }
          }
        }
        count
      }
    }
  }
`;

const PROJECTS_ACCESS_PENDING = gql`
  query searchUserCollaborations(
    $userId: String!
    $page: Float!
    $limit: Float!
    $startDate: String
    $endDate: String
    $title: String
    $status: String
  ) {
    searchUserCollaborations(
      userId: $userId
      page: $page
      limit: $limit
      startDate: $startDate
      endDate: $endDate
      title: $title
      status: $status
    ) {
      results {
        id
        status
        project {
          id
          title
          status
        }
      }
      count
    }
  }
`;

const AVAILABLE_PROJECTS_GQL = () => gql`
  {
    searchProjects(statusIn: ["NEW", "OPEN", "INREVIEW"], page: 1, limit: 1000, archived: false) {
      ... on ProjectsResponse {
        results {
          id
          title
          projectCompany {
            id
            company {
              id
            }
          }
        }
      }
    }
  }
`;

const SEARCH_PROJECTS_SUBSET_GQL = gql`
  query searchProjectsSubset($query: String!) {
    searchProjectsSubset(query: $query) {
      results {
        id
        title
      }
    }
  }
`;

const GET_PROJECT_NAME = gql`
  query searchProjects($id: Float!) {
    searchProjects(id: $id) {
      ... on ProjectsResponse {
        results {
          id
          title
        }
      }
    }
  }
`;

const GET_PROJECTS_BY_COMPANY = gql`
  query searchProjectsByCompany(
    $companyId: String!
    $companyType: String
    $statusIn: [String!]
    $limit: Float
    $page: Float
    $orderBy: String
    $direction: String
  ) {
    searchProjects(
      companyId: $companyId
      companyType: $companyType
      statusIn: $statusIn
      limit: $limit
      page: $page
      orderBy: $orderBy
      direction: $direction
    ) {
      ... on ProjectsResponse {
        results {
          id
          status
          title
          archived
          projectCompany {
            type
            companyId
            evaluations {
              scoreValue
              budgetSpend
            }
            company {
              legalBusinessName
              doingBusinessAs
              tenantCompanyRelation {
                id
                isFavorite
                isToCompare
                type
                status
                supplierTier
              }
            }
          }
          collaborations {
            id
            userId
            status
            userType
          }
          startDate
          endDate
          expectedStartDate
          expectedEndDate
          budget
          targetScore
          createdBy
          deleted
          scoreProject
        }
      }
    }
  }
`;

const GET__SUPPLIER_TIER_ROJECTS_BY_COMPANY = gql`
  query searchSupplierTierProjects(
    $companyId: String!
    $companyType: String
    $statusIn: [String!]
    $limit: Float
    $page: Float
    $orderBy: String
    $direction: String
  ) {
    searchSupplierTierProjects(
      companyId: $companyId
      companyType: $companyType
      statusIn: $statusIn
      limit: $limit
      page: $page
      orderBy: $orderBy
      direction: $direction
    ) {
      ... on ProjectsResponse {
        results {
          id
          status
          title
          projectCompany {
            type
            companyId
            evaluations {
              scoreValue
              budgetSpend
            }
            company {
              legalBusinessName
              doingBusinessAs
              tenantCompanyRelation {
                id
                isFavorite
                isToCompare
                type
                status
                supplierTier
              }
            }
          }
          collaborations {
            id
            userId
            status
            userType
          }
          startDate
          endDate
          expectedStartDate
          expectedEndDate
          budget
          targetScore
          createdBy
          deleted
          scoreProject
        }
      }
    }
  }
`;

const GET__OTHER_ROJECTS_BY_COMPANY = gql`
  query SearchOtherTierProjects(
    $companyId: String!
    $companyType: String
    $statusIn: [String!]
    $limit: Float
    $page: Float
    $orderBy: String
    $direction: String
  ) {
    SearchOtherTierProjects(
      companyId: $companyId
      companyType: $companyType
      statusIn: $statusIn
      limit: $limit
      page: $page
      orderBy: $orderBy
      direction: $direction
    ) {
      ... on ProjectsResponse {
        results {
          id
          status
          title
          projectCompany {
            type
            companyId
            evaluations {
              scoreValue
              budgetSpend
            }
            company {
              legalBusinessName
              doingBusinessAs
              tenantCompanyRelation {
                id
                isFavorite
                isToCompare
                type
                status
                supplierTier
              }
            }
          }
          collaborations {
            id
            userId
            status
            userType
          }
          startDate
          endDate
          expectedStartDate
          expectedEndDate
          budget
          targetScore
          createdBy
          deleted
          scoreProject
        }
      }
    }
  }
`;

const PROJECT_ACTIVITY_LOG_GQL = gql`
  query projectActivityLog($projectId: Float!, $direction: String!, $limit: Float) {
    projectActivityLog(projectId: $projectId, orderBy: "created", direction: $direction, limit: $limit) {
      ... on EventsResponse {
        results {
          id
          userId
          userName
          entityId
          created
          body
          code
          meta {
            companyId
            departmentId
            userName
            companyName
            projectName
            departmentName
            listId
            listName
            actionType
            status
            type
            settingValue
            answers
            updates {
              id
              from
              to
            }
          }
        }
        count
      }
    }
  }
`;

const PROJECT_COLLABORATORS = gql`
  query searchProjectCollaborations($projectId: Float!) {
    searchProjectCollaborations(projectId: $projectId) {
      results {
        id
        userType
        userId
        status
        user {
          id
          givenName
          surname
          jobTitle
          email
          externalAuthSystemId
        }
      }
    }
  }
`;
const PROJECT_COMPANIES_INFO_GQL = ({ companies, from, projectId }: any) => gql`
  {
    ${companies.map(computeScoreSearchGQL('scoreValue', new Date(from).toISOString(), 1))},
    ${companies.map(computeTargetScoreGql(projectId))}
  }
`;

const SEARCH_PROJECT_COMPANIES = gql`
  query searchProjectCompanies($projectId: Float!, $companyType: String!) {
    searchProjectCompanies(projectId: $projectId, companyType: $companyType) {
      ... on ProjectCompanyResponse {
        results {
          id
          companyId
          company {
            legalBusinessName
          }
          project {
            startDate
            budget
          }
          evaluations {
            id
            budgetSpend
            submitted
            quality
            reliability
            features
            cost
            relationship
            financial
            diversity
            innovation
            flexibility
            brand
            createdBy
            created
            description
          }
        }
      }
    }
  }
`;

const SEARCH_SUPPLIERS = gql`
  query searchProjectCompanies($projectId: Float!, $companyType: String) {
    searchProjectCompanies(projectId: $projectId, companyType: $companyType) {
      ... on ProjectCompanyResponse {
        results {
          id
          type
          evaluations {
            budgetSpend
          }
          company {
            id
            legalBusinessName
            doingBusinessAs
            taxIdNo
            tenantCompanyRelation {
              id
              isFavorite
              isToCompare
              type
              status
              supplierTier
            }
            stimulusScore {
              ... on StimulusScoreResponse {
                results {
                  id
                  scoreValue
                }
              }
            }
          }
          criteriaAnswers {
            criteria
            answer
          }
          suppliers {
            id
            type
            evaluations {
              budgetSpend
            }
            company {
              id
              legalBusinessName
              doingBusinessAs
              taxIdNo
              tenantCompanyRelation {
                id
                isFavorite
                isToCompare
                type
                status
                supplierTier
              }
              stimulusScore {
                ... on StimulusScoreResponse {
                  results {
                    id
                    scoreValue
                  }
                }
              }
            }
            criteriaAnswers {
              criteria
              answer
            }
          }
        }
      }
    }
  }
`;

const PROJECT_ATTACHMENT_DETAILS_GQL = gql`
  query projectAttachmentsDetails($projectId: Float!) {
    projectAttachmentsDetails(projectId: $projectId) {
      ... on ProjectAttachmentResponse {
        results {
          id
          originalFilename
          size
        }
      }
    }
  }
`;

const SEARCH_PROJECTS_DASHBOARD = gql`
  query getProjectsDashboard($timePeriodFilter: String, $granularityFilter: String) {
    getProjectsDashboard(timePeriodFilter: $timePeriodFilter, granularityFilter: $granularityFilter) {
      ... on ProjectDashboardResponse {
        results {
          name
          Projects
        }
        count
        checkPrevYear
      }
    }
  }
`;

const CHECK_PROJECTS_DASHBOARD = gql`
  {
    checkDataProjectsDashboard {
      ... on ProjectDashboardResponse {
        hasData
        prevYear
        currentYear
      }
    }
  }
`;

const ProjectQueries = {
  PROJECT_COMPANIES_INFO: {
    query: PROJECT_COMPANIES_INFO_GQL,
    getScoreQueryNameFromCompanyId,
    getTargetScoreQueryNameFromCompanyId,
  },
  AVAILABLE_PROJECTS_GQL,
  GET_PROJECTS_BY_COMPANY,
  GET_PROJECT_NAME,
  HOME_PROJECTS_GQL,
  PROJECTS_ACCESS_PENDING,
  PROJECTS_GQL,
  PROJECTS_GQL_CLASSIFIED_BY_STATUS,
  PROJECTS_PENDING_REVIEW_GQL,
  PROJECT_DETAILS_GQL,
  PROJECT_DETAILS_TO_UPDATE_GQL,
  PROJECT_NOTES_GQL,
  SEARCH_PROJECTS_SUBSET_GQL,
  PROJECT_COLLABORATORS,
  PROJECT_ACTIVITY_LOG_GQL,
  SEARCH_PROJECT_COMPANIES,
  SEARCH_SUPPLIERS,
  PROJECT_ATTACHMENT_DETAILS_GQL,
  SEARCH_PROJECTS_DASHBOARD,
  CHECK_PROJECTS_DASHBOARD,
  GET__SUPPLIER_TIER_ROJECTS_BY_COMPANY,
  GET__OTHER_ROJECTS_BY_COMPANY,
};

export default ProjectQueries;
