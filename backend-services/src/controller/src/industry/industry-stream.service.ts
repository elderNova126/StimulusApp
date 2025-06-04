import { Inject, Injectable, Scope } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { Industry } from './industry.entity';

@Injectable({ scope: Scope.REQUEST })
export class IndustryStreamService {
  private readonly industryRepository: Repository<Industry>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService
  ) {
    this.industryRepository = connection.getRepository(Industry);
  }

  async createIndustryWithCompany(industryData: Industry) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      industryData.company.internalId
    );
    industryData.company = tenantCompany.company;
    return this.industryRepository.save(industryData);
  }

  async updateIndustryUsingInternalId(internalId: string, industryData: Industry): Promise<UpdateResult> {
    return this.industryRepository.update({ internalId }, industryData);
  }

  async deleteIndustryUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.industryRepository.delete({ internalId });
  }
}
