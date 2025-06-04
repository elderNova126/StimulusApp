import { gql } from '@apollo/client';
import { CompanyScoresSearch } from '../dto.interface';
import { computeScoreSearchGQL } from './Utils';

const COMPANY_DETAILS_GQL = gql`
  query searchCompanyById($id: String!) {
    searchCompanyById(id: $id) {
      ... on CompaniesResponse {
        results {
          id
          parentCompany {
            id
            legalBusinessName
            taxIdNo
          }
          created
          updated
          doingBusinessAs
          yearFounded
          industries {
            id
            title
            code
            description
          }
          taxIdNo
          creditScoreBusinessNo
          evaluations
          typeOfLegalEntity
          jurisdictionOfIncorporation
          legalBusinessName
          description
          customers
          customersGrowthCAGR
          boardTotal
          boardDiverse
          leadershipTeamTotal
          leadershipTeamDiverse
          leaderDiverse
          totalLiabilities
          employeesTotal
          employeesDiverse
          employeesTotalGrowthCAGR
          revenuePerEmployee
          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          totalAssets
          financialsDataYear
          customerDataYear
          brandDataYear
          peopleDataYear
          previousBusinessNames
          otherBusinessNames
          names {
            id
            name
            type
          }
          operatingStatus
          liabilitiesRevenueRatio
          diverseOwnership
          minorityOwnership
          smallBusiness
          ownershipDescription
          tags {
            id
            tag
            created
          }
          webDomain
          website
          emailDomain
          linkedin
          linkedInFollowers
          facebook
          facebookFollowers
          twitter
          twitterFollowers
          currency
          assetsRevenueRatio
          parentCompanyTaxId
          netPromoterScore
          insuranceCoverage {
            ... on InsuranceResponse {
              results {
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
          certifications {
            ... on CertificationResult {
              results {
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
            ... on ErrorResponse {
              error
              code
              details
            }
          }
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                scoreValue
                brandValue
                customerValue
                employeeValue
                longevityValue
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
              }
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
            internalName
            internalId
            supplierTier
          }
          contacts {
            ... on ContactResponse {
              results {
                id
                department
                email
                emailAlt
                firstName
                middleName
                lastName
                fullName
                jobTitle
                addressStreet
                addressStreet2
                addressStreet3
                fax
                language
                title
                website
                manager
                linkedin
                twitter
                phone
                phoneAlt
                city
                type
                tenantId
              }
            }
            ... on ErrorResponse {
              error
              code
            }
          }
          locations {
            ... on LocationResponse {
              results {
                id
                name
                type
                addressStreet
                addressStreet2
                addressStreet3
                description
                phone
                fax
                country
                postalCode
                state
                city
                latitude
                longitude
                contact {
                  id
                  email
                  emailAlt
                }
              }
            }
          }
          products {
            ... on ProductResponse {
              results {
                id
                name
                type
                description
              }
            }
          }
          contingencies {
            ... on ContingencyResponse {
              results {
                id
                name
                type
                description
                updated
                created
              }
            }
          }
          news {
            title
            description
            image
            url
            publishedAt
          }
          notes {
            ... on CompanyNotesResponse {
              results {
                id
              }
              count
            }
          }
          projectsOverview {
            globalSpent
            totalProjects
            accountProjects
            accountSpent
            accountEvaluations
            totalEvaluations
          }
        }
        count
      }
      ... on ErrorResponse {
        error
        code
      }
    }
  }
`;

const COMPANIES_TO_COMPARE_GQL = gql`
  {
    searchCompanies(limit: 4, isToCompare: true) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
        }
      }
    }
  }
`;
const COMPANY_EIN_SEARCH_GQL = (ein: string) => gql`
  {
    searchCompanies(taxIdNo: "${ein}") {
      ... on CompaniesResponse{
        results {
          id
          stimulusScore{
            ... on StimulusScoreResponse{
              results {
                scoreValue
              }
            }
          }
          legalBusinessName
          doingBusinessAs
          industries {
            id
            title
            code
          }
          taxIdNo
        }
      }
    }
  }
`;

