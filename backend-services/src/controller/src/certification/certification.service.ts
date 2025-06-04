import { Inject, Injectable, Scope } from '@nestjs/common';
import moment from 'moment';
import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Certification } from './certification.entity';

@Injectable({ scope: Scope.REQUEST })
export class CertificationService {
  private readonly certificationRepository: Repository<Certification>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly companyRepository: Repository<Company>;

  readonly searchFields = ['name', 'type'];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {
    this.certificationRepository = connection.getRepository(Certification);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
  }

  async getCertifications(filters: Certification, searchQuery: string) {
    let certificationFilters: any = filters;

    if (searchQuery) {
      certificationFilters = this.searchFields.map((item) => {
        return { ...filters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.certificationRepository.findAndCount({
      relations: ['company'],
      where: certificationFilters,
    });
  }

  async createCertification(
    certificationData: Certification,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ) {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: certificationData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const response = await this.certificationRepository.save({
      ...certificationData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });
    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_CERTIFICATION,
      data: { company: certificationData.company, certification: response },
    });

    return response;
  }

  async updateCertification(
    id: string,
    certificationData: Certification,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ) {
    const certificationToUpdate = await this.certificationRepository.findOneOrFail({ where: { id } });

    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      certificationToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const { certificationDate, expirationDate, ...restOfFields } = certificationData;
    const updates = Object.keys(restOfFields)
      .map((field) => {
        const oldFieldValue = certificationToUpdate[field];
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

    const checkCertificationDate = (certificationDate as Date | string) === '' ? null : certificationDate;
    const checkExpirationDate = (expirationDate as Date | string) === '' ? null : expirationDate;

    if (
      checkCertificationDate === null ||
      moment(certificationDate).diff(moment(certificationToUpdate.certificationDate), 'days') !== 0
    ) {
      updates.push({
        id: 'certificationDate',
        from: certificationToUpdate.certificationDate,
        to: checkCertificationDate,
      });
    }
    if (
      checkExpirationDate === null ||
      moment(expirationDate).diff(moment(certificationToUpdate.expirationDate), 'days') !== 0
    ) {
      updates.push({
        id: 'expirationDate',
        from: certificationToUpdate.expirationDate,
        to: checkExpirationDate,
      });
    }

    certificationData.certificationDate = checkCertificationDate;
    certificationData.expirationDate = checkExpirationDate;

    const response = await this.certificationRepository.save({
      ...certificationData,
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
        code: EventCode.UPDATE_COMPANY_CERTIFICATION,
        data: { company: certificationToUpdate.company, certification: response, updates },
      });
    }
    const result: any = { ...certificationToUpdate, ...certificationData };
    return result;
  }

  async deleteCertification(id: number): Promise<DeleteResult> {
    return this.certificationRepository.delete(id);
  }
}
