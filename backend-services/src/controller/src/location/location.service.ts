import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, Like, DeleteResult } from 'typeorm';
import { Location } from './location.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { DataTraceSource, DataTraceMeta } from 'src/core/datatrace.types';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';

@Injectable({ scope: Scope.REQUEST })
export class LocationService {
  private readonly locationRepository: Repository<Location>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly companyRepository: Repository<Company>;
  readonly searchFields = ['type', 'addressStreet', 'postalCode', 'city', 'state', 'name'];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {
    this.locationRepository = connection.getRepository(Location);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
  }

  getLocations(filters: Location, searchQuery: string) {
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.locationRepository.findAndCount({
      relations: ['company'],
      where: queryFilters,
    });
  }

  async createLocation(
    locationData: Location,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Location> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: locationData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const response = await this.locationRepository.save({
      ...locationData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });
    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_LOCATION,
      data: { company: locationData.company, location: response },
    });

    return response;
  }

  async updateLocation(
    id: string,
    locationData: Location,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Location> {
    const locationToUpdate = await this.locationRepository.findOneOrFail({ where: { id } });

    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      locationToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const updates = Object.keys(locationData)
      .map((field) => {
        const oldFieldValue = locationToUpdate[field];
        const newFieldValue = locationData[field];
        if (oldFieldValue !== newFieldValue) {
          return {
            id: field,
            from: oldFieldValue,
            to: newFieldValue,
          };
        }
      })
      .filter((val) => val);

    const response = await this.locationRepository.save({
      ...locationData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
      id,
    });

    if (updates.length) {
      this.eventService.dispatchInternalEvent({
        code: EventCode.UPDATE_COMPANY_LOCATION,
        data: { company: locationToUpdate.company, location: response, updates },
      });
    }
    const result: any = { ...locationToUpdate, ...locationData };
    return result;
  }

  async deleteLocation(id: string): Promise<DeleteResult> {
    return this.locationRepository.delete(id);
  }
}