const COMPANY_TAX_ID_SEARCH_PROFILE = gql`
  query searchCompanies($taxIdNo: String) {
    searchCompanies(taxIdNo: $taxIdNo) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          taxIdNo
        }
      }
    }
  }
`;

const HOME_COMPANIES_GQL = () => gql`
  {
    discoverCompanies(page: 1, limit: 5, isFavorite: true, orderBy: "score.scoreValue", direction: "DESC") {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
              count
            }
          }
        }
        count
      }
    }
  }
`;

const HOME_PROJECTS_GQL = () => gql`
  {
    searchProjects(status: "INPROGRESS", page: 1, limit: 5) {
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

const USER_TENANTS = () => gql`
  {
    userTenants {
      id
      isDefault
      provisionStatus
      name
      tenantCompany {
        id
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

const RELATIONSHIP_PANEL_INFO = gql`
  query RelationShipPanelInfo(
    $ongoing: Boolean
    $archived: Boolean
    $deleted: Boolean
    $companyId: String
    $userId: String
  ) {
    RelationShipPanelInfo(
      ongoing: $ongoing
      archived: $archived
      companyId: $companyId
      userId: $userId
      deleted: $deleted
    ) {
      ... on RelationShipPanelInfoResponse {
        CompanyTypeClassification {
          results {
            companyId
            CONSIDERED
            QUALIFIED
            SHORTLISTED
            AWARDED
            CLIENT
          }
          count
        }
        projectStatusClassification {
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
  query searchProjects(
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
  ) {
    searchProjects(
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
  query searchProjects(statusIn: ["NEW", "OPEN", "INREVIEW"], limit: 1000, ongoing: true, archived: false) {
    ... on ProjectsResponse {
      results {
        id
        title
        projectCompany {
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

const SCORE_COMPARISON_GQL = () => gql`
  {
    searchCompanies(limit: 4, isToCompare: true) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
                brandValue
                customerValue
                employeeValue
                longevityValue
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
              }
            }
          }
          customers
          customersGrowthCAGR

          employeesTotal

          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          totalAssets

          diverseOwnership
          projectsOverview {
            globalSpent
            totalProjects
            accountProjects
            accountSpent
          }

          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
          }
        }
      }
    }
  }
`;

const SEARCH_UNUSED_COMPANIES = gql`
  query searchUnusedCompanies(
    $page: Float!
    $limit: Float!
    $orderBy: String
    $direction: String
    $createdFrom: String
    $createdTo: String
  ) {
    searchUnusedCompanies(
      page: $page
      limit: $limit
      orderBy: $orderBy
      direction: $direction
      createdFrom: $createdFrom
      createdTo: $createdTo
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                scoreValue
              }
              count
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
          }
        }
        count
      }
    }
  }
`;

const COMPANY_COMPARISON_GQL = gql`
  query comparison($isFavorite: Boolean) {
    searchCompanies(isFavorite: $isFavorite) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
                brandValue
                customerValue
                employeeValue
                longevityValue
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
              }
            }
          }
          customers
          customersGrowthCAGR

          employeesTotal

          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          totalAssets

          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
          }
        }
      }
    }
  }
`;

const TOP_COMPANIES_GQL = gql`
  query topCompanies($page: Float!, $limit: Float!, $direction: String) {
    discoverCompanies(
      page: $page
      limit: $limit
      isFavorite: true
      orderBy: "score.scoreValue"
      direction: $direction
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
              count
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
          }
        }
        count
      }
    }
  }
`;

const COMPANY_LIST_GQL = gql`
  query searchCompanies($page: Float!, $limit: Float!, $direction: String, $isFavorite: Boolean) {
    searchCompanies(
      page: $page
      limit: $limit
      isFavorite: $isFavorite
      orderBy: "score.scoreValue"
      direction: $direction
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
              count
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
          }
        }
        count
      }
    }
  }
