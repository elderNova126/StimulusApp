import { TenantCompanyRelationship } from 'src/tenant-company-relationship/tenant-company-relationship.entity';

export class AddDataTraceMetaDto {
  data: any;

  tenantCompany: TenantCompanyRelationship;

  internalId: string;

  tenantId: string;

  userId: string;

  dataTrace: any;
}
