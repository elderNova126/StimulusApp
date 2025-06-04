import { ArgumentMetadata, Inject, Injectable } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { SupplierStatusMapping } from 'src/tenant-company-relationship/tenant-company-relationship.entity';
import { ValidationContext } from 'src/upload-report/upload-report.entity';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Injectable()
export class CompanyStreamService {
  private readonly companyRepository: Repository<Company>;

  private readonly validationPipe: ValidationPipe;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    private readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService,
    private readonly companyService: CompanyService
  ) {
    this.companyRepository = connection.getRepository(Company);
    this.logger.context = CompanyStreamService.name;
    this.validationPipe = new ValidationPipe(Company);
  }

  async createCompanyWithRelation(companyData): Promise<Company> {
    const { options, ...companyObj } = companyData;
    await this.validationPipe.transform(companyObj, {} as ArgumentMetadata);

    let company = await this.companyRepository.findOne({ taxIdNo: companyObj.taxIdNo });
    if (!company) {
      company = await this.companyRepository.save(companyObj);
    }
    company.internalId = companyObj.internalId;
    this.parseStringToNames(companyObj, company);
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantCompanyRelationService.saveTenantCompanyRelation(tenantId, company, options);
  }

  parseStringToNames(data: any, company: Company): void {
    const companyNames = [];
    const properties = {
      otherBusinessNames: 'OTHER',
      previousBusinessNames: 'PREVIOUS',
    };
    const keys = Object.keys(properties);
    for (const key of keys) {
      if (data[key]) {
        const names = data[key].split(',');
        for (const name of names) {
          if (name) {
            const companyNamesObj = {
              name,
              type: properties[key],
            };
            companyNames.push(companyNamesObj);
          }
        }
      }
    }
    company.names = companyNames;
  }

  async createCompanies(companyData: Company[]): Promise<any> {
    const errors = [];
    const filteredCompanyData = [];
    const tenantId = this.reqContextResolutionService.getTenantId();
    for (const company of companyData) {
      const validationErrors = await this.validationPipe.transformAndReturn(company, {} as ArgumentMetadata);
      if (validationErrors.length > 0) {
        const validationContexts = [];
        const properties = [];
        for (const err of validationErrors) {
          const validationContext: ValidationContext = {
            target: err.target,
            property: err.property,
            value: err.value,
            children: err.children,
            errorCode: err.contexts ? Object.values(err.contexts)[0].errorCode : 0,
            message: err.contexts ? Object.values(err.contexts)[0].message : '',
          };
          properties.push(validationContext.property);
          this.logger.debug(`Failed to create company with error: ${err.toString()}`);
          validationContexts.push(validationContext);
        }
        errors.push({ id: company.internalId, context: validationContexts, properties: properties.join() });
      } else {
        company.tenantCompanyRelationships = [
          {
            status: SupplierStatusMapping[company.options?.supplierStatus ?? 0],
            type: SupplierStatusMapping[company.options?.supplierType ?? 0],
            internalId: company.internalId,
            parentCompanyInternalId: company.parentCompanyInternalId ?? null,
            tenant: {
              id: tenantId,
            },
          },
        ] as any;
        this.parseStringToNames(company, company);

        filteredCompanyData.push(company);
      }
    }

    const companyIds: any = await this.companyRepository.save(filteredCompanyData).catch(async (error) => {
      const results = [];
      this.logger.log(`Failed to add companies using the bulk insert method. Move to for each approach. ${error}`);
      for (const company of filteredCompanyData) {
        const result = await this.createCompanyWithRelation(company).catch((err) => {
          this.logger.error(`Failed to create company with error ${err}`);
          errors.push({ id: company.internalId, context: err });
          return null;
        });
        if (!result) {
          errors.push(company.internalId);
        } else {
          results.push(result?.company?.id);
        }
      }
      if (errors.length) this.logger.error(`Failed to insert ${errors.length}/${companyData.length} companies`);

      return results;
    });

    return { companyIds, errors };
  }

  async createCompany(companyData: Company): Promise<Company> {
    await this.validationPipe.transform(companyData, {} as ArgumentMetadata);
    return this.companyRepository.save(companyData);
  }

  async updateCompanyUsingInternalId(internalId: string, companyData: Company): Promise<Company> {
    const validationErrors = await this.validationPipe.transformAndReturn(companyData, {} as ArgumentMetadata);
    if (validationErrors.length > 0) {
      const validationContexts = [];
      const properties = [];
      for (const err of validationErrors) {
        const validationContext: ValidationContext = {
          target: err.target,
          property: err.property,
          value: err.value,
          children: err.children,
          errorCode: err.contexts ? Object.values(err.contexts)[0].errorCode : 0,
          message: err.contexts ? Object.values(err.contexts)[0].message : '',
        };
        properties.push(validationContext.property);
        this.logger.debug(`Failed to create company with error: ${err.toString()}`);
        validationContexts.push(validationContext);
      }
      // eslint-disable-next-line no-throw-literal
      throw { id: internalId, context: validationContexts, properties: properties.join() };
    }
    const tenantCompanyRelation = await this.tenantCompanyRelationService.getTCRFromTenantContext(internalId);
    await this.companyRepository.update({ id: tenantCompanyRelation.company.id }, companyData);
    return this.companyRepository.findOne(tenantCompanyRelation.company.id);
  }

  async deleteCompany(id: number): Promise<DeleteResult> {
    return this.companyRepository.delete(id);
  }

  async deleteCompanyUsingInternalId(internalId: string): Promise<DeleteResult> {
    const tenantCompanyRelation = await this.tenantCompanyRelationService.getTCRFromTenantContext(internalId);
    if (!tenantCompanyRelation) {
      return;
    }
    return this.companyService.deleteCompany(tenantCompanyRelation.company.id);
  }
  async deleteCompanyUsingInternalIds(internalIds: string[]): Promise<DeleteResult> {
    const tenantCompanyRelation =
      await this.tenantCompanyRelationService.getTCRFromTenantContextByCompanies(internalIds);

    if (!tenantCompanyRelation) {
      return;
    }

    return this.companyService.deleteBulkCompany(tenantCompanyRelation.map((tcr) => tcr.company.id));
  }
}
