import { Inject, Injectable, Scope } from '@nestjs/common';
import moment from 'moment';
import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import { EventCode } from 'src/event/event-code.enum';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { InternalEventService } from '../event/internal-event.service';
import { Score } from '../stimulus-score/stimulus-score.entity';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Insurance } from './insurance.entity';

@Injectable({ scope: Scope.REQUEST })
export class InsuranceService {
  private readonly insuranceRepository: Repository<Insurance>;
  private readonly companyRepository: Repository<Company>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  readonly searchFields = ['name', 'type'];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {
    this.companyRepository = connection.getRepository(Company);
    this.insuranceRepository = connection.getRepository(Insurance);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
  }

  getInsurances(filters: Score, searchQuery: string) {
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.insuranceRepository.findAndCount({
      relations: ['company'],
      where: queryFilters,
    });
  }

  async createInsurance(
    insuranceData: Insurance,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Insurance> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: insuranceData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const response = await this.insuranceRepository.save({
      ...insuranceData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });
    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_INSURANCE,
      data: { company: insuranceData.company, insurance: response },
    });

    return response;
  }

  async updateInsurance(
    id: string,
    insuranceData: Insurance,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Insurance> {
    const insuranceToUpdate = await this.insuranceRepository.findOneOrFail({ where: { id } });
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      insuranceToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const { coverageEnd, coverageStart, ...restOfFields } = insuranceData;
    const updates = Object.keys(restOfFields)
      .map((field) => {
        const oldFieldValue = insuranceToUpdate[field];
        const newFieldValue = restOfFields[field];
        if (oldFieldValue !== newFieldValue) {
          return {
            id: field,
            from: oldFieldValue,
            to: newFieldValue,
          };
        }
      })
      .filter((val) => val);

    if (coverageStart && moment(coverageStart).diff(moment(insuranceToUpdate.coverageStart), 'days') !== 0) {
      updates.push({
        id: 'coverageStart',
        from: insuranceToUpdate.coverageStart,
        to: coverageStart,
      });
    }
    if (coverageEnd && moment(coverageEnd).diff(moment(insuranceToUpdate.coverageEnd), 'days') !== 0) {
      updates.push({
        id: 'coverageEnd',
        from: insuranceToUpdate.coverageEnd,
        to: coverageEnd,
      });
    }

    const response = await this.insuranceRepository.save({
      ...insuranceData,
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
        code: EventCode.UPDATE_COMPANY_INSURANCE,
        data: { company: insuranceToUpdate.company, insurance: response, updates },
      });
    }
    const result: any = { ...insuranceToUpdate, ...insuranceData };
    return result;
  }

  async deleteInsurance(id: string): Promise<DeleteResult> {
    return this.insuranceRepository.delete(id);
  }
}