`;

const COMPANY_SCORES_SEARCH_GQL = ({ companies, metric, period }: CompanyScoresSearch) => gql`
  {
    ${companies.map(computeScoreSearchGQL(metric, period ? period.from.toISOString() : '', -1))}
  }
`;

const COMPANY_NOTES_GQL = (companyId: string, limit?: number) => {
  const limitParam = limit ? `limit: ${limit}` : 'limit: 100';
  return gql`
{
  companyNotes(companyId: "${companyId}", ${limitParam}) {
    ... on CompanyNotesResponse{
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

const DISCOVER_COMPANIES_GQL = gql`
  query discoverCompanies(
    $page: Float!
    $limit: Float!
    $orderBy: String
    $direction: String
    $query: String
    $filterSearch: String
    $isFavorite: Boolean
    $lists: [String!]
    $customersFrom: Float
    $customersTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $location: String
    $longitude: Float
    $latitude: Float
    $radius: Float
    $addressStreet: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $employeesFrom: Float
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $minorityOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $relationshipLengthFrom: Float
    $relationshipLengthTo: Float
    $tenantId: String
    $country: String
    $state: String
    $city: String
    $postalCode: String
  ) {
    discoverCompanies(
      query: $query
      filterSearch: $filterSearch
      page: $page
      limit: $limit
      orderBy: $orderBy
      direction: $direction
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      industries: $industries
      location: $location
      longitude: $longitude
      latitude: $latitude
      radius: $radius
      addressStreet: $addressStreet
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      minorityOwnership: $minorityOwnership
      tags: $tags
      relationships: $relationships
      relationshipLengthFrom: $relationshipLengthFrom
      relationshipLengthTo: $relationshipLengthTo
      tenantId: $tenantId
      country: $country
      state: $state
      city: $city
      postalCode: $postalCode
    ) {
      ... on CompaniesResponse {
        results {
          id
          employeesTotal
          legalBusinessName
          doingBusinessAs
          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          customers
          boardTotal
          jurisdictionOfIncorporation
          typeOfLegalEntity
          diverseOwnership
          industries {
            id
            title
            code
            description
          }
          leadershipTeamTotal
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                scoreValue
              }
              count
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
            totalSpent
          }
        }
        count
      }
    }
  }
`;

const DISCOVER_COMPANIES_SELECT100 = gql`
  query discoverCompanies(
    $orderBy: String
    $direction: String
    $query: String
    $filterSearch: String
    $isFavorite: Boolean
    $lists: [String!]
    $customersFrom: Float
    $customersTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $location: String
    $longitude: Float
    $latitude: Float
    $radius: Float
    $addressStreet: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $employeesFrom: Float
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $tenantId: String
    $country: String
    $state: String
    $city: String
    $postalCode: String
  ) {
    discoverCompanies(
      query: $query
      filterSearch: $filterSearch
      page: 1
      limit: 100
      orderBy: $orderBy
      direction: $direction
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      industries: $industries
      location: $location
      longitude: $longitude
      latitude: $latitude
      radius: $radius
      addressStreet: $addressStreet
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
      tenantId: $tenantId
      country: $country
      state: $state
      city: $city
      postalCode: $postalCode
    ) {
      ... on CompaniesResponse {
        results {
          id
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
            totalSpent
          }
        }
        count
      }
    }
  }
`;

const DOWNLOAD_LIST = gql`
  query discoverCompanies(
    $page: Float!
    $limit: Float!
    $orderBy: String
    $direction: String
    $query: String
    $filterSearch: String
    $isFavorite: Boolean
    $lists: [String!]
    $customersFrom: Float
    $customersTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $location: String
    $longitude: Float
    $latitude: Float
    $radius: Float
    $addressStreet: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $employeesFrom: Float
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $tenantId: String
  ) {
    discoverCompanies(
      query: $query
      filterSearch: $filterSearch
      page: $page
      limit: $limit
      orderBy: $orderBy
      direction: $direction
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      industries: $industries
      location: $location
      longitude: $longitude
      latitude: $latitude
      radius: $radius
      addressStreet: $addressStreet
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
      tenantId: $tenantId
    ) {
      ... on CompaniesResponse {
        results {
          legalBusinessName
          doingBusinessAs
          typeOfLegalEntity
          taxIdNo
          diverseOwnership
          contactsByIndex {
            email
            firstName
            middleName
            lastName
            jobTitle
            addressStreet
            addressStreet2
            addressStreet3
            phone
            city
            country
          }
          locationsByIndex {
            name
            type
            addressStreet
            addressStreet2
            addressStreet3
            country
            postalCode
            state
            city
          }
          certificationsByIndex {
            name
            type
            certificationDate
            expirationDate
            issuedBy
          }
          industries {
            title
            code
          }
          website
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                scoreValue
              }
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
            created
            totalSpent
          }
        }
        count
      }
    }
  }
`;

const DISCOVER_COMPANIES_GQL_LISTS = gql`
  query discoverCompanies(
    $page: Float!
    $limit: Float!
    $query: String
    $filterSearch: string
    $isFavorite: Boolean
    $lists: [String!]
    $customersFrom: Float
    $customersTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $location: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $employeesFrom: Float
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $tenantId: String
  ) {
    discoverCompanies(
      query: $query
      filterSearch: $filterSearch
      page: $page
      limit: $limit
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      industries: $industries
      location: $location
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
      tenantId: $tenantId
    ) {
      ... on CompaniesResponse {
        results {
          id
          employeesTotal
          legalBusinessName
          doingBusinessAs
          diverseOwnership
          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          customers
          boardTotal
          jurisdictionOfIncorporation
          leadershipTeamTotal
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
              count
            }
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
          }
        }
        count
      }
    }
  }
`;

const COMPANY_TARGET_SCORE_GQL = gql`
  query companyTargetScore(
    $taxIdNo: String!
    $from: String!
    $customers: Float
    $customersGrowthCAGR: Float
    $customerLifetimeValueGrowthCAGR: Float
    $customerLifespanGrowthCAGR: Float
    $customerAcquisitionCostGrowthCAGR: Float
    $customerRetentionRateGrowthCAGR: Float
    $customersPerEmployeeGrowthCAGR: Float
    $revenuePerCustomerGrowthCAGR: Float
    $netPromoterScore: Float
    $awarenessScore: Float
    $frequencyScore: Float
    $familiarityScore: Float
    $favorabilityScore: Float
    $preferenceScore: Float
    $demandScore: Float
    $socialMediaFollowers: Float
    $socialMediaFollowersGrowthCAGR: Float
    $webUsers: Float
    $webUsersGrowthCAGR: Float
    $appActiveUsers: Float
    $appActiveUsersGrowthCAGR: Float
    $employeesTotal: Float
    $employeesTotalGrowthCAGR: Float
    $employeesDiversityScore: Float
    $revenuePerEmployee: Float
    $employeeNetPromoterScore: Float
    $leadershipTeamDiversityScore: Float
    $leaderDiversityScore: Float
    $boardDiversityScore: Float
    $yearsInBusiness: Float
    $revenue: Float
    $revenueGrowthCAGR: Float
    $grossMargin: Float
    $netProfit: Float
    $netProfitGrowthCAGR: Float
    $contractsGrowthCAGR: Float
    $contractsValueGrowthCAGR: Float
    $totalAssets: Float
    $totalLiabilities: Float
  ) {
    companyTargetScore(
      taxIdNo: $taxIdNo
      from: $from
      customers: $customers
      customersGrowthCAGR: $customersGrowthCAGR
      customerLifetimeValueGrowthCAGR: $customerLifetimeValueGrowthCAGR
      customerLifespanGrowthCAGR: $customerLifespanGrowthCAGR
      customerAcquisitionCostGrowthCAGR: $customerAcquisitionCostGrowthCAGR
      customerRetentionRateGrowthCAGR: $customerRetentionRateGrowthCAGR
      customersPerEmployeeGrowthCAGR: $customersPerEmployeeGrowthCAGR
      revenuePerCustomerGrowthCAGR: $revenuePerCustomerGrowthCAGR
      netPromoterScore: $netPromoterScore
      awarenessScore: $awarenessScore
      frequencyScore: $frequencyScore
      familiarityScore: $familiarityScore
      favorabilityScore: $favorabilityScore
      preferenceScore: $preferenceScore
      demandScore: $demandScore
      socialMediaFollowers: $socialMediaFollowers
      socialMediaFollowersGrowthCAGR: $socialMediaFollowersGrowthCAGR
      webUsers: $webUsers
      webUsersGrowthCAGR: $webUsersGrowthCAGR
      appActiveUsers: $appActiveUsers
      appActiveUsersGrowthCAGR: $appActiveUsersGrowthCAGR
      employeesTotal: $employeesTotal
      employeesTotalGrowthCAGR: $employeesTotalGrowthCAGR
      employeesDiversityScore: $employeesDiversityScore
      revenuePerEmployee: $revenuePerEmployee
      employeeNetPromoterScore: $employeeNetPromoterScore
      leadershipTeamDiversityScore: $leadershipTeamDiversityScore
      leaderDiversityScore: $leaderDiversityScore
      boardDiversityScore: $boardDiversityScore
      yearsInBusiness: $yearsInBusiness
      revenue: $revenue
      revenueGrowthCAGR: $revenueGrowthCAGR
      grossMargin: $grossMargin
      netProfit: $netProfit
      netProfitGrowthCAGR: $netProfitGrowthCAGR
      contractsGrowthCAGR: $contractsGrowthCAGR
      contractsValueGrowthCAGR: $contractsValueGrowthCAGR
      totalAssets: $totalAssets
      totalLiabilities: $totalLiabilities
    ) {
      brandValue
      employeeValue
      customerValue
      longevityValue
      scoreValue
    }
  }
`;

const COMPANY_EIN_SCORE_GQL = gql`
  query searchCompanies($ein: String!, $timestampFrom: String!) {
    searchCompanies(taxIdNo: $ein) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore(timestampFrom: $timestampFrom, timestampTo: $timestampFrom) {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
            }
          }
        }
      }
    }
  }
`;
const COMPANY_OR_USER_ASSETS = gql`
  query assetDetails($companyId: String, $userId: String) {
    assetDetails(companyId: $companyId, userId: $userId) {
      ... on AssetResponse {
        results {
          asset {
            id
          }
          company {
            id
          }
          user {
            id
          }
        }
      }
    }
  }
`;

const COMPANY_EVALUATION_NOTES_GQL = (companyEvaluationId: number) => gql`
{
  companyEvaluationNotes(companyEvaluationId: ${companyEvaluationId}) {
    ... on CompanyEvaluationNotesResponse{
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

const COMPANY_ACTIVITY_LOG_GQL = (page: number) => gql`
  query companyActivityLog($companyId: String!, $direction: String!) {
    companyActivityLog(companyId: $companyId, orderBy: "created", direction: $direction, limit: 3, page: ${page}) {
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
            id
            userName
            companyName
            settingValue
            setting
            listId
            listName
            status
            type
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

const GET_COMPANY_DIVERSE_OWNERSHIP = gql`
  query {
    getCompanyDistinctDiverseOwnership {
      diverseOwnership
    }
  }
`;

const GET_COMPANY_MINORITY_OWNERSHIP = gql`
  query {
    getCompanyMinoritiesDiverseOwnership {
      minorityOwnership
    }
  }
`;

const GET_MINORITY_OWNERSHIP_DETAIL = gql`
  query {
    getMinorityOwnership {
      id
      displayName
      minorityOwnershipDetail
    }
  }
`;

const GET_COMPANY_TAGS = gql`
  query {
    getCompanyDistinctTags {
      tags
    }
  }
`;

const FILTER_COMPANY_TAGS = gql`
  query filterCompanyTag($tag: String!) {
    filterCompanyTag(tag: $tag) {
      tags
    }
  }
`;

const GET_COMPANY_NAME = gql`
  query searchCompanies($id: String!) {
    searchCompanies(id: $id) {
      ... on CompaniesResponse {
        results {
          id
          doingBusinessAs
          legalBusinessName
        }
      }
    }
  }
`;

const DISCOVER_COMPANIES_MAP_GQL = gql`
  query discoverCompaniesMap(
    $page: Float!
    $limit: Float!
    $query: String
    $isFavorite: Boolean
    $lists: [String!]
    $customerValueFrom: Float
    $customerValueTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industry: String
    $location: String
    $longitude: Float
    $latitude: Float
    $radius: Float
    $addressStreet: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $employeesFrom: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $country: String
    $state: String
    $city: String
    $postalCode: String
    $filterSearch: String
  ) {
    discoverCompaniesMap(
      query: $query
      page: $page
      limit: $limit
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customerValueFrom: $customerValueFrom
      customerValueTo: $customerValueTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      industry: $industry
      location: $location
      longitude: $longitude
      latitude: $latitude
      radius: $radius
      addressStreet: $addressStreet
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
      country: $country
      state: $state
      city: $city
      postalCode: $postalCode
      filterSearch: $filterSearch
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          locationsByIndex {
            id
            latitude
            longitude
            addressStreet
            addressStreet2
            addressStreet3
            city
            postalCode
            phone
            zip
            state
          }
        }
        count
      }
    }
  }
`;

const COUNTER_LIST = gql`
  query discoverCompanies(
    $orderBy: String
    $direction: String
    $page: Float!
    $limit: Float!
    $query: String
    $isFavorite: Boolean
    $lists: [String!]
    $customerValueFrom: Float
    $customerValueTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industry: String
    $location: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $employeesFrom: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
  ) {
    discoverCompanies(
      orderBy: $orderBy
      direction: $direction
      query: $query
      page: $page
      limit: $limit
      isFavorite: $isFavorite
      lists: $lists
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customerValueFrom: $customerValueFrom
      customerValueTo: $customerValueTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      industry: $industry
      location: $location
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
    ) {
      ... on CompaniesResponse {
        results {
          id
          locations {
            ... on LocationResponse {
              count
            }
          }
        }
        count
      }
    }
  }
`;

const GET_COMPANY_LISTS = gql`
  query getLists {
    companyLists {
      results {
        id
        name
        isPublic
        createdBy
        companyIds
        companies {
          results {
            id
          }
        }
      }
      count
    }
  }
`;

const SEARCH_COMPANIES_SUBSET_GQL = gql`
  query searchCompaniesSubset($query: String!) {
    searchCompaniesSubset(query: $query) {
      results {
        id
        legalBusinessName
        doingBusinessAs
      }
    }
  }
`;

const SEARCH_COMPANIES_BY_TAX_ID = gql`
  query searchCompaniesByTaxId($query: String!) {
    searchCompaniesByTaxId(query: $query) {
      results {
        id
        legalBusinessName
        doingBusinessAs
        taxIdNo
      }
    }
  }
`;

const SEARCH_GQL = gql`
  query discoverCompanies($query: String) {
    discoverCompanies(query: $query) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                id
                scoreValue
              }
              count
            }
          }
        }
      }
    }
  }
`;

const DISCOVER_COMPANIES_COMPARE_GQL = gql`
  query discoverCompanies(
    $page: Float!
    $limit: Float!
    $isFavorite: Boolean
    $lists: [String!]
    $orderBy: String
    $direction: String
    $query: String
    $customersFrom: Float
    $customersTo: Float
    $brandValueFrom: Float
    $brandValueTo: Float
    $employeeValueFrom: Float
    $employeeValueTo: Float
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $longevityValueFrom: Float
    $longevityValueTo: Float
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $location: String
    $longitude: Float
    $latitude: Float
    $radius: Float
    $addressStreet: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $employeesFrom: Float
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $employeesTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $tags: [String!]
    $relationships: [String!]
    $country: String
    $state: String
    $city: String
    $postalCode: String
  ) {
    discoverCompanies(
      isFavorite: $isFavorite
      query: $query
      limit: $limit
      page: $page
      lists: $lists
      orderBy: $orderBy
      direction: $direction
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesTo: $liabilitiesTo
      liabilitiesFrom: $liabilitiesFrom
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      brandValueFrom: $brandValueFrom
      brandValueTo: $brandValueTo
      employeeValueFrom: $employeeValueFrom
      employeeValueTo: $employeeValueTo
      longevityValueFrom: $longevityValueFrom
      longevityValueTo: $longevityValueTo
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      industries: $industries
      location: $location
      longitude: $longitude
      latitude: $latitude
      radius: $radius
      addressStreet: $addressStreet
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      tags: $tags
      relationships: $relationships
      country: $country
      state: $state
      city: $city
      postalCode: $postalCode
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          stimulusScore {
            ... on StimulusScoreResponse {
              results {
                scoreValue
                brandValue
                customerValue
                employeeValue
                longevityValue
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
              }
            }
          }
          customers
          customersGrowthCAGR
          employeesTotal
          revenue
          revenueGrowthCAGR
          netProfit
          netProfitGrowthCAGR
          totalAssets
          diverseOwnership
          projectsOverview {
            globalSpent
            totalProjects
            accountProjects
            accountSpent
          }
          tenantCompanyRelation {
            id
            isFavorite
            isToCompare
            type
            status
          }
        }
      }
    }
  }
`;

const COMPANIES_BY_IDS_GQL = gql`
  query searchCompaniesByIds($ids: [String!]) {
    searchCompanies(ids: $ids) {
      ... on CompaniesResponse {
        results {
          id
          doingBusinessAs
          legalBusinessName
        }
      }
    }
  }
`;

const GET_NAICS_INDUSTRIES = gql`
  {
    industries {
      __typename
      ... on IndustryResponse {
        results {
          id
          title
          code
        }
      }
    }
  }
`;
const SAVED_SEARCHES = gql`
  {
    savedSearches {
      ... on SavedSearchResponse {
        results {
          id
          name
          public
          config {
            query
            scoreValueFrom
            scoreValueTo
            industries
            tags
            jurisdictionOfIncorporation
            typeOfLegalEntity
            revenueFrom
            revenueTo
            employeesFrom
            employeesTo
            companyType
            companyStatus
            diverseOwnership
            revenuePerEmployeeFrom
            revenuePerEmployeeTo
            revenueGrowthFrom
            revenueGrowthTo
            relationships
            location
            boardTotalFrom
            boardTotalTo
            leadershipTeamTotalFrom
            leadershipTeamTotalTo
            netProfitFrom
            netProfitTo
            netProfitPctFrom
            netProfitPctTo
            liabilitiesFrom
            liabilitiesTo
            customersFrom
            customersTo
            netPromoterScoreFrom
            netPromoterScoreTo
            twitterFollowersFrom
            twitterFollowersTo
            linkedInFollowersFrom
            linkedInFollowersTo
            facebookFollowersFrom
            facebookFollowersTo
            liabilitiesPctOfRevenueFrom
            liabilitiesPctOfRevenueTo
            employeesGrowthFrom
            employeesGrowthTo
            assetsFrom
            assetsTo
            assetsPctOfRevenueFrom
            assetsPctOfRevenueTo
            radius
            country
            region
            city
            postalCode
            latitude
            longitude
            currentLocationIsSet
          }
        }
      }
    }
  }
`;
const COUNT_COMPANIES_LIST = gql`
  query countCompaniesByList($listType: Float) {
    countCompaniesByList(listType: $listType) {
      ... on CountCompaniesResponse {
        count
      }
    }
  }
`;

const SEARCH_INTERNAL_COMPANIES_DASHBOARD = gql`
  query getInternalCompaniesDashboard($timePeriodFilter: String, $granularityFilter: String) {
    getInternalCompaniesDashboard(timePeriodFilter: $timePeriodFilter, granularityFilter: $granularityFilter) {
      ... on InternalCompaniesDashboardResponse {
        results {
          name
          Companies
        }
        count
        checkPrevYear
      }
    }
  }
`;

const CHECK_INTERNAL_DASHBOARD = gql`
  {
    checkDataInternalDashboard {
      ... on InternalCompaniesDashboardResponse {
        hasData
        prevYear
        currentYear
      }
    }
  }
`;

const SEARCH_COMPANIES_BY_NAME_TAXID = gql`
  query getCompaniesByTaxIdAndName($query: String) {
    getCompaniesByTaxIdAndName(
      query: $query
      filterSearch: "taxIdNo, legalBusinessName"
      page: 1
      limit: 6
      orderBy: "doingBusinessAs"
      direction: "ASC"
    ) {
      ... on CompaniesResponse {
        results {
          id
          legalBusinessName
          doingBusinessAs
          taxIdNo
        }
        count
      }
    }
  }
`;

const COMPANY_ATTACHMENT_DETAILS_GQL = gql`
  query companyAttachmentsDetails($companyId: String!, $type: String) {
    companyAttachmentsDetails(companyId: $companyId, type: $type) {
      ... on CompanyAttachmentResponse {
        results {
          id
          originalFilename
          size
          type
        }
        count
      }
    }
  }
`;

const CompanyQueries = {
  COUNT_COMPANIES_LIST,
  COMPANY_DETAILS_GQL,
  COMPANIES_TO_COMPARE_GQL,
  COMPANY_EIN_SEARCH_GQL,
  HOME_COMPANIES_GQL,
  SCORE_COMPARISON_GQL,
  COMPANY_COMPARISON_GQL,
  SEARCH_UNUSED_COMPANIES,
  COMPANY_LIST_GQL,
  TOP_COMPANIES_GQL,
  COMPANY_SCORES_SEARCH_GQL,
  DISCOVER_COMPANIES_MAP_GQL,
  COMPANY_NOTES_GQL,
  DISCOVER_COMPANIES_GQL,
  DISCOVER_COMPANIES_GQL_LISTS,
  COMPANY_TARGET_SCORE_GQL,
  COMPANY_EIN_SCORE_GQL,
  COMPANY_OR_USER_ASSETS,
  COMPANY_EVALUATION_NOTES_GQL,
  COMPANY_ACTIVITY_LOG_GQL,
  GET_COMPANY_DIVERSE_OWNERSHIP,
  GET_COMPANY_MINORITY_OWNERSHIP,
  GET_MINORITY_OWNERSHIP_DETAIL,
  GET_COMPANY_TAGS,
  GET_COMPANY_NAME,
  COUNTER_LIST,
  GET_COMPANY_LISTS,
  SEARCH_COMPANIES_SUBSET_GQL,
  SEARCH_GQL,
  SEARCH_COMPANIES_BY_TAX_ID,
  DISCOVER_COMPANIES_COMPARE_GQL,
  COMPANIES_BY_IDS_GQL,
  GET_NAICS_INDUSTRIES,
  SAVED_SEARCHES,
  USER_TENANTS,
  HOME_PROJECTS_GQL,
  USER_ACCOUNT,
  PROJECT_DETAILS_GQL,
  PROJECT_DETAILS_TO_UPDATE_GQL,
  PROJECTS_GQL,
  PROJECTS_PENDING_REVIEW_GQL,
  PROJECTS_ACCESS_PENDING,
  AVAILABLE_PROJECTS_GQL,
  FILTER_COMPANY_TAGS,
  RELATIONSHIP_PANEL_INFO,
  DOWNLOAD_LIST,
  CHECK_INTERNAL_DASHBOARD,
  SEARCH_INTERNAL_COMPANIES_DASHBOARD,
  SEARCH_COMPANIES_BY_NAME_TAXID,
  DISCOVER_COMPANIES_SELECT100,
  COMPANY_TAX_ID_SEARCH_PROFILE,
  COMPANY_ATTACHMENT_DETAILS_GQL,
};

export default CompanyQueries;
