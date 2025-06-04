import { gql } from '@apollo/client';

const CHANGE_SETTINGS_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isFavorite: Boolean, $isToCompare: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isFavorite: $isFavorite, isToCompare: $isToCompare) {
      __typename
      ... on TenantCompanyRelation {
        id
        isFavorite
        isToCompare
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CHANGE_FAVORITE_SETTING_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isFavorite: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isFavorite: $isFavorite) {
      __typename
      ... on TenantCompanyRelation {
        id
        isFavorite
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

const CHANGE_COMPARISON_SETTING_GQL = gql`
  mutation updateTenantCompanyRelation($id: String!, $isToCompare: Boolean) {
    updateTenantCompanyRelation(companyId: $id, isToCompare: $isToCompare) {
      __typename
      ... on TenantCompanyRelation {
        id
        isToCompare
      }
      ... on ErrorResponse {
        error
        code
        details
      }
    }
  }
`;

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
    $contract: Float!
    $expectedStartDate: String!
    $parentProjectTreeId: Float
    $expectedEndDate: String
    $budget: Float
    $selectionCriteria: [String!]
  ) {
    createProject(
      title: $title
      description: $description
      keywords: $keywords
      contract: $contract
      parentProjectTreeId: $parentProjectTreeId
      expectedStartDate: $expectedStartDate
      expectedEndDate: $expectedEndDate
      budget: $budget
      selectionCriteria: $selectionCriteria
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

const SAVE_SEARCH = gql`
  mutation createSavedSearch(
    $name: String
    $query: String
    $scoreValueFrom: Float
    $scoreValueTo: Float
    $industries: [String!]
    $jurisdictionOfIncorporation: String
    $typeOfLegalEntity: String
    $revenueFrom: Float
    $revenueTo: Float
    $employeesFrom: Float
    $employeesTo: Float
    $public: Boolean
    $companyType: String
    $companyStatus: String
    $diverseOwnership: [String!]
    $revenuePerEmployeeFrom: Float
    $revenuePerEmployeeTo: Float
    $revenueGrowthFrom: Float
    $revenueGrowthTo: Float
    $relationships: [String!]
    $location: String
    $boardTotalFrom: Float
    $boardTotalTo: Float
    $leadershipTeamTotalFrom: Float
    $leadershipTeamTotalTo: Float
    $netProfitFrom: Float
    $netProfitTo: Float
    $netProfitPctFrom: Float
    $netProfitPctTo: Float
    $liabilitiesFrom: Float
    $liabilitiesTo: Float
    $customersFrom: Float
    $customersTo: Float
    $netPromoterScoreFrom: Float
    $netPromoterScoreTo: Float
    $twitterFollowersFrom: Float
    $twitterFollowersTo: Float
    $linkedInFollowersFrom: Float
    $linkedInFollowersTo: Float
    $facebookFollowersFrom: Float
    $facebookFollowersTo: Float
    $liabilitiesPctOfRevenueFrom: Float
    $liabilitiesPctOfRevenueTo: Float
    $employeesGrowthFrom: Float
    $employeesGrowthTo: Float
    $assetsFrom: Float
    $assetsTo: Float
    $assetsPctOfRevenueFrom: Float
    $assetsPctOfRevenueTo: Float
  ) {
    createSavedSearch(
      name: $name
      query: $query
      scoreValueFrom: $scoreValueFrom
      scoreValueTo: $scoreValueTo
      industries: $industries
      jurisdictionOfIncorporation: $jurisdictionOfIncorporation
      typeOfLegalEntity: $typeOfLegalEntity
      revenueFrom: $revenueFrom
      revenueTo: $revenueTo
      employeesFrom: $employeesFrom
      employeesTo: $employeesTo
      public: $public
      companyType: $companyType
      companyStatus: $companyStatus
      diverseOwnership: $diverseOwnership
      revenuePerEmployeeFrom: $revenuePerEmployeeFrom
      revenuePerEmployeeTo: $revenuePerEmployeeTo
      revenueGrowthFrom: $revenueGrowthFrom
      revenueGrowthTo: $revenueGrowthTo
      relationships: $relationships
      location: $location
      boardTotalFrom: $boardTotalFrom
      boardTotalTo: $boardTotalTo
      leadershipTeamTotalFrom: $leadershipTeamTotalFrom
      leadershipTeamTotalTo: $leadershipTeamTotalTo
      netProfitFrom: $netProfitFrom
      netProfitTo: $netProfitTo
      netProfitPctFrom: $netProfitPctFrom
      netProfitPctTo: $netProfitPctTo
      liabilitiesFrom: $liabilitiesFrom
      liabilitiesTo: $liabilitiesTo
      customersFrom: $customersFrom
      customersTo: $customersTo
      netPromoterScoreFrom: $netPromoterScoreFrom
      netPromoterScoreTo: $netPromoterScoreTo
      twitterFollowersFrom: $twitterFollowersFrom
      twitterFollowersTo: $twitterFollowersTo
      linkedInFollowersFrom: $linkedInFollowersFrom
      linkedInFollowersTo: $linkedInFollowersTo
      facebookFollowersFrom: $facebookFollowersFrom
      facebookFollowersTo: $facebookFollowersTo
      liabilitiesPctOfRevenueFrom: $liabilitiesPctOfRevenueFrom
      liabilitiesPctOfRevenueTo: $liabilitiesPctOfRevenueTo
      employeesGrowthFrom: $employeesGrowthFrom
      employeesGrowthTo: $employeesGrowthTo
      assetsFrom: $assetsFrom
      assetsTo: $assetsTo
      assetsPctOfRevenueFrom: $assetsPctOfRevenueFrom
      assetsPctOfRevenueTo: $assetsPctOfRevenueTo
    ) {
      id
      name
      public
      config {
        query
        scoreValueFrom
        scoreValueTo
        industries
        jurisdictionOfIncorporation
        typeOfLegalEntity
        revenueFrom
        revenueTo
        employeesFrom
        employeesTo
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
      }
    }
  }
`;

const UPDATE_SAVED_SEARCH = gql`
  mutation updateSavedSearch($id: Float!, $name: String, $public: Boolean) {
    updateSavedSearch(id: $id, name: $name, public: $public) {
      id
      name
      public
    }
  }
`;

const DELETE_SAVED_SEARCH_GQL = gql`
  mutation deleteSavedSearch($id: Float!) {
    deleteSavedSearch(id: $id) {
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

const CLONE_PROJECT = gql`
  mutation cloneProject(
    $id: Float!
    $title: String!
    $relation: String!
    $includeDescription: Boolean!
    $includeSuppliers: Boolean!
    $includeNotes: Boolean!
  ) {
    cloneProject(
      id: $id
      title: $title
      relation: $relation
      includeDescription: $includeDescription
      includeSuppliers: $includeSuppliers
      includeNotes: $includeNotes
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

const NOTIFICATION_SUBSCRIBE_CATEGORY_GQL = gql`
  mutation subscribeToCategoryTopic($category: String!) {
    subscribeToCategoryTopic(category: $category) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL = gql`
  mutation unsubscribeFromCategoryTopic($category: String!) {
    unsubscribeFromCategoryTopic(category: $category) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;
const NOTIFICATION_SUBSCRIBE_GQL = gql`
  mutation subscribeToTopic($projectIds: [Float!], $companyIds: [String!], $projectCompanyIds: [String!]) {
    subscribeToTopic(projectIds: $projectIds, companyIds: $companyIds, projectCompanyIds: $projectCompanyIds) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const NOTIFICATION_UNSUBSCRIBE_GQL = gql`
  mutation unsubscribeFromTopic($projectIds: [Float!], $companyIds: [String!], $projectCompanyIds: [String!]) {
    unsubscribeFromTopic(projectIds: $projectIds, companyIds: $companyIds, projectCompanyIds: $projectCompanyIds) {
      id
      subscribedProjects
      subscribedCompanies
      subscribedProjectCompanies
    }
  }
`;

const READ_NOTIFICATION_GQL = gql`
  mutation readNotification($id: String!) {
    readNotification(id: $id) {
      ... on Notification {
        id
        read
      }
    }
  }
`;

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
    $parentCompanyId: String
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
    $diverseOwnership: String
    $tags: String
    $industryIds: [String!]
    $newCustomIndustries: [String!]
    $previousBusinessNames: String
    $otherBusinessNames: String
    $operatingStatus: String
    $internalId: String
    $internalName: String
    $netPromoterScore: Float
  ) {
    updateCompany(
      traceFrom: "UI"
      id: $id
      tags: $tags
      diverseOwnership: $diverseOwnership
      parentCompanyId: $parentCompanyId
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
        tags
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
        previousBusinessNames
        operatingStatus
        otherBusinessNames
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

const CREATE_CERTIFICATION_GQL = gql`
  mutation createCertification(
    $companyId: String!
    $name: String!
    $type: String
    $description: String
    $certificationDate: String!
    $expirationDate: String!
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

const UPDATE_CONTACT_GQL = gql`
  mutation updateContact(
    $id: String!
    $department: String
    $email: String
    $firstName: String
    $middleName: String
    $lastName: String
    $jobTitle: String
    $addressStreet: String
    $fax: String
    $language: String
    $title: String
    $website: String
    $manager: String
    $linkedin: String
    $twitter: String
    $phone: String
    $phoneAlt: String
    $emailAlt: String
    $addressStreet2: String
    $addressStreet3: String
  ) {
    updateContact(
      id: $id
      department: $department
      email: $email
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      jobTitle: $jobTitle
      addressStreet: $addressStreet
      fax: $fax
      language: $language
      title: $title
      website: $website
      manager: $manager
      linkedin: $linkedin
      twitter: $twitter
      phone: $phone
      phoneAlt: $phoneAlt
      emailAlt: $emailAlt
      addressStreet2: $addressStreet2
      addressStreet3: $addressStreet3
    ) {
      ... on Contact {
        id
        department
        email
        firstName
        middleName
        lastName
        jobTitle
        addressStreet
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
        emailAlt
        addressStreet2
        addressStreet3
      }
    }
  }
`;

const CREATE_CONTACT_GQL = gql`
  mutation createContact(
    $companyId: String!
    $department: String
    $email: String
    $firstName: String
    $middleName: String
    $lastName: String
    $jobTitle: String
    $addressStreet: String
    $fax: String
    $language: String
    $title: String
    $website: String
    $manager: String
    $linkedin: String
    $twitter: String
    $phone: String
    $phoneAlt: String
    $emailAlt: String
    $addressStreet2: String
    $addressStreet3: String
  ) {
    createContact(
      companyId: $companyId
      department: $department
      email: $email
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      jobTitle: $jobTitle
      addressStreet: $addressStreet
      fax: $fax
      language: $language
      title: $title
      website: $website
      manager: $manager
      linkedin: $linkedin
      twitter: $twitter
      phone: $phone
      phoneAlt: $phoneAlt
      emailAlt: $emailAlt
      addressStreet2: $addressStreet2
      addressStreet3: $addressStreet3
    ) {
      ... on Contact {
        id
        department
        email
        firstName
        middleName
        lastName
        jobTitle
        addressStreet
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
        emailAlt
        addressStreet2
        addressStreet3
      }
    }
  }
`;

const UPDATE_LOCATION_GQL = gql`
  mutation updateLocation(
    $id: String!
    $name: String
    $type: String
    $addressStreet: String
    $addressStreet2: String
    $addressStreet3: String
    $latitude: String
    $longitude: String
    $description: String
    $phone: String
    $fax: String
    $country: String
    $postalCode: String
    $state: String
    $city: String
  ) {
    updateLocation(
      id: $id
      name: $name
      type: $type
      addressStreet: $addressStreet
      addressStreet2: $addressStreet2
      addressStreet3: $addressStreet3
      latitude: $latitude
      longitude: $longitude
      description: $description
      phone: $phone
      fax: $fax
      country: $country
      postalCode: $postalCode
      state: $state
      city: $city
    ) {
      ... on Location {
        id
        name
        type
        addressStreet
        addressStreet2
        addressStreet3
        latitude
        longitude
        description
        phone
        fax
        country
        postalCode
        state
        city
      }
    }
  }
`;

const CREATE_LOCATION_GQL = gql`
  mutation createLocation(
    $companyId: String!
    $name: String
    $type: String
    $addressStreet: String
    $addressStreet2: String
    $addressStreet3: String
    $latitude: String
    $longitude: String
    $description: String
    $phone: String
    $fax: String
    $country: String
    $postalCode: String
    $state: String
    $city: String
    $zip: String
  ) {
    createLocation(
      companyId: $companyId
      name: $name
      type: $type
      addressStreet: $addressStreet
      addressStreet2: $addressStreet2
      addressStreet3: $addressStreet3
      latitude: $latitude
      longitude: $longitude
      description: $description
      phone: $phone
      fax: $fax
      country: $country
      postalCode: $postalCode
      state: $state
      city: $city
      zip: $zip
    ) {
      ... on Location {
        id
        name
        type
        addressStreet
        addressStreet2
        addressStreet3
        latitude
        longitude
        description
        phone
        fax
        country
        zip
        postalCode
        state
        city
      }
    }
  }
`;

const CREATE_PRODUCT_GQL = gql`
  mutation createProduct($companyId: String!, $name: String, $type: String, $description: String) {
    createProduct(companyId: $companyId, name: $name, type: $type, description: $description) {
      ... on Product {
        id
        name
        type
        description
      }
    }
  }
`;

const UPDATE_PRODUCT_GQL = gql`
  mutation updateProduct($id: String!, $name: String, $type: String, $description: String) {
    updateProduct(id: $id, name: $name, type: $type, description: $description) {
      ... on Product {
        id
        name
        type
        description
      }
    }
  }
`;

const CREATE_CONTINGENCY_GQL = gql`
  mutation createContingency($companyId: String!, $name: String, $type: String, $description: String) {
    createContingency(companyId: $companyId, name: $name, type: $type, description: $description) {
      ... on Contingency {
        id
        name
        type
        description
      }
    }
  }
`;

const UPDATE_CONTINGENCY_GQL = gql`
  mutation updateContingency($id: String!, $name: String, $type: String, $description: String) {
    updateContingency(id: $id, name: $name, type: $type, description: $description) {
      ... on Contingency {
        id
        name
        type
        description
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

const CREATE_COMPANY_LIST = gql`
  mutation createCompanyList($name: String!) {
    createCompanyList(name: $name) {
      ... on CompanyList {
        id
        name
        isPublic
        companies {
          results {
            id
          }
        }
      }
    }
  }
`;

const CLONE_COMPANY_LIST = gql`
  mutation cloneCompanyList($id: String!, $name: String!) {
    cloneCompanyList(id: $id, name: $name) {
      ... on CompanyList {
        id
        name
        isPublic
        companies {
          results {
            id
          }
        }
      }
    }
  }
`;
const ADD_TO_COMPANY_LIST = gql`
  mutation addCompanyToList($listId: String!, $companyIds: [String!]) {
    addToCompanyList(id: $listId, companyIds: $companyIds) {
      __typename
      ... on CompanyList {
        id
        createdBy
        companyIds
        companies {
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
        }
        name
        isPublic
      }
    }
  }
`;

const UPDATE_COMPANY_LIST = gql`
  mutation updateCompanyList($id: String!, $name: String!) {
    updateCompanyList(id: $id, name: $name) {
      __typename
      ... on CompanyList {
        id
        name
      }
    }
  }
`;

const DELETE_COMPANY_LIST = gql`
  mutation deleteCompanyList($id: Float!) {
    deleteCompanyList(id: $id) {
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
const REMOVE_COMPANY_FROM_LIST = gql`
  mutation removeFromCompanyList($listId: String!, $companyIds: [String!], $tenantId: String) {
    removeFromCompanyList(id: $listId, companyIds: $companyIds, tenantId: $tenantId) {
      __typename
      ... on CompanyList {
        id
        createdBy
        companyIds
        companies {
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
        }
        name
        isPublic
      }
    }
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

const BULK_CHANGE_FAVORITE_SETTING_GQL = gql`
  mutation bulkUpdateTenantCompanyRelations($companyIds: [String!], $isFavorite: Boolean) {
    bulkUpdateTenantCompanyRelations(companyIds: $companyIds, isFavorite: $isFavorite) {
      __typename
      ... on TenantCompanyRelationResponse {
        results {
          id
          isFavorite
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

const CREATE_SHARE_LIST = gql`
  mutation createSharedList($listId: String!, $listName: String!, $userId: String!, $tenantId: String) {
    createSharedList(listId: $listId, listName: $listName, userId: $userId, tenantId: $tenantId) {
      __typename
      ... on SharedList {
        id
        status
        user {
          id
          email
        }
        tenant {
          id
          name
        }
      }
    }
  }
`;

const CHANGE_STATUS_SHARED_LIST = gql`
  mutation changeStatusSharedList($id: String!, $listId: String!, $status: String) {
    changeStatusSharedList(id: $id, listId: $listId, status: $status) {
      __typename
      ... on SharedList {
        id
        status
        user {
          id
          email
        }
        tenant {
          id
          name
        }
      }
    }
  }
`;

const mutations = {
  NOTIFICATION_SUBSCRIBE_GQL,
  NOTIFICATION_UNSUBSCRIBE_GQL,
  CHANGE_FAVORITE_SETTING_GQL,
  CHANGE_COMPARISON_SETTING_GQL,
  CHANGE_SETTINGS_GQL,
  ADD_TO_PROJECT_GQL,
  CREATE_TENANT_GQL,
  SINGLE_UPLOAD,
  ISSUE_CONTEXT_TOKEN_GQL,
  REQUEST_ACCESS_GQL,
  UPDATE_PROJECT_STATUS,
  UPDATE_PROJECT_TYPE,
  UPDATE_PROJECT_COMPANIES,
  UPDATE_PROJECT_GQL,
  CREATE_PROJECT_GQL,
  CREATE_COMPANY_NOTE_GQL,
  CREATE_PROJECT_NOTE_GQL,
  UPDATE_PROJECT_NOTE_GQL,
  CREATE_INDUSTRY,
  UPDATE_COMPANY_NOTE_GQL,
  DELETE_COMPANY_NOTE_GQL,
  DELETE_PROJECT_NOTE_GQL,
  CANCEL_PROJECT_GQL,
  SAVE_SEARCH,
  UPDATE_SAVED_SEARCH,
  DELETE_SAVED_SEARCH_GQL,
  CLONE_PROJECT,
  READ_NOTIFICATION_GQL,
  UPDATE_PROJECT_ONGOING,
  ARCHIVE_PROJECT,
  DELETE_PROJECT,
  UPDATE_MY_PROFILE,
  UPDATE_USER_PROFILE,
  UPDATE_USER_STATUS,
  DELETE_USER,
  INVITE_USER_GQL,
  INVITE_USER_TO_PROJECT,
  ACCEPT_PROJECT_INVITATION,
  REJECT_PROJECT_INVITATION,
  CANCEL_PROJECT_COLLABORATION,
  UPLOAD_PROJECT_ATTACHMENT_GQL,
  DELETE_PROJECT_ATTACHMENT_GQL,
  UPLOAD_ASSET,
  DELETE_ASSET,
  EVALUATE_COMPANY,
  UPDATE_COMPANY_EVALUATION,
  UPDATE_COMPANY_EVALUATION_NOTE_GQL,
  CREATE_COMPANY_EVALUATION_NOTE_GQL,
  DELETE_COMPANY_EVALUATION_NOTE_GQL,
  UPDATE_COMPANY_CRITERIA_ANSWER_GQL,
  NOTIFICATION_SUBSCRIBE_CATEGORY_GQL,
  NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL,
  UPDATE_COMPANY,
  CREATE_INSURANCE_GQL,
  UPDATE_INSURANCE_GQL,
  CREATE_CERTIFICATION_GQL,
  UPDATE_CERTIFICATION_GQL,
  CREATE_CONTACT_GQL,
  UPDATE_CONTACT_GQL,
  CREATE_LOCATION_GQL,
  UPDATE_LOCATION_GQL,
  UPDATE_PRODUCT_GQL,
  CREATE_PRODUCT_GQL,
  CREATE_CONTINGENCY_GQL,
  UPDATE_CONTINGENCY_GQL,
  SET_COMPANY_TO_INTERNAL,
  SET_COMPANY_TYPE_ACTIVE,
  SET_COMPANY_TYPE_INACTIVE,
  SET_COMPANY_TYPE_ARCHIVED,
  ADD_TO_COMPANY_LIST,
  CREATE_COMPANY_LIST,
  CLONE_COMPANY_LIST,
  UPDATE_COMPANY_LIST,
  DELETE_COMPANY_LIST,
  REMOVE_COMPANY_FROM_LIST,
  ADD_COMPANIES_TO_PROJECT,
  BULK_SET_COMPANY_TO_INTERNAL,
  BULK_CHANGE_FAVORITE_SETTING_GQL,
  UPLOAD_CSV,
  MULTIPLE_UPLOAD,
  CREATE_SHARE_LIST,
  CHANGE_STATUS_SHARED_LIST,
};

export default mutations;
