import { Certification } from '../certification/certification.entity';
import { Contact } from '../contact/contact.entity';
import { Company } from './company.entity';

export const TCR_TYPE_FILTER = 'tcr/type';
export const TCR_STATUS_FILTER = 'tcr/status';
export const TCR_TENANT_ID_FILTER = 'tcr/tenantId';
export const PAST_TO_EMPTY = 'PAST_TO_EMPTY';

export enum LegalEntityType {
  NONE = '',
  CORPORATION = 'Corporation',
  NOT_FOR_PROFIT = 'Not for Profit',
  LIMITED_LIABILITY_COMPANY = 'Limited Liability Company',
  GOVERNMENT = 'Government',
  INDIVIDUAL_PROPRIETORSHIP = 'Individual Proprietorship',
  PARTNERSHIP = 'Partnership',
}

export enum DiverseOwnershipValues {
  MINORITY = 'Minority',
  WOMEN = 'Women',
  VETERAN = 'Veteran',
  LGBTQ = 'LGBTQ+',
  DISABLED = 'Disabled',
  DISADVANTAGED = 'Disadvantaged',
  IMMIGRANT = 'Immigrant',
  BCorp = 'B-Corp',
  NativeAmerican = 'Native American',
}

export enum MinorityOwnershipDetailValues {
  ASIAN = 'Asian',
  BLACK_AFRICAN_AMERICAN = 'Black / African American',
  HISPANIC_LATINO = 'Hispanic / Latino',
  NATIVE_AMERICAN_ALASKA_NATIVE = 'Native American / Alaska Native',
  NATIVE_HAWAIIAN_OTHER_PACIFIC_ISLANDER = 'Native Hawaiian / Other pacific Islander',
  MIDDLE_EASTERN_NORTH_AFRICAN = 'Middle Eastern / North African',
  OTHER = 'Other',
}

export enum CompanyAttachmentTypes {
  RELATIONSHIP = 'Relationship',
  CERTIFICATION = 'Certification',
  INSURANCE = 'Insurance',
  PROJECT = 'Project',
  PRODUCTS = 'Products',
  FINANCIALS = 'Financials',
  DIVERSITY = 'Diversity',
  CONTACTS = 'Contacts',
}

export enum OperatingStatus {
  OPEN = 'Open',
  TEMPORARY_CLOSED = 'Temporary closed',
  PERMANENTLY_CLOSED = 'Permanently closed',
}

export enum LeaderDiverse {
  MINORITY = 'Minority',
  WOMEN = 'Women',
  VETERAN = 'Veteran',
  LGBTQ = 'LGBTQ+',
  DISABLED = 'Disabled',
  DISADVANTAGED = 'Disadvantaged',
  NativeAmerican = 'Native American',
}

export enum ErrorCodes {
  INVALID_TYPE = 1001,
  INVALID_VALUE = 1002,
  NEGATIVE_VALUE = 1003,
  FORMAT_VALIDATED = 1004,
  MAX_LIMIT_EXCEEDED = 1005,
}

export interface CompanyWithMinorityOwnerShip extends Company {
  minorityOwnership: string[];
  contactsByIndex: Contact[];
  certificationsByIndex: Certification[];
}
