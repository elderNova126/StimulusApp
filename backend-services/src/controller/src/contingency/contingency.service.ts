import { Injectable, Inject } from '@nestjs/common';
import { Contingency } from './contingency.entity';
import { Repository, Like, DeleteResult } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Company } from '../company/company.entity';
import { InternalEventService } from '../event/internal-event.service';
import { EventCode } from '../event/event-code.enum';

@Injectable()
export class ContingencyService {
  private readonly contingencyRepository: Repository<Contingency>;
  readonly searchFields = ['type', 'addressStreet', 'postalCode', 'city', 'state', 'name'];
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly companyRepository: Repository<Company>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {
    this.contingencyRepository = connection.getRepository(Contingency);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
  }

  getContingencies(filters: Contingency, searchQuery: string) {
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.contingencyRepository.findAndCount({
      relations: ['company'],
      where: queryFilters,
    });
  }

  async createContingency(
    contingencyData: Contingency,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Contingency> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: contingencyData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const response = await this.contingencyRepository.save({
      ...contingencyData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });

    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_CONTINGENCY,
      data: { company: contingencyData.company, contingency: response },
    });

    return response;
  }

  async updateContingency(
    id: string,
    contingencyData: Contingency,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Contingency> {
    const contingencyToUpdate = await this.contingencyRepository.findOneOrFail({ where: { id } });

    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      contingencyToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const updates = Object.keys(contingencyData)
      .map((field) => {
        const oldFieldValue = contingencyToUpdate[field];
        const newFieldValue = contingencyData[field];
        if (oldFieldValue !== newFieldValue) {
          return {
            id: field,
            from: oldFieldValue,
            to: newFieldValue,
          };
        }
      })
      .filter((val) => val);

    const response = await this.contingencyRepository.save({
      ...contingencyData,
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
        code: EventCode.UPDATE_COMPANY_CONTINGENCY,
        data: { company: contingencyToUpdate.company, contingency: response, updates },
      });
    }
    const result: any = { ...contingencyToUpdate, ...contingencyData };
    return result;
  }

  async deleteContingency(id: string): Promise<DeleteResult> {
    return this.contingencyRepository.delete(id);
  }
}
