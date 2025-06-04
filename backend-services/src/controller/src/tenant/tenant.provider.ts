import { TenantCompany } from './tenant-company.entity';

export class TenantProvider {
  static buildTenantCompany(): TenantCompany {
    const tenantCompany = new TenantCompany();
    tenantCompany.id = 'id-company';
    tenantCompany.name = 'name';
    tenantCompany.departmentName = 'departmentName';
    tenantCompany.ein = 'ein';
    tenantCompany.duns = 'duns';
    return tenantCompany;
  }
}
