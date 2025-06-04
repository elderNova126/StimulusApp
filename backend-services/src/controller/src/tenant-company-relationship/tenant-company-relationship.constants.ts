import { SupplierStatus, SupplierType } from './tenant-company-relationship.entity';

export const defaultTCR = {
  companyId: '',
  favoriteUpdatedAt: null,
  isFavorite: false,
  isToCompare: false,
  internalName: null,
  status: SupplierStatus.INACTIVE,
  tenantId: '',
  type: SupplierType.EXTERNAL,
};

export const TenantCompanyRelationType = {
  EXTERNAL: 'EXTERNAL',
  INTERNAL: 'INTERNAL',
};
