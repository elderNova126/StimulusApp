import { Inject, Injectable, Scope } from '@nestjs/common';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Contact } from './contact.entity';

@Injectable({ scope: Scope.REQUEST })
export class ContactService {
  private readonly contactRepository: Repository<Contact>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly companyRepository: Repository<Company>;

  readonly searchFields = [
    'title',
    'firstName',
    'middleName',
    'lastName',
    'department',
    'jobTitle',
    'addrestStreet',
    'email',
    'manager',
  ];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService,
    private cacheRedisService: CacheRedisService
  ) {
    this.contactRepository = connection.getRepository(Contact);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
  }

  async getContacts(filters: Contact, searchQuery: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...filters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    const publicContactsCondition = { ...queryFilters, type: 'public' };
    const privateContactsCondition = { ...queryFilters, type: 'private', tenantId };

    const contactControllerFound = await this.contactRepository.findAndCount({
      relations: ['company'],
      where: [publicContactsCondition, privateContactsCondition],
    });
    return contactControllerFound;
  }

  async createContact(
    contactData: Contact,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Contact> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: contactData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const response = await this.contactRepository.save({
      ...contactData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });
    await this.updateContactCacheRedis(response.company.id, response);
    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_CONTACT,
      data: { company: contactData.company, contact: response },
    });

    return response;
  }

  async updateContact(
    id: string,
    contactData: Contact,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Contact> {
    const contactToUpdate = await this.contactRepository.findOneOrFail({ where: { id } });

    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      contactToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const updates = Object.keys(contactData)
      .map((field) => {
        const oldFieldValue = contactToUpdate[field];
        const newFieldValue = contactData[field];
        if (oldFieldValue !== newFieldValue) {
          return {
            id: field,
            from: oldFieldValue,
            to: newFieldValue,
          };
        }
      })
      .filter((val) => val);

    const response = await this.contactRepository.save({
      ...contactToUpdate,
      ...contactData,
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
        code: EventCode.UPDATE_COMPANY_CONTACT,
        data: { company: contactToUpdate.company, contact: response, updates },
      });
    }
    return response;
  }

  async deleteContact(id: string): Promise<DeleteResult> {
    return this.contactRepository.delete(id);
  }

  async updateContactCacheRedis(companyId: string, contact: Contact) {
    let company;
    const tenantId = this.reqContextResolutionService.getTenantId();
    try {
      company = await this.companyRepository.findOne({ where: { id: companyId } });
    } catch (error) {
      console.log(error);
    }

    if (!company) throw new Error('Company not found');
    const companyIncache = await this.cacheRedisService.get(`company_${companyId}_${tenantId}`);

    if (companyIncache) {
      const companyContacts = JSON.parse(companyIncache).contacts;
      const contactIndex = companyContacts.findIndex((item: Contact) => item.id === contact.id);
      if (contactIndex !== -1) {
        companyContacts[contactIndex] = contact;
      } else {
        companyContacts.push(contact);
      }
      this.logger.debug(`Updating contact cache for company ${companyId}`);
      await this.cacheRedisService.set(
        `company_${companyId}`,
        JSON.stringify({ ...company, contacts: companyContacts }),
        90
      );
    }
  }
}
