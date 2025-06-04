import { Module } from '@nestjs/common';
import { TenantCompanyRelationshipService } from './tenant-company-relationship.service';
import { TenantCompanyRelationshipResolver } from './tenant-company-relationship.resolver';

@Module({
  providers: [TenantCompanyRelationshipService, TenantCompanyRelationshipResolver],
})
export class TenantCompanyRelationshipModule {}
