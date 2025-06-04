import { gql } from '@apollo/client';

const UPDATE_CONTACT_GQL = gql`
  mutation updateContact(
    $id: String!
    $department: String
    $email: String
    $firstName: String
    $middleName: String
    $fullName: String
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
      fullName: $fullName
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
        fullName
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
    $fullName: String
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
      fullName: $fullName
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
        fullName
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
const ContactMutations = { CREATE_CONTACT_GQL, UPDATE_CONTACT_GQL };

export default ContactMutations;
