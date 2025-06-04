import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Contact } from './contact.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { DataTraceMetaService } from 'src/shared/data-trace-meta/data-trace-meta.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';

@Injectable({ scope: Scope.REQUEST })
export class ContactStreamService {
  private readonly contactRepository: Repository<Contact>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly dataTraceMetaService: DataTraceMetaService
  ) {
    this.contactRepository = connection.getRepository(Contact);
  }

  async createContacts(contactsData: Contact[]): Promise<any> {
    const errors = [];
    const pointsArray = [];
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();
    const internalIds = contactsData.map((x) => x.company.internalId);
    const tcrs = await this.tenantCompanyRelationService.getTCRsFromTenantContext(internalIds);
    const contacts = contactsData as unknown as Contact[];

    for (const contact of contacts) {
      const i = contacts.indexOf(contact);
      const internalId = contact.company.internalId;
      const tenantCompany = tcrs.find((x) => x.internalId === contact.company.internalId);

      if (tenantCompany) {
        const dataTrace = contactsData[i];
        this.dataTraceMetaService.addDataTraceMeta({
          data: contact,
          tenantCompany,
          internalId,
          tenantId,
          userId,
          dataTrace,
        });
        contact.company = tenantCompany.company;
        pointsArray.push(contact);
      } else errors.push(contact.company.internalId);
    }

    await this.contactRepository
      .createQueryBuilder()
      .insert()
      .into(Contact)
      .values(pointsArray)
      .execute()
      .catch(async (_error) => {
        this.logger.log('Failed to add contacts using the bulk insert method. Move to for each approach.');
        await Promise.all(
          contactsData.map((contact) => {
            return this.createContactWithCompany(contact).catch((err) => {
              this.logger.error(`Failed to create contact with error ${err}`);
              errors.push(contact.internalId);
              return undefined;
            });
          })
        ).then((result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${contactsData.length} contacts`);
        });
      });
    return { errors };
  }

  async createContactWithCompany(contactData: Contact) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      contactData.company.internalId
    );
    contactData.company = tenantCompany.company;
    return this.contactRepository.save(contactData);
  }

  async updateContactUsingInternalId(internalId: string, contactData: Contact): Promise<UpdateResult> {
    return this.contactRepository.update({ internalId }, contactData);
  }

  async deleteContactUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.contactRepository.delete({ internalId });
  }
}
