export enum ProjectStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  INREVIEW = 'INREVIEW',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum ProjectType {
  UNOFFICIAL = 'UNOFFICIAL',
  PENDING = 'PENDING',
  OFFICIAL = 'OFFICIAL',
}

export enum CompanyProjectType {
  CONSIDERED = 'CONSIDERED',
  QUALIFIED = 'QUALIFIED',
  SHORTLISTED = 'SHORTLISTED',
  AWARDED = 'AWARDED',
  CLIENT = 'CLIENT',
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortBy {
  NAME = 'displayName',
  STATUS = 'status',
  SCORE = 'scoreValue',
  PROJECT_START_DATE = 'project.startDate',
}

export enum EventCategoryType {
  PROJECT = 'PROJECT',
  COMPANY = 'COMPANY',
  LIST = 'LIST',
}

export enum ShareListsEvents {
  SHARE_LIST = 'SHARE_LIST',
  SHARE_LIST_ACCEPT = 'SHARE_LIST_ACCEPT',
  SHARE_LIST_DECLINE = 'SHARE_LIST_DECLINE',
  SHARE_LIST_DELETE = 'SHARE_LIST_DELETE',
}

export enum SupplierType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum CollaborationStatus {
  PENDING = 'pending',
  ACCEPT = 'accept',
  REJECTED = 'rejected',
}
