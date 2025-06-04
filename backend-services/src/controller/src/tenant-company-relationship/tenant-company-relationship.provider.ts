import { TenantCompanyRelationship } from './tenant-company-relationship.entity';

export class TenantProvider {
  static buildTenantCompany(): TenantCompanyRelationship {
    const tenantCompanyRelation = new TenantCompanyRelationship();
    tenantCompanyRelation.id = 'id-uuid';
    tenantCompanyRelation.companyId = 'company-id-uuid';
    tenantCompanyRelation.internalId = 'internal-id-uuid';
    tenantCompanyRelation.isFavorite = false;
    tenantCompanyRelation.noOfProjects = 0;
    tenantCompanyRelation.totalSpent = 0;
    return tenantCompanyRelation;
  }
}
