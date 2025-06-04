import { gql } from '@apollo/client';

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
    $radius: Float
    $country: String
    $region: String
    $city: String
    $postalCode: String
    $latitude: Float
    $longitude: Float
    $currentLocationIsSet: Boolean
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
      radius: $radius
      country: $country
      region: $region
      city: $city
      postalCode: $postalCode
      latitude: $latitude
      longitude: $longitude
      currentLocationIsSet: $currentLocationIsSet
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

const SearchMutations = {
  DELETE_SAVED_SEARCH_GQL,
  SAVE_SEARCH,
  UPDATE_SAVED_SEARCH,
};

export default SearchMutations;
