export const ExceptionMessages = {
  COMPANY_NOT_FOUND: 'Company not found',
  INTERNALID_ALREADY_EXISTS: 'The internal id already exists',
  TAXID_ALREADY_EXISTS: 'The Tax ID is already in use',
  LEGALNAME_ALREADY_EXISTS: (companyName) => `Company ${companyName} has already been created.`,
  BADGE_NAME_ALREADY_EXISTS: 'The badge already exists',
};
