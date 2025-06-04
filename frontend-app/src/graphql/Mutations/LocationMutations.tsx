import { gql } from '@apollo/client';

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
const LocationMutations = {
  CREATE_LOCATION_GQL,
  UPDATE_LOCATION_GQL,
};
export default LocationMutations;
