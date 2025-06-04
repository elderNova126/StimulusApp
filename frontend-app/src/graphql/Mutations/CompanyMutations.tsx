import { gql } from '@apollo/client';

const CREATE_COMPANY_NOTE_GQL = gql`
  mutation createCompanyNote($companyId: String!, $body: String!, $parentNoteId: Float) {
    createCompanyNote(companyId: $companyId, body: $body, parentNoteId: $parentNoteId) {
      ... on CompanyNote {
        id
        body
        createdBy
        created
        parentNote
      }
    }
  }
`;

const UPDATE_COMPANY_NOTE_GQL = gql`
  mutation updateCompanyNote($id: Float!, $body: String!) {
    updateCompanyNote(id: $id, body: $body) {
      __typename
      ... on CompanyNote {
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

const DELETE_COMPANY_NOTE_GQL = gql`
  mutation deleteCompanyNote($id: Float!) {
    deleteCompanyNote(id: $id) {
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

const CREATE_COMPANY_EVALUATION_NOTE_GQL = gql`
  mutation createCompanyEvaluationNote($companyEvaluationId: Float!, $body: String!, $parentNoteId: Float) {
    createCompanyEvaluationNote(companyEvaluationId: $companyEvaluationId, body: $body, parentNoteId: $parentNoteId) {
      ... on CompanyEvaluationNote {
        id
        body
        createdBy
        created
        parentNote
      }
    }
  }
`;

const UPDATE_COMPANY_EVALUATION_NOTE_GQL = gql`
  mutation updateCompanyEvaluationNote($id: Float!, $body: String!) {
    updateCompanyEvaluationNote(id: $id, body: $body) {
      __typename
      ... on CompanyEvaluationNote {
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

const DELETE_COMPANY_EVALUATION_NOTE_GQL = gql`
  mutation deleteCompanyEvaluationNote($id: Float!) {
    deleteCompanyEvaluationNote(id: $id) {
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

const ADD_COMPANIES_TO_PROJECT = gql`
  mutation addCompaniesToProject($projectId: Float!, $companyIds: [String!]) {
    addCompaniesToProject(projectId: $projectId, companyIds: $companyIds) {
      ... on ErrorResponse {
        error
        code
        details
      }
      ... on Project {
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
`;

const EVALUATE_COMPANY = gql`
  mutation (
    $id: Float
    $projectCompanyId: Float
    $projectId: Float
    $quality: Float
    $reliability: Float
    $features: Float
    $cost: Float
    $relationship: Float
    $financial: Float
    $diversity: Float
    $innovation: Float
    $flexibility: Float
    $brand: Float
    $budgetSpend: Float
    $description: String
    $evaluationDate: String
  ) {
    evaluateCompany(
      id: $id
      projectCompanyId: $projectCompanyId
      projectId: $projectId
      quality: $quality
      reliability: $reliability
      features: $features
      cost: $cost
      relationship: $relationship
      financial: $financial
      diversity: $diversity
      innovation: $innovation
      flexibility: $flexibility
      brand: $brand
      budgetSpend: $budgetSpend
      description: $description
      evaluationDate: $evaluationDate
    ) {
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
`;

const UPDATE_COMPANY_EVALUATION = gql`
  mutation (
    $id: Float!
    $projectCompanyId: Float
    $projectId: Float
    $quality: Float
    $reliability: Float
    $features: Float
    $cost: Float
    $relationship: Float
    $financial: Float
    $diversity: Float
    $innovation: Float
    $flexibility: Float
    $brand: Float
    $budgetSpend: Float
    $description: String
    $evaluationDate: String
  ) {
    updateCompanyEvaluation(
      id: $id
      projectCompanyId: $projectCompanyId
      projectId: $projectId
      quality: $quality
      reliability: $reliability
      features: $features
      cost: $cost
      relationship: $relationship
      financial: $financial
      diversity: $diversity
      innovation: $innovation
      flexibility: $flexibility
      brand: $brand
      budgetSpend: $budgetSpend
      description: $description
      evaluationDate: $evaluationDate
    ) {
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
`;

const UPDATE_COMPANY_CRITERIA_ANSWER_GQL = gql`
  mutation ($projectId: Float!, $companyId: String!, $criteriaAnswers: String!) {
    answerProjectCriteria(projectId: $projectId, companyId: $companyId, criteriaAnswers: $criteriaAnswers) {
      ... on ProjectCompany {
        id
        criteriaAnswers {
          criteria
          answer
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

const UPDATE_COMPANY = gql`
  mutation (
    $id: String!
    $parentCompanyTaxId: String
    $description: String
    $legalBusinessName: String
    $taxIdNo: String
    $doingBusinessAs: String
    $jurisdictionOfIncorporation: String
    $yearFounded: Float
    $typeOfLegalEntity: String
    $creditScoreBusinessNo: String
    $webDomain: String
    $emailDomain: String
    $linkedInFollowers: Float
    $facebookFollowers: Float
    $twitterFollowers: Float
    $currency: String
    $revenue: Float
    $revenueGrowthCAGR: Float
    $netProfit: Float
    $netProfitGrowthCAGR: Float
    $assetsRevenueRatio: Float
    $totalLiabilities: Float
    $liabilitiesRevenueRatio: Float
    $totalAssets: Float
    $customers: Float
    $customersGrowthCAGR: Float
    $employeesTotal: Float
    $employeesDiverse: Float
    $leadershipTeamTotal: Float
    $boardTotal: Float
    $boardDiverse: Float
    $website: String
    $diverseOwnership: [String!]
    $minorityOwnership: [String!]
    $smallBusiness: Boolean
    $ownershipDescription: String
    $tags: [String!]
    $industryIds: [String!]
    $newCustomIndustries: [String!]
    $previousBusinessNames: [String!]
    $otherBusinessNames: [String!]
    $operatingStatus: String
    $internalId: String
    $internalName: String
    $netPromoterScore: Float
    $facebook: String
    $twitter: String
    $linkedin: String
  ) {
    updateCompany(
      traceFrom: "UI"
      id: $id
      tags: $tags
      diverseOwnership: $diverseOwnership
      minorityOwnership: $minorityOwnership
      smallBusiness: $smallBusiness
      ownershipDescription: $ownershipDescription
      parentCompanyTaxId: $parentCompanyTaxId
      description: $description
      legalBusinessName: $legalBusinessName
      taxIdNo: $taxIdNo
      doingBusinessAs: $doingBusinessAs
      # industry: $industry
      jurisdictionOfIncorporation: $jurisdictionOfIncorporation
      yearFounded: $yearFounded
      typeOfLegalEntity: $typeOfLegalEntity
      # industryClassificationCode: $industryClassificationCode
      creditScoreBusinessNo: $creditScoreBusinessNo
      webDomain: $webDomain
      emailDomain: $emailDomain
      linkedInFollowers: $linkedInFollowers
      facebookFollowers: $facebookFollowers
      twitterFollowers: $twitterFollowers
      currency: $currency
      revenue: $revenue
      revenueGrowthCAGR: $revenueGrowthCAGR
      netProfit: $netProfit
      netProfitGrowthCAGR: $netProfitGrowthCAGR
      assetsRevenueRatio: $assetsRevenueRatio
      totalLiabilities: $totalLiabilities
      liabilitiesRevenueRatio: $liabilitiesRevenueRatio
      totalAssets: $totalAssets
      customers: $customers
      customersGrowthCAGR: $customersGrowthCAGR
      employeesTotal: $employeesTotal
      employeesDiverse: $employeesDiverse
      boardDiverse: $boardDiverse
      boardTotal: $boardTotal
      leadershipTeamTotal: $leadershipTeamTotal
      website: $website
      industryIds: $industryIds
      newCustomIndustries: $newCustomIndustries
      previousBusinessNames: $previousBusinessNames
      otherBusinessNames: $otherBusinessNames
      operatingStatus: $operatingStatus
      internalId: $internalId
      internalName: $internalName
      netPromoterScore: $netPromoterScore
      facebook: $facebook
      twitter: $twitter
      linkedin: $linkedin
    ) {
      ... on ErrorResponse {
        error
        code
        details
      }
      ... on Company {
        id
        created
        updated
        description
        legalBusinessName
        taxIdNo
        parentCompany {
          id
          legalBusinessName
          taxIdNo
        }
        doingBusinessAs
        # industry
        jurisdictionOfIncorporation
        yearFounded
        typeOfLegalEntity
        # industryClassificationCode
        creditScoreBusinessNo
        webDomain
        website
        diverseOwnership
        minorityOwnership
        tags {
          id
          tag
          created
        }
        emailDomain
        linkedInFollowers
        facebookFollowers
        twitterFollowers
        currency
        revenue
        revenueGrowthCAGR
        netProfit
        netProfitGrowthCAGR
        assetsRevenueRatio
        totalLiabilities
        liabilitiesRevenueRatio
        totalAssets
        netPromoterScore
        customers
        customersGrowthCAGR
        tenantCompanyRelation {
          id
          status
          internalId
          internalName
        }
        names {
          id
          name
          type
        }
        previousBusinessNames
        operatingStatus
        otherBusinessNames
        parentCompanyTaxId
        industries {
          id
          title
          code
          description
        }
      }
    }
  }
`;
const SET_COMPANY_TO_INTERNAL = gql`
  mutation ($companyId: String!) {
    setCompanyTypeToInternal(companyId: $companyId)
    setCompanyActive(companyId: $companyId)
  }
`;

const SET_COMPANY_TYPE_ACTIVE = gql`
  mutation ($companyId: String!) {
    setCompanyActive(companyId: $companyId)
  }
`;
const SET_COMPANY_TYPE_INACTIVE = gql`
  mutation ($companyId: String!) {
    setCompanyInactive(companyId: $companyId)
  }
`;

const SET_COMPANY_TYPE_ARCHIVED = gql`
  mutation ($companyId: String!) {
    setCompanyArchived(companyId: $companyId)
  }
`;

const BULK_SET_COMPANY_TO_INTERNAL = gql`
  mutation bulkSetCompanyTypeToInternal($companyIds: [String!]) {
    bulkSetCompanyTypeToInternal(companyIds: $companyIds) {
      results {
        id
        type
        status
      }
    }
  }
`;
const CREATE_INDUSTRY = gql`
  mutation createIndustry($id: String, $title: String!, $description: String, $code: String) {
    createIndustry(id: $id, title: $title, description: $description, code: $code) {
      ... on Industry {
        id
        title
        code
      }
    }
  }
`;

const CREATE_COMPANY = gql`
  mutation createCompany($taxIdNo: String!, $legalBusinessName: String!) {
    createCompany(taxIdNo: $taxIdNo, legalBusinessName: $legalBusinessName) {
      ... on Company {
        id
        legalBusinessName
        taxIdNo
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const UPLOAD_COMPANY_ATTACHMENT_GQL = gql`
  mutation uploadCompanyAttachment($files: [Upload!]!, $companyId: String!, $isPrivate: Boolean!, $type: String) {
    uploadCompanyAttachment(files: $files, companyId: $companyId, isPrivate: $isPrivate, type: $type) {
      ... on CompanyAttachmentResponse {
        results {
          id
          url
          filename
          createdBy
          originalFilename
          size
          type
        }
        count
      }
    }
  }
`;

const DELETE_COMPANY_ATTACHMENT_GQL = gql`
  mutation deleteCompanyAttachment($id: Float!) {
    deleteCompanyAttachment(id: $id) {
      ... on BaseResponse {
        done
        error
      }
    }
  }
`;

const CompanyMutations = {
  CREATE_COMPANY_NOTE_GQL,
  UPDATE_COMPANY_NOTE_GQL,
  DELETE_COMPANY_NOTE_GQL,
  EVALUATE_COMPANY,
  UPDATE_COMPANY_EVALUATION,
  UPDATE_COMPANY_EVALUATION_NOTE_GQL,
  CREATE_COMPANY_EVALUATION_NOTE_GQL,
  DELETE_COMPANY_EVALUATION_NOTE_GQL,
  UPDATE_COMPANY_CRITERIA_ANSWER_GQL,
  UPDATE_COMPANY,
  SET_COMPANY_TO_INTERNAL,
  SET_COMPANY_TYPE_ACTIVE,
  SET_COMPANY_TYPE_INACTIVE,
  SET_COMPANY_TYPE_ARCHIVED,
  ADD_COMPANIES_TO_PROJECT,
  BULK_SET_COMPANY_TO_INTERNAL,
  CREATE_INDUSTRY,
  CREATE_COMPANY,
  UPLOAD_COMPANY_ATTACHMENT_GQL,
  DELETE_COMPANY_ATTACHMENT_GQL,
};

export default CompanyMutations;
