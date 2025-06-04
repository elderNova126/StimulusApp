import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { Contingency } from './contingency.entity';

@Injectable()
export class ContingencyStreamService {
  private readonly contingencyRepository: Repository<Contingency>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService
  ) {
    this.contingencyRepository = connection.getRepository(Contingency);
  }

  async createContingencies(contingenciesData: Contingency[]): Promise<any> {
    const errors = [];
    const pointsArray = [];

    for (const contingencyData of contingenciesData) {
      const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
        contingencyData.company.internalId
      );

      if (tenantCompany) {
        contingencyData.company = tenantCompany.company;
        pointsArray.push(contingencyData);
      } else errors.push(contingencyData.internalId);
    }
    await this.contingencyRepository
      .createQueryBuilder()
      .insert()
      .into(Contingency)
      .values(pointsArray)
      .execute()
      .catch(async (error) => {
        this.logger.log('Failed to add contingencies using the bulk insert method. Move to for each approach.');
        this.logger.debug(`Error is : ${error}`);
        await Promise.all(
          contingenciesData.map((contingency) => {
            return this.createContingencyWithCompany(contingency).catch((err) => {
              this.logger.error(`Failed to create contingencyn with error ${err}`);
              contingency.internalId && errors.push(contingency.internalId);
              return undefined;
            });
          })
        ).then((result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${contingenciesData.length} contingencies`);
        });
      });

    return { errors };
  }

  async createContingencyWithCompany(contingencyData: Contingency) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      contingencyData.company.internalId
    );
    contingencyData.company = tenantCompany.company;
    return this.contingencyRepository.save(contingencyData);
  }

  async updateContingencyUsingInternalId(internalId: string, contingencyData: Contingency): Promise<UpdateResult> {
    return this.contingencyRepository.update({ internalId }, contingencyData);
  }

  async deleteContingencyUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.contingencyRepository.delete({ internalId });
  }
}
