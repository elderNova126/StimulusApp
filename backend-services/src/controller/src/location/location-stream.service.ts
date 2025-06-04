import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Location } from './location.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { DataTraceMetaService } from 'src/shared/data-trace-meta/data-trace-meta.service';

@Injectable({ scope: Scope.REQUEST })
export class LocationStreamService {
  private readonly locationRepository: Repository<Location>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly dataTraceMetaService: DataTraceMetaService
  ) {
    this.locationRepository = connection.getRepository(Location);
  }

  async createLocations(locationsData: Location[]): Promise<any> {
    const errors = [];
    const pointsArray = [];
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();

    const internalIds = locationsData.map((x) => x.company.internalId);

    const tcrs = await this.tenantCompanyRelationService.getTCRsFromTenantContext(internalIds);
    const locations = locationsData as unknown as Location[];

    for (const location of locations) {
      const i = locations.indexOf(location);
      const internalId = location.company.internalId;
      const tenantCompany = tcrs.find((x) => x.internalId === location.company.internalId);

      if (tenantCompany) {
        const dataTrace = locationsData[i];
        this.dataTraceMetaService.addDataTraceMeta({
          data: location,
          tenantCompany,
          internalId,
          tenantId,
          userId,
          dataTrace,
        });
        location.company = tenantCompany.company;
        pointsArray.push(location);
      } else errors.push(location.company.internalId);
    }

    await this.locationRepository
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(pointsArray)
      .execute()
      .catch(async (error) => {
        this.logger.log('Failed to add locations using the bulk insert method. Move to for each approach.');
        this.logger.debug(`Error is : ${error}`);
        await Promise.all(
          locationsData.map((location) => {
            return this.createLocationWithCompany(location).catch((err) => {
              this.logger.error(`Failed to create location with error ${err}`);
              if (location.internalId) errors.push(location.internalId);
              return undefined;
            });
          })
        ).then((result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${locationsData.length} locations`);
        });
      });

    return errors;
  }

  async createLocationWithCompany(locationData: Location) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      locationData.company.internalId
    );
    locationData.company = tenantCompany.company;
    return this.locationRepository.save(locationData);
  }

  async updateLocationUsingInternalId(internalId: string, locationData: Location): Promise<UpdateResult> {
    return this.locationRepository.update({ internalId }, locationData);
  }

  async deleteLocationUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.locationRepository.delete({ internalId });
  }
}
