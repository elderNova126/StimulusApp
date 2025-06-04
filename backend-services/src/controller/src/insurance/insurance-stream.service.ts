import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Insurance } from './insurance.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';

@Injectable({ scope: Scope.REQUEST })
export class InsuranceStreamService {
  private readonly insuranceRepository: Repository<Insurance>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService
  ) {
    this.insuranceRepository = connection.getRepository(Insurance);
  }

  async createInsurances(insurancesData: Insurance[]): Promise<any> {
    const errors = [];
    const pointsArray = [];

    for (const insuranceData of insurancesData) {
      const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
        insuranceData.company.internalId
      );

      if (tenantCompany) {
        insuranceData.company = tenantCompany.company;
        pointsArray.push(insuranceData);
      } else errors.push(insuranceData.internalId);
    }
    await this.insuranceRepository
      .createQueryBuilder()
      .insert()
      .into(Insurance)
      .values(pointsArray)
      .execute()
      .catch(async (error) => {
        this.logger.log('Failed to add insurances using the bulk insert method. Move to for each approach.');
        this.logger.debug(`Error is : ${error}`);
        await Promise.all(
          insurancesData.map((insurance) => {
            return this.createInsuranceWithCompany(insurance).catch((err) => {
              this.logger.error(`Failed to create insurance with error ${err}`);
              insurance.internalId && errors.push(insurance.internalId);
              return undefined;
            });
          })
        ).then((result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${insurancesData.length} insurances`);
        });
      });
    return { errors };
  }

  async createInsuranceWithCompany(insuranceData: Insurance) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      insuranceData.company.internalId
    );
    insuranceData.company = tenantCompany.company;
    return this.insuranceRepository.save(insuranceData);
  }

  async updateInsuranceUsingInternalId(internalId: string, insuranceData: Insurance): Promise<UpdateResult> {
    return this.insuranceRepository.update({ internalId }, insuranceData);
  }

  async deleteInsuranceUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.insuranceRepository.delete({ internalId });
  }
}
