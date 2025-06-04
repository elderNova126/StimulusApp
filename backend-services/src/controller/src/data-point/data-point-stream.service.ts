import { Inject, Injectable, Scope } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { CompanyNameType } from 'src/company-names/company-names.entity';
import { CompanyNamesService } from 'src/company-names/company-names.service';
import { DiverseOwnershipService } from 'src/diverse-ownership/diverse-ownership.service';
import { Industry } from 'src/industry/industry.entity';
import { IndustryService } from 'src/industry/industry.service';
import { MinorityOwnershipDetailService } from 'src/minority-ownershipDetail/minority-ownershipDetail.service';
import { DataTraceMetaService } from 'src/shared/data-trace-meta/data-trace-meta.service';
import { TagService } from 'src/tag/tag.service';
import { TenantCompanyRelationship } from 'src/tenant-company-relationship/tenant-company-relationship.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Company } from '../company/company.entity';
import { DataTraceSource } from '../core/datatrace.types';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { DataPoint } from './data-point.entity';

@Injectable({ scope: Scope.REQUEST })
export class DataPointStreamService {
  private readonly dataPointRepository: Repository<DataPoint>;
  private readonly companyRepository: Repository<Company>;
  private readonly tenantCompanyRelationshipRepository: Repository<TenantCompanyRelationship>;
  private readonly industryRepository: Repository<Industry>;
  readonly searchFields = [];
  private readonly othersBusinessNamesProperty = 'othersBusinessNames';
  private readonly previousBusinessNamesProperty = 'previousBusinessNames';
  private readonly industryClassificationCodeProperty = 'industryClassificationCode';
  private readonly industryProperty = 'industry';
  private readonly internalNameProperty = 'internalName';
  private readonly tags = 'tags';
  private readonly diverseOwnership = 'diverseOwnership';
  private readonly minorityOwnershipDetail = 'minorityOwnershipDetail';

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService,
    private industryService: IndustryService,
    private tagService: TagService,
    private diverseOwnershipService: DiverseOwnershipService,
    private minorityOwnershipDetailService: MinorityOwnershipDetailService,
    private readonly dataTraceMetaService: DataTraceMetaService,
    private readonly companyNamesService: CompanyNamesService
  ) {
    this.dataPointRepository = connection.getRepository(DataPoint);
    this.companyRepository = connection.getRepository(Company);
    this.industryRepository = connection.getRepository(Industry);
    this.tenantCompanyRelationshipRepository = connection.getRepository(TenantCompanyRelationship);
    this.logger.context = DataPointStreamService.name;
  }

  async updateCompanyProperty(tenantCompany: TenantCompanyRelationship, propertyName, propertyValue) {
    const company: Partial<Company> = new Company();

    company.id = tenantCompany.company.id;

    const columns = this.companyRepository.metadata.ownColumns.map((column) => {
      return { column: column.propertyName, type: column.type };
    });

    if (propertyName === this.industryClassificationCodeProperty) {
      try {
        await this.addCompanyIndustryRelationship(propertyValue, tenantCompany);
      } catch {
        this.logger.log(`Failed to add the company-industry relationship ${propertyValue}`);
      }
      return null;
    }

    if (propertyName === this.industryProperty) {
      try {
        await this.addCustomIndustry(propertyValue, tenantCompany);
      } catch {
        this.logger.log(`Failed to add the company custom industry ${propertyValue}`);
      }
      return null;
    }

    if (propertyName === this.othersBusinessNamesProperty) {
      this.companyNamesService.UpdateNames(tenantCompany.company.id, CompanyNameType.OTHER, propertyValue);
    }
    if (propertyName === this.previousBusinessNamesProperty) {
      this.companyNamesService.UpdateNames(tenantCompany.company.id, CompanyNameType.PREVIOUS, propertyValue);
    }

    if (propertyName === this.internalNameProperty) {
      try {
        await this.addCompanyInternalName(propertyValue, tenantCompany);
      } catch {
        this.logger.log(`Failed to add company internal Name ${propertyValue}`);
      }
      return null;
    }

    if (propertyName === this.tags) {
      try {
        const tags = await this.tagService.updateTags(propertyValue.split(','));
        company[this.tags] = tags;
        return company;
      } catch {
        this.logger.log(`Failed to add tags ${propertyValue}`);
      }
      return null;
    }

    if (propertyName === this.diverseOwnership) {
      try {
        const diverseOwnerships = await this.diverseOwnershipService.findBydiverseOwnership(propertyValue.split(','));
        company.diverseOwnership = diverseOwnerships;
        return company;
      } catch {
        this.logger.log(`Failed to add diverseOwnership ${propertyValue}`);
      }
      return null;
    }

    if (propertyName === this.minorityOwnershipDetail) {
      try {
        const minorityOwnershipDetails = await this.minorityOwnershipDetailService.findBydiverseOwnership(
          propertyValue.split(',')
        );
        company.minorityOwnershipDetail = minorityOwnershipDetails;
        return company;
      } catch {
        this.logger.log(`Failed to add minorityOwnershipDetails ${propertyValue}`);
      }
      return null;
    }

    const column = columns.find((el) => el.column === propertyName);
    if (!column) return null;

    switch (column.type) {
      case 'decimal':
        company[propertyName] = Number(propertyValue);
        break;
      case 'float':
        company[propertyName] = parseFloat(propertyValue);
        break;
      case 'bit':
        company[propertyName] = propertyValue === 'true';
        break;
      default:
        company[propertyName] = propertyValue;
        break;
    }

    return company;
  }

  private async addCompanyIndustryRelationship(propertyValue, tenantCompany: TenantCompanyRelationship) {
    const industry = new Industry();
    industry.code = propertyValue;

    const industries = await this.industryService.getIndustries(industry, null);
    if (industries.count === 0) return null;

    const company = tenantCompany.company;

    if (isNil(company.industries)) {
      company.industries = [];
    }
    const companyIndustryIndex = company.industries.findIndex((x) => x.id === industries.results[0].id);

    if (companyIndustryIndex >= 0) {
      return null;
    }

    return this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'industries')
      .of(company)
      .add(industries.results[0].id);
  }

  private async addCustomIndustry(propertyValue, tenantCompany: TenantCompanyRelationship) {
    const industry = new Industry();
    industry.title = propertyValue;

    await this.industryRepository.save(industry);

    const company = tenantCompany.company;

    return this.companyRepository.createQueryBuilder().relation(Company, 'industries').of(company).add(industry.id);
  }

  private async addCompanyInternalName(propertyValue, tenantCompany: TenantCompanyRelationship) {
    const property = {};
    property[this.internalNameProperty] = propertyValue;

    return this.tenantCompanyRelationshipRepository
      .createQueryBuilder()
      .update()
      .set(property)
      .where('id = :id', { id: tenantCompany.id })
      .execute();
  }

  async createDataPoints(dataPointsData: any): Promise<any> {
    const pointsArray = [];
    const errors = [];
    const companiesUpdated = [];
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();

    const internalIds = dataPointsData.map((x) => x.company.internalId);

    const tcrs = await this.tenantCompanyRelationService.getTCRsFromTenantContext(internalIds);

    const dataPoints = dataPointsData as unknown as DataPoint[];

    for (const dataPoint of dataPoints) {
      const i = dataPoints.indexOf(dataPoint);
      const internalId = dataPoint.company.internalId;
      const tenantCompany = tcrs.find((x) => x.internalId === internalId);

      if (tenantCompany) {
        const dataTrace = dataPointsData[i];
        this.dataTraceMetaService.addDataTraceMeta({
          data: dataPoint,
          tenantCompany,
          internalId,
          tenantId,
          userId,
          dataTrace,
        });

        const companyUpdated = await this.updateCompanyProperty(tenantCompany, dataPoint.element, dataPoint.dataValue);

        if (companyUpdated) {
          companiesUpdated.push(companyUpdated);
        }
        pointsArray.push(dataPoint);
      }
    }

    try {
      await this.companyRepository.save(companiesUpdated);

      await this.dataPointRepository.createQueryBuilder().insert().into(DataPoint).values(pointsArray).execute();
    } catch (error) {
      this.logger.log('Failed to add dataPoints using the bulk insert method. Move to for each approach.');
      this.logger.debug(`Error is : ${error}`);
      await Promise.all(
        dataPointsData.map((dataPoint) => {
          return this.createDataPointWithCompany(dataPoint).catch((err) => {
            this.logger.error(`Failed to create dataPoint with error ${err}`);
            if (dataPoint.internalId) errors.push(dataPoint.internalId);
            return undefined;
          });
        })
      ).then((result) => {
        const errors = result.filter((element) => element === undefined).length;
        this.logger.error(`Failed to insert ${errors}/${dataPointsData.length} dataPoints`);
      });
    }

    return { errors };
  }

  async createDataPointWithCompany(dataPointData: any) {
    const internalId = dataPointData.company.internalId;
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(internalId);
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();

    const dataPoint = dataPointData as unknown as DataPoint;

    dataPoint.company = tenantCompany.company;
    dataPoint.company.internalId = internalId;
    dataPoint.dataTraceSource = DataTraceSource.INGESTION;
    dataPoint.dataTraceMeta.method = 'INGESTION';
    dataPoint.dataTraceMeta.tenantId = tenantId;
    dataPoint.dataTraceMeta.userId = userId;
    const sourceMeta = dataPoint.dataTraceMeta.source ?? Object();

    sourceMeta.date = dataPointData.sourceDate ?? null;
    sourceMeta.name = dataPointData.sourceName ?? null;
    sourceMeta.type = dataPointData.sourceType ?? null;
    dataPoint.dataTraceMeta.source = sourceMeta ?? null;
    const company = await this.updateCompanyProperty(tenantCompany, dataPointData.element, dataPointData.dataValue);
    if (company) {
      await this.companyRepository.save(company);
    }
    return this.dataPointRepository.save(dataPointData);
  }

  async updateDataPointUsingInternalId(internalId: string, dataPointData: DataPoint): Promise<UpdateResult> {
    return this.dataPointRepository.update({ internalId }, dataPointData);
  }

  async deleteDataPointUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.dataPointRepository.delete({ internalId });
  }
}
