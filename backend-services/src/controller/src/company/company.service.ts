import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  GeoComparison,
  Logical,
  QueryBuilder,
  QueryFilter,
  QueryType,
  SearchMode,
  SearchService,
} from 'azure-search-client';
import { Queue } from 'bull';
import { controller } from 'controller-proto/codegen/tenant_pb';
import * as R from 'ramda';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { CompanyListService } from 'src/company-list/company-list.service';
import { CompanyNamesService } from 'src/company-names/company-names.service';
import { CompanyNoteService } from 'src/company-note/company-note.service';
import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import { ConnectionProviderService } from 'src/database/connection-provider.service';
import { DiverseOwnershipService } from 'src/diverse-ownership/diverse-ownership.service';
import { DiverseOwnership } from 'src/diverse-ownership/DiverseOwnership.entity';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { EventCode } from 'src/event/event-code.enum';
import { Industry } from 'src/industry/industry.entity';
import { IndustryService } from 'src/industry/industry.service';
import { MinorityOwnershipDetailService } from 'src/minority-ownershipDetail/minority-ownershipDetail.service';
import { MinorityOwnershipDetail } from 'src/minority-ownershipDetail/minorityOwnershipDetail.entity';
import { ProjectService } from 'src/project/project.service';
import { ProjectCompany } from 'src/project/projectCompany.entity';
import { SharedList, SharedListStatus } from 'src/shared-list/shared-list.entity';
import { StimulusScoreService } from 'src/stimulus-score/stimulus-score.service';
import { Tag } from 'src/tag/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { Tenant } from 'src/tenant/tenant.entity';
import { TenantService } from 'src/tenant/tenant.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserService } from 'src/user/user.service';
import { getMonthName } from 'src/utils/date';
import { ExceptionMessages } from 'src/utils/Exceptions';
import { Connection, DeleteResult, In, Like, Repository } from 'typeorm';
import { DefaultTimesForCache } from '../cache-for-redis/cache-redis.constants';
import { CompanyList } from '../company-list/company-list.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { DataPoint } from '../data-point/data-point.entity';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { InternalEventService } from '../event/internal-event.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CompanyType, ProjectStatus } from '../project/project.constants';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import {
  GLOBAL_COMPANY_AGGREGATE_INDEX_NAME,
  GLOBAL_LOCATION_AGGREGATE_INDEX_NAME,
  GLOBAL_SEARCH_CLIENT,
  INDEXER_ON_DEMAND_JOB,
  SEARCH_QUEUE,
} from '../search/search.constants';
import { IOrder, IOrderDTO } from '../shared/order.interface';
import { IPaginationDTO } from '../shared/pagination.interface';
import {
  GrpcAlreadyExistException,
  GrpcCanceledException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from '../shared/utils-grpc/exception';
import {
  SupplierStatus,
  SupplierType,
  TenantCompanyRelationship,
} from '../tenant-company-relationship/tenant-company-relationship.entity';
import { defaultTCR } from '../tenant-company-relationship/tenant-company-relationship.constants';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { CompanyWithMinorityOwnerShip, PAST_TO_EMPTY } from './company.constants';
import { Company } from './company.entity';
import { CompanyNameType } from 'src/company-names/company-names.entity';
import { findState } from './company.utils';

@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  private readonly companyRepository: Repository<Company>;
  private readonly dataPointRepository: Repository<DataPoint>;
  private readonly industryRepository: Repository<Industry>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly tenantCompanyRelationshipRepository: Repository<TenantCompanyRelationship>;
  private readonly companyListRepository: Repository<CompanyList>;
  private readonly sharedListRepository: Repository<SharedList>;
  private readonly globalConnection: Connection;
  private readonly projectCompanyRepository: Repository<ProjectCompany>;
  readonly searchFields = ['legalBusinessName', 'doingBusinessAs'];
  private locationsColumns = ['addressStreet', 'postalCode', 'city', 'state'];
  private filtersToIgnore = [
    'companyType',
    'companyStatus',
    'location',
    'latitude',
    'longitude',
    'country',
    'postalCode',
    'state',
    'city',
    'addressStreet',
    'tenantId',
  ];
  private columnsToSearch = {
    description: ['description'],
    industry: ['industries/title_index'],
    tags: ['tags'],
    certifications: ['certifications/name'],
    insurance: ['insurances/name'],
    productsAndServices: ['products/name'],
    riskManagement: ['contingencies/name'],
    legalBusinessName: ['legalBusinessName'],
    title: [
      'legalBusinessName',
      'doingBusinessAs',
      'tcr/internalName',
      'otherBusinessNames',
      'previousBusinessNames',
      'parentCompany/legalBusinessName',
      'businessNames/name',
    ],
    taxIdNo: ['taxIdNo'],
    taxIdAndLegalName: ['taxIdNo', 'legalBusinessName'],
  };

  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    @Inject(GLOBAL_SEARCH_CLIENT)
    private readonly globalSearchClient: SearchService,
    @Inject(GLOBAL_COMPANY_AGGREGATE_INDEX_NAME)
    private readonly globalCompanyAggregateIndexName: string,
    @Inject(GLOBAL_LOCATION_AGGREGATE_INDEX_NAME)
    private readonly globalLocationAggregateIndexName: string,
    @Inject(TENANT_CONNECTION) tenantConnection,
    @InjectQueue(SEARCH_QUEUE) private searchQueue: Queue<StimulusJobData<any>>,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger,
    private eventService: InternalEventService,
    private industryService: IndustryService,
    private evaluationService: EvaluationService,
    private tenantCompanyRelationService: TenantCompanyRelationshipService,
    private cacheRedisService: CacheRedisService,
    private connectionProviderService: ConnectionProviderService,
    private userService: UserService,
    private diverseOwnershipService: DiverseOwnershipService,
    private minorityOwnershipDetailService: MinorityOwnershipDetailService,
    private tagService: TagService,
    private tenantService: TenantService,
    private companyNamesService: CompanyNamesService,
    private companyNoteService: CompanyNoteService,
    private projectService: ProjectService,
    private companyListService: CompanyListService,
    private userProfileService: UserProfileService
  ) {
    this.projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);
    this.companyRepository = connection.getRepository(Company);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.tenantCompanyRelationshipRepository = connection.getRepository(TenantCompanyRelationship);
    this.dataPointRepository = connection.getRepository(DataPoint);
    this.industryRepository = connection.getRepository(Industry);
    this.logger.context = CompanyService.name;
    this.companyListRepository = tenantConnection.getRepository(CompanyList);
    this.sharedListRepository = connection.getRepository(SharedList);
    this.globalConnection = connection;
  }

  idNameSelectorByAzureIndex(indexName: string) {
    const indexs = {
      [this.globalCompanyAggregateIndexName]: 'id',
      [this.globalLocationAggregateIndexName]: 'companyId',
    };
    return indexs[indexName] || 'id';
  }

  async getCompany(id: number) {
    const count = 1;
    const tenantId = this.reqContextResolutionService.getTenantId();
    const companyFromCache = await this.cacheRedisService.get(`company_${id}_${tenantId}`);
    let company: any = null;
    if (companyFromCache) {
      company = JSON.parse(companyFromCache);
    } else {
      const query = this.globalConnection
        .createQueryBuilder(Company, 'company')
        .loadAllRelationIds({ relations: ['parentCompany'] })
        .leftJoinAndSelect('company.names', 'company.names')
        .orderBy('company.names.created', 'DESC')
        .leftJoinAndMapOne(
          'company.tenantCompanyRelation',
          TenantCompanyRelationship,
          `tenant_company_relationships`,
          'company.id="tenant_company_relationships"."companyId" AND "tenant_company_relationships"."tenantId" = :tenantId',
          { tenantId }
        )
        .leftJoinAndSelect('company.industries', 'industries')
        .leftJoinAndSelect('company.tags', 'tags')
        .andWhere('company.id=:id', { id });
      try {
        company = await query.getOne();
      } catch (error) {
        throw new GrpcNotFoundException(ExceptionMessages.COMPANY_NOT_FOUND);
      }
    }
    if (!company) throw new GrpcNotFoundException(ExceptionMessages.COMPANY_NOT_FOUND);

    company.evaluations = await this.evaluationService.getCompanyEvaluations(company.id);
    company.industries = await this.industryService.getCompanyIndustriesByTenant(
      company.industries.map((i: Industry) => i.id)
    );
    defaultTCR.companyId = company.id;
    defaultTCR.tenantId = tenantId;

    if (!company.tenantCompanyRelation) company.tenantCompanyRelation = defaultTCR;

    // join diverse ownership
    const { values: diverseOwnership } = await this.diverseOwnershipService.getDiverseOwnershipByCompanyId(company.id);
    // join minority ownership
    const { values: minorityOwnership } = await this.minorityOwnershipDetailService.getMinorityOwnershipByCompanyId(
      company.id
    );

    // concat the arrays separated by comma
    company.diverseOwnership = diverseOwnership.map((item) => item.diverseOwnership);
    company.minorityOwnership = minorityOwnership.map((item) => item.minorityOwnershipDetail);
    this.cacheRedisService.set(
      `company_${id}_${tenantId}`,
      JSON.stringify(company),
      DefaultTimesForCache.FORTY_SECONDS
    );

    return { results: [company], count };
  }

  async searchCompaniesByTaxId(query: string) {
    const sqlQuery = this.companyRepository.createQueryBuilder('company').select();
    sqlQuery.addSelect('taxIdNo');
    sqlQuery.where({ taxIdNo: Like(`%${query}%`) });
    sqlQuery.orderBy('taxIdNo', 'ASC');
    sqlQuery.limit(50);

    const results = await sqlQuery.getMany();
    return results;
  }

  async searchCompaniesSubset(query: string) {
    const sqlQuery = this.companyRepository.createQueryBuilder('company').select();

    this.searchFields.forEach((element) => {
      sqlQuery.addSelect(element);
    });

    sqlQuery.where(
      this.searchFields.map((item) => {
        return { [item]: Like(`%${query}%`) };
      })
    );

    return sqlQuery.getMany();
  }

  async getCompanies(
    filters: Company = {} as Company,
    pagination: IPaginationDTO = {} as IPaginationDTO,
    order: IOrderDTO = {} as IOrderDTO,
    options?: { idIn?: string[] }
  ) {
    const { limit = 10, page = 1 } = pagination;
    const { key = 'company.updated', direction = 'ASC' } = order;
    // eslint-isable-next-line prefer-const
    const { tenantCompanyRelation = {}, ...params }: any = filters;
    const queryParams = params;

    // ordering params
    const orderParams: IOrder = {
      [key]: direction,
    };
    const tenantId = this.reqContextResolutionService.getTenantId();
    try {
      const query = this.globalConnection.manager
        .createQueryBuilder(Company, 'company')
        .loadAllRelationIds({ relations: ['parentCompany'] })
        .leftJoinAndSelect('company.names', 'company.names')
        .leftJoinAndMapOne(
          'company.tenantCompanyRelation',
          TenantCompanyRelationship,
          `tenant_company_relationships`,
          'company.id="tenant_company_relationships"."companyId" AND "tenant_company_relationships"."tenantId" = :tenantId',
          { tenantId }
        )
        .leftJoinAndSelect('company.industries', 'industries')
        .orderBy(orderParams);

      if (limit > 0) {
        query.limit(limit).offset(limit * (page - 1));
      }

      if (options?.idIn?.length > 0) {
        query.andWhere('company.id IN (:...companyIds)', { companyIds: options.idIn });
      }
      const settingsToApply = Object.keys(tenantCompanyRelation);
      if (settingsToApply.length) {
        for (const setting of settingsToApply) {
          query.andWhere(`tenant_company_relationships.${setting}=${tenantCompanyRelation[setting] ? 1 : 0}`);
        }
      }
      if (Object.keys(queryParams).length) {
        query.andWhere(queryParams);
      }

      const [results, count] = await query.getManyAndCount();

      defaultTCR.tenantId = tenantId;
      const companies = results.map((company) => {
        defaultTCR.companyId = company.id;
        return {
          ...company,
          tenantCompanyRelation: company.tenantCompanyRelation ? company.tenantCompanyRelation : defaultTCR,
        };
      });

      return [companies, count];
    } catch (error) {
      console.log(error);
      throw new GrpcCanceledException(`Failed to search company error ${error}`);
    }
  }

  async createCompany(companyData: Company): Promise<Company> {
    try {
      if ((await this.checkName(companyData?.legalBusinessName)) === false) {
        const newCompany = await this.companyRepository.save(companyData);

        const relatedCompanies = await this.companyRepository.find({
          where: { parentCompanyTaxId: newCompany.taxIdNo },
        });

        if (relatedCompanies) {
          await this.addCompaniesParentRelation(relatedCompanies, newCompany);
        }

        await this.eventService.dispatchInternalEvent({
          code: EventCode.CREATE_COMPANY,
          data: { company: newCompany },
        });

        if ((await this.searchQueue.getWaitingCount()) < 1) await this.searchQueue.add(INDEXER_ON_DEMAND_JOB, {}, {});
        return newCompany;
      } else {
        throw new GrpcInvalidArgumentException(`There is a company already named`);
      }
    } catch (error) {
      if (error?.error === 'There is a company already named') {
        throw new GrpcAlreadyExistException(ExceptionMessages.LEGALNAME_ALREADY_EXISTS(companyData?.legalBusinessName));
      } else {
        throw new GrpcAlreadyExistException(ExceptionMessages.TAXID_ALREADY_EXISTS);
      }
    }
  }

  private addCompaniesParentRelation = async (companies: Company[], parent: Company) => {
    const updatePromises = companies?.map(async (relatedCompany) => {
      relatedCompany.parentCompany = parent;
      await this.companyRepository.save(relatedCompany);
    });

    return await Promise.all(updatePromises);
  };

  private checkName = async (name: string) => {
    const response = await this.companyRepository.find({
      where: { legalBusinessName: name },
    });

    return response?.length >= 1;
  };
  async updateCompany(
    id: string,
    companyData: Company,
    options: {
      industriesPayload?: { industryIds: string[]; newCustomIndustries: string[] };
      dataTraceSource: DataTraceSource;
      meta: DataTraceMeta;
    }
  ): Promise<Company> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
      industriesPayload,
    } = options;
    const updateCompanyIndustries =
      (industriesPayload?.industryIds?.length ?? industriesPayload?.newCustomIndustries?.length) ||
      (typeof industriesPayload === 'object' && 0);
    const company = await this.companyRepository.findOneOrFail({
      where: { id },
      relations: ['industries', 'names'],
    });
    const tenantId = this.reqContextResolutionService.getTenantId();
    const { ...resOfCompanyData } = companyData;
    const companyToUpdate = { ...resOfCompanyData };
    const elementsToUpdate = Object.keys(companyToUpdate);
    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein === company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const dataPoints = await Promise.all(
      elementsToUpdate.map((element: string) => {
        return this.dataPointRepository.findOne({ company, dataTraceSource, element });
      })
    );

    const dataPointsToSave = dataPoints.map((dataPoint, index) => ({
      ...(dataPoint && { id: dataPoint.id }),
      company,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
      dataValue: companyToUpdate[elementsToUpdate[index]]?.toString() ?? null,
      element: elementsToUpdate[index],
    }));
    await this.dataPointRepository.save(dataPointsToSave);

    const { ...oldFields } = company;
    const { parentCompany, ...rest }: any = companyToUpdate;
    const { updates, updateToMetaData } = this.handleCompanyPropertyNames({
      columns: elementsToUpdate,
      values: companyToUpdate,
      targetCompany: company,
    });
    let industries = [];
    let tags = null;
    let diverseOwnershipToSaved = null;
    let minorityOwnedToSaved = null;

    // update diverseOwnership
    if (updates.find((update) => update.id === 'diverseOwnership')) {
      const diverseOwnershipUpdates = updates.find((update) => update.id === 'diverseOwnership');
      const newData = diverseOwnershipUpdates.to;
      diverseOwnershipToSaved = this.handleOwnershipArrays(
        newData,
        await this.diverseOwnershipService.findBydiverseOwnership(newData)
      );
    }

    // update minorityOwnedShip
    if (updates.find((update) => update.id === 'minorityOwnership')) {
      const minorityOwnedShipUpdates = updates.find((update) => update.id === 'minorityOwnership');
      const newData = minorityOwnedShipUpdates.to;
      minorityOwnedToSaved = this.handleOwnershipArrays(
        newData,
        await this.minorityOwnershipDetailService.findBydiverseOwnership(newData)
      );
    }

    // validate internalId
    if (updates.find((update) => update.id === 'internalId')) {
      const internalIdUpdates = updates.find((update) => update.id === 'internalId');
      const internalId = internalIdUpdates.to;
      if (internalId.length > 0) {
        const internalIdExists = await this.tenantCompanyRelationService.getTCRByInternalId(internalId);
        if (internalIdExists) {
          throw new GrpcAlreadyExistException(ExceptionMessages.INTERNALID_ALREADY_EXISTS);
        }
      }
    }

    // other names
    const newtherBusinessNames = updates.find((update) => update.id === 'otherBusinessNames');
    if (newtherBusinessNames)
      await this.companyNamesService.UpdateNames(company.id, CompanyNameType.OTHER, newtherBusinessNames?.to);

    // previous names
    const newPreviousBusinessNames = updates.find((update) => update.id === 'previousBusinessNames');
    if (newPreviousBusinessNames)
      await this.companyNamesService.UpdateNames(company.id, CompanyNameType.PREVIOUS, newPreviousBusinessNames?.to);

    if (updateCompanyIndustries || updateCompanyIndustries === 0) {
      const newIndustries = await Promise.all(
        (industriesPayload?.industryIds ?? [])
          .filter((id) => !company.industries.find((industry) => industry.id === id))
          .map((id) => this.industryRepository.findOneOrFail({ id }))
      );
      const newCustomIndustries = await Promise.all(
        (industriesPayload?.newCustomIndustries ?? []).map((title: string) => this.industryRepository.save({ title }))
      );

      industries = company.industries
        .filter((industry) => industriesPayload.industryIds?.indexOf(industry?.id) > -1)
        .concat(newIndustries)
        .concat(newCustomIndustries);
    } else {
      industries = company.industries;
    }

    const CompanyUpdates = {
      ...oldFields,
      ...rest,
      ...(!!parentCompany ? { parentCompany: await this.handleParentTaxId(parentCompany) } : { parentCompany: null }),
      ...{ industries },
      id,
      updated: new Date(),
    };

    for (const key in CompanyUpdates) {
      if (
        CompanyUpdates[key] === '' ||
        CompanyUpdates[key] === 0 ||
        (CompanyUpdates[key]?.[0] === '' && CompanyUpdates[key]?.length === 1)
      ) {
        CompanyUpdates[key] = null;
      }
    }

    const tagsUpdates = updates.find((update) => update.id === 'tags');
    if (tagsUpdates) {
      tagsUpdates.to = tagsUpdates.to.filter((tag: Tag, index: number, self: Tag[]) => {
        return index === self.findIndex((t) => t.tag === tag.tag);
      });
      const tagsNames = tagsUpdates.to.map((tag: Tag) => tag.tag);
      await this.tagService.updateTags(tagsNames);
      const newTags = await this.tagService.getTagsByTagsName(tagsNames);
      tags = [...newTags];
      tagsUpdates.from = tagsUpdates.from ? tagsUpdates.from.map((item) => item.tag).join(',') : '';
      tagsUpdates.to = tagsNames.map((tag) => tag).join(',');
    }

    if (diverseOwnershipToSaved) CompanyUpdates.diverseOwnership = diverseOwnershipToSaved;
    if (minorityOwnedToSaved) CompanyUpdates.minorityOwnershipDetail = minorityOwnedToSaved;
    if (tags) CompanyUpdates.tags = tags;

    const response = (await this.companyRepository.save(CompanyUpdates)) as any;
    response.parentCompany = response.parentCompany ? response.parentCompany.id : null;
    response.names = await this.companyNamesService.getCompanyNames(response.id);
    response.tags = await this.tagService.getTagsObjsByCompanyId(response.id);

    const newIndustriesCustomInTenant = response.industries;
    await this.industryService.joinCurrentTenantWithIndustry(newIndustriesCustomInTenant, tenantId);

    // relationships
    const relationshipChanges = this.parseRelationShipChanges(companyToUpdate);
    let relationshipCompany = await this.tenantCompanyRelationService.getCompanyRelationByCompanyId(company.id);

    if (!relationshipCompany) {
      relationshipCompany = await this.tenantCompanyRelationService.saveTenantCompanyRelation(tenantId, company, {
        supplierStatus: SupplierStatus.INACTIVE,
        supplierType: SupplierType.EXTERNAL,
      });
    }

    const relationshipCompanyData: any = this.setRelationShipForUpdate(relationshipCompany, relationshipChanges);

    if (relationshipCompany) {
      const updateRelationShip = await this.tenantCompanyRelationService.updateTenantCompanyRelation(
        relationshipCompany.id,
        relationshipCompanyData
      );
      response.tenantCompanyRelation = updateRelationShip;
    }

    if (updateToMetaData.length) {
      await this.eventService.dispatchInternalEvent({ code: EventCode.UPDATE_COMPANY, data: { company, updates } });
    }
    this.cacheRedisService.set(
      `company_${id}_${tenantId}`,
      JSON.stringify(response),
      DefaultTimesForCache.FORTY_SECONDS
    );
    return response;
  }

  private parseRelationShipChanges(data: any) {
    const fields = ['internalName', 'internalId'];
    const changes = {};
    for (const field of fields) {
      if (data[field] !== undefined) {
        changes[field] = data[field];
      }
    }
    return changes;
  }

  private setRelationShipForUpdate(
    oldRelation: TenantCompanyRelationship,
    newRelation: any
  ): TenantCompanyRelationship | boolean {
    return {
      ...oldRelation,
      isFavorite: newRelation.isFavorite ? newRelation.isFavorite : undefined,
      isToCompare: newRelation.isToCompare ? newRelation.isToCompare : undefined,
      ...newRelation,
    };
  }

  async deleteCompany(id: string): Promise<DeleteResult> {
    const result: DeleteResult = {
      affected: 1,
      raw: null,
    };

    const tenantId = this.reqContextResolutionService.getTenantId();

    let tenants: Tenant[] = await this.tenantService.getTenantsByStatusProvisioned();

    const tcr = await this.tenantCompanyRelationshipRepository.find({
      relations: ['company', 'tenant'],
      where: { company: { id } },
    });

    if (tcr.length > 1) {
      tenants = tenants.filter((x) => x.id === tenantId);
    }

    const promises = tenants.map(async (tenant) => {
      const tenantConnection = await this.connectionProviderService.getTenantConnection(tenant.id);

      // delete all events
      this.logger.log(`Deleting events for company ${id} in tenant ${tenant.name}`);
      await this.eventService.deleteEventsByCompanyId(id, tenantConnection);

      // project data
      this.logger.log(`Deleting project data for company ${id} in tenant ${tenant.name}`);
      await this.projectService.deleteProjectDataFromCompanyIdByTenantId([id], tenantConnection);

      // comapny list
      this.logger.log(`Deleting company lists for company ${id} in tenant ${tenant.name}`);
      await this.companyListService.removeCompanyFromAllCompanyListsByTenantId([id], tenantConnection);

      // comapny notes
      this.logger.log(`Deleting company notes for company ${id} in tenant ${tenant.name}`);
      await this.companyNoteService.deleteNotesByCompanyIdInTenant([id], tenantConnection);

      // delete company user profile
      this.logger.log(`Deleting company user profile for company ${id} in tenant ${tenant.name}`);
      await this.userProfileService.removeCompanyfromSubscribedCompaniesByTenantId([id], tenantConnection);
    });

    await Promise.all(promises)
      .then(async (response) => {
        // log
        this.logger.log(`Deleted ${response.length} data tenant for company ${id}`);
        await this.companyRepository.delete(id);
      })
      .catch((err) => {
        // log
        this.logger.error(`Error deleting data tenant for company ${id}: ${err}`);
      });
    return result;
  }

  async deleteBulkCompany(ids: string[]): Promise<DeleteResult> {
    const result: DeleteResult = {
      affected: 1,
      raw: null,
    };

    const tenantId = this.reqContextResolutionService.getTenantId();

    const tenants: Tenant[] = await this.tenantService.getTenantsByStatusProvisioned();
    const TCRs = await this.tenantCompanyRelationshipRepository.find({
      relations: ['company', 'tenant'],
      where: { company: { id: In(ids) } },
    });

    const companyIdsToDelete = [];

    ids.forEach((id) => {
      if (TCRs.filter((x) => x.company.id === id).length === 1) {
        companyIdsToDelete.push(id);
      }
    });

    const deleteDataTenants = tenants.filter((x) => x.id !== tenantId);
    const deleteDataPromises = this.RemoveDataFromTenants(deleteDataTenants, companyIdsToDelete);

    const tenant = tenants.filter((x) => x.id === tenantId);
    const tenantDeleteDataPromise = this.RemoveDataFromTenants(tenant, ids);

    await Promise.all([...deleteDataPromises, ...tenantDeleteDataPromise])
      .then(async (response) => {
        // log
        this.logger.log(`Deleted ${response.length} data tenant for ${ids.length} companies`);
        await this.companyRepository.delete(companyIdsToDelete);
      })
      .catch((err) => {
        // log
        this.logger.error(`Error deleting data tenant for company ${ids.length} companies: ${err}`);
      });
    return result;
  }

  private RemoveDataFromTenants(tenants: Tenant[], ids: string[]) {
    return tenants.map(async (tenant) => {
      const tenantConnection = await this.connectionProviderService.getTenantConnection(tenant.id);

      if (ids.length > 0) {
        // delete all events
        this.logger.log(`Deleting events for ${ids.length} companies in tenant ${tenant.name}`);
        await this.eventService.deleteEventsByCompanies(ids, tenantConnection);

        // project data
        this.logger.log(`Deleting project data for ${ids.length} companies in tenant ${tenant.name}`);
        await this.projectService.deleteProjectDataFromCompanyIdByTenantId(ids, tenantConnection);

        // comapny list
        this.logger.log(`Deleting company lists for ${ids.length} companies in tenant ${tenant.name}`);
        await this.companyListService.removeCompanyFromAllCompanyListsByTenantId(ids, tenantConnection);

        // comapny notes
        this.logger.log(`Deleting company notes for ${ids.length} companies in tenant ${tenant.name}`);
        await this.companyNoteService.deleteNotesByCompanyIdInTenant(ids, tenantConnection);

        // delete company user profile
        this.logger.log(`Deleting company user profile for ${ids.length} companies in tenant ${tenant.name}`);
        await this.userProfileService.removeCompanyfromSubscribedCompaniesByTenantId(ids, tenantConnection);
      }
    });
  }

  private parseFilterValue(value: any, type: controller.QueryFilter.KeyType): any {
    const parseFilterValue = {
      [controller.QueryFilter.KeyType.ARRAY_STRINGS]: (value: any) => value.toString(),
      [controller.QueryFilter.KeyType.STRING]: (value: any) => value.toString(),
      [controller.QueryFilter.KeyType.INT]: (value: any) => parseInt(value, 10),
      [controller.QueryFilter.KeyType.DOUBLE]: (value: any) => parseFloat(value),
    };
    return parseFilterValue[type](value) || value;
  }

  private escapeRegExp(str) {
    return str.replace(/[.*'\]\\]/g, "'$&"); // $& means the whole matched string
  }

  private parseArrayValues(values: string[]): string {
    let searchTerm = '|';

    for (const iterator of values) {
      searchTerm += `/.*"${QueryBuilder.escape(this.escapeRegExp(iterator))}"*./`;
    }
    searchTerm += '|';

    return searchTerm;
  }

  private getTCRFilterQuery(filters, tenantId: string) {
    const typeFilter = filters.find((filter) => filter.key === 'companyType');
    const statusFilter = filters.find((filter) => filter.key === 'companyStatus');
    const valueTypesArray = typeFilter?.value.split(',').map((type) => type.trim().toLowerCase());
    const valueStatusArray = statusFilter?.value.split(',').map((status) => status.trim().toLowerCase());
    let result = ``;

    if (valueTypesArray && valueStatusArray) {
      const typeConditions = valueTypesArray.map((type) => `x/type eq '${type}'`).join(' or ');
      const statusConditions = valueStatusArray.map((status) => `x/status eq '${status}'`).join(' or ');

      if (valueTypesArray.includes(SupplierType.EXTERNAL)) {
        result = `not tcr/any(x: x/type eq \'${
          SupplierType.INTERNAL
        }\' and x/tenantId eq \'${tenantId}\') or tcr/any(x: (${valueTypesArray
          .filter((item) => item !== 'external')
          .map((type) => `x/type eq '${type}'`)
          .join(' or ')}) and (${statusConditions}) and x/tenantId eq '${tenantId}')`;
      } else {
        result = `tcr/any(x: (${typeConditions}) and (${statusConditions}) and x/tenantId eq '${tenantId}')`;
      }
    } else if (valueTypesArray) {
      if (valueTypesArray.includes(SupplierType.EXTERNAL) && valueTypesArray.length === 1) {
        result = `not tcr/any(x: x/type eq \'${SupplierType.INTERNAL}\' and x/tenantId eq \'${tenantId}\')`;
      } else {
        result = `tcr/any(x: x/type eq \'${SupplierType.INTERNAL}\'  and x/tenantId eq \'${tenantId}\')`;
      }
    } else if (valueStatusArray) {
      const statusConditions = valueStatusArray.map((status) => `x/status eq '${status}'`).join(' or ');
      result = `tcr/any(x: (${statusConditions}) and x/tenantId eq '${tenantId}')`;
    }

    return result;
  }

  private async getIndustriesDescendants(codes: any[]) {
    const query = this.industryRepository.createQueryBuilder('industry').select('industry.code');

    codes.forEach((code, index) => {
      const parameters = {
        ['code_' + index]: code + '%',
      };
      if (!index) {
        query.andWhere(`industry.code LIKE :code_${index}`, parameters);
      } else {
        query.orWhere(`industry.code LIKE :code_${index}`, parameters);
      }
    });
    const results = await query.getRawMany();
    const values = results.map((x) => x.industry_code);
    const uniqueChars = [...new Set(values)];
    return uniqueChars;
  }

  private findRelationShipFilter(filters: controller.IQueryFilter[]) {
    const filter = filters?.find((filter) => {
      return filter.key === 'relationships' && filter.keyType === controller.QueryFilter.KeyType.ARRAY_STRINGS;
    });
    if (filter) {
      filters.splice(filters.indexOf(filter), 1);
      return filter;
    }
    return null;
  }

  private findRelationShipLengthFilter(filters: controller.IQueryFilter[]) {
    const filter = filters?.find((filter) => {
      return filter.key === 'relationshipLength';
    });
    if (filter) {
      filters.splice(filters.indexOf(filter), 1);
      return filter;
    }
    return null;
  }

  async discoverCompaniesFromCache(cache: { count: number; results: any[] }, tenantId: string) {
    const { count, results } = cache;
    const companyIds: string[] = [];
    defaultTCR.tenantId = tenantId;

    for (const company of results) {
      companyIds.push(company.id);
    }

    const tenantCompanyRelationShip =
      await this.tenantCompanyRelationService.getCompanyRelationByCompanyIds(companyIds);

    for (const company of results) {
      defaultTCR.companyId = company.id;
      company.tenantCompanyRelation =
        tenantCompanyRelationShip.filter((item) => item.company.id.toLowerCase() === company.id.toLowerCase())[0] ??
        defaultTCR;
    }

    return { count, results };
  }

  async discoverCompanies(queryRequestPayload: controller.QueryRequestPayload, indexName: string) {
    try {
      const { order, pagination, filters, search, column, locationRange } = queryRequestPayload;
      const { key, direction } = order;
      const { limit, page } = pagination;
      const tenantId = this.reqContextResolutionService.getTenantId();
      const externalAuthSystemId = this.reqContextResolutionService.getUserId();
      const user = await this.userService.getUserByExternalId(externalAuthSystemId);
      const relationshipFilter = this.findRelationShipFilter(filters);
      const relationshipLengthFilter = this.findRelationShipLengthFilter(filters);

      const query = this.globalSearchClient.indexes
        .use(indexName)
        .buildQuery()
        .queryType(QueryType.full)
        .searchMode(SearchMode.any);

      const queryFilters: QueryFilter[] = [];

      if (search) {
        const processedSearchTerm = this.handleSearchArrayOrStrings(search);
        this.logger.log(`Processed search term: ${processedSearchTerm}`);
        const [searchFields, additionalFilters] = this.handleSearchAndAdditionalRulesByColumn(column);
        if (searchFields) query.searchFields(searchFields);
        if (additionalFilters) queryFilters.push(additionalFilters);
        query.search(processedSearchTerm);
      }
      if (!search) query.search('*');
      if (filters?.length) {
        const queryFilter: QueryFilter = new QueryFilter(Logical.and);
        let lists = [];
        const filterDifferentTenant = filters.find((i) => i.key === 'tenantId' && i.value !== tenantId);

        const tcrFilter = this.getTCRFilterQuery(
          filters,
          filterDifferentTenant ? filterDifferentTenant.value : tenantId
        );

        if (tcrFilter !== '') queryFilter.field(tcrFilter);
        for (const filter of filters) {
          if (filter.range) {
            this.handleRangeFilter(filter, queryFilter);
          } else {
            switch (filter.keyType) {
              case controller.QueryFilter.KeyType.ARRAY_STRINGS:
                if (filter.key === 'lists') {
                  lists = filter.array.values;
                } else if (filter.key === 'industries') {
                  const queryFilterIndustries: QueryFilter = new QueryFilter(Logical.or);
                  await this.handleArrayStringsIndustriesQueryFilter(filter, queryFilterIndustries);
                  queryFilters.push(queryFilterIndustries);
                } else {
                  queryFilter.isMatch(
                    `${this.parseFilterValue(this.parseArrayValues(filter.array.values), filter.keyType)}`,
                    [filter.key],
                    QueryType.simple,
                    SearchMode.any
                  );
                }
                break;
              case controller.QueryFilter.KeyType.STRING:
                this.handleStringQueryFilter(filter, queryFilter);
                break;
              case controller.QueryFilter.KeyType.DOUBLE:
                this.handleDoubleQueryFilter(filter, queryFilter);
                break;
              case controller.QueryFilter.KeyType.BOOLEAN:
                if (filter.key === 'isFavorite') {
                  const tenantCompanyRelationShip =
                    await this.tenantCompanyRelationService.getCompanyRelationByFavorite();
                  const companyIds = [
                    ...new Set(
                      tenantCompanyRelationShip
                        .map((x) => x.company.id)
                        .reduce((acc, curr) => acc.concat(curr ?? []), [])
                    ),
                  ].map((value) => value.toLowerCase());
                  queryFilter.in(this.idNameSelectorByAzureIndex(indexName), companyIds);
                } else {
                  queryFilter.field(`tcr/any(x: x/${filter.key} eq ${filter.value} and x/tenantId eq \'${tenantId}\')`);
                }
                break;
              default:
                queryFilter.eq(filter.key, this.parseFilterValue(filter.value, filter.keyType));
                break;
            }
          }
        }

        if (lists.length > 0) {
          let tenantConnection;
          if (filterDifferentTenant) {
            const differentTenantId = filters?.find((i) => i.key === 'tenantId')?.value;
            if (tenantId !== differentTenantId) {
              throw new Error('TenantId is not valid');
              // TODO: Validate when we allow shared list in different tenants
            }
            const sharedList = await this.sharedListRepository.findOne({
              where: {
                tenant: {
                  id: differentTenantId,
                },
                userId: user.id,
                listId: In(lists),
                status: SharedListStatus.ACCEPTED,
              },
            });

            if (!sharedList) {
              throw new RpcException('Shared list not found');
            }
            tenantConnection = await this.connectionProviderService.getTenantConnection(differentTenantId);
            const useTenantCompanyListRepository = tenantConnection.getRepository(CompanyList);
            const companyLists = await useTenantCompanyListRepository.find({ id: In(lists) });
            const companies: any = [
              ...new Set(
                companyLists
                  .map((list) => list.companies)
                  .reduce((accumulator, value) => accumulator.concat(value ?? []), [])
              ),
            ].map((value: string) => value.toLowerCase());
            queryFilter.in(this.idNameSelectorByAzureIndex(indexName), companies);
          } else {
            const companyLists = await this.companyListRepository.find({ where: { id: In(lists) } });

            if (companyLists[0].createdBy !== user.externalAuthSystemId) {
              const sharedList = await this.sharedListRepository.findOne({
                where: {
                  tenant: {
                    id: tenantId,
                  },
                  userId: user.id,
                  listId: In(lists),
                  status: SharedListStatus.ACCEPTED,
                },
              });
              if (!sharedList) {
                throw new RpcException('Shared list not found');
              }
            }
            const companies = [
              ...new Set(
                companyLists
                  .map((list) => list.companies)
                  .reduce((accumulator, value) => accumulator.concat(value ?? []), [])
              ),
            ].map((value: string) => value.toLowerCase());
            queryFilter.in(this.idNameSelectorByAzureIndex(indexName), companies);
          }
        }
        queryFilters.push(queryFilter);
      }
      if (locationRange || filters?.filter(({ key }) => this.locationsColumns.includes(key))?.length > 0) {
        const queryFilterLocations: QueryFilter = new QueryFilter(Logical.and);
        this.handleLocationRange(locationRange, queryFilterLocations, filters, indexName);
        queryFilters.push(queryFilterLocations);
      }

      if (relationshipFilter) {
        const queryFilterRelationship: QueryFilter = new QueryFilter(Logical.and);
        await this.handleRelationshipFilter(relationshipFilter, queryFilterRelationship, indexName, tenantId);
        queryFilters.push(queryFilterRelationship);
      }

      if (relationshipLengthFilter) {
        const queryFilterRelationship: QueryFilter = new QueryFilter(Logical.and);
        await this.handleRelationshipLengthFilter(
          relationshipLengthFilter,
          queryFilterRelationship,
          indexName,
          tenantId
        );
        queryFilters.push(queryFilterRelationship);
      }

      if (queryFilters.length >= 0) {
        query.filter(QueryFilter.and(...queryFilters));
      }

      if (limit && page) {
        const offset = limit * (page - 1);
        query.top(limit);
        query.skip(offset);
      }

      if (key && direction) {
        if (direction === 'ASC') query.orderbyAsc(key);
        else query.orderbyDesc(key);
      }

      this.logger.log(`Query ${JSON.stringify(query.query)}`);
      const response = await query.count(true).executeQuery();
      const count = response.result['@odata.count'];
      const values = response.result.value ?? [];
      if (count <= 0 || values.length <= 0) {
        return { count, results: [] };
      }
      const entityIds: string[] = [];
      for (const indexEntity of values) {
        entityIds.push(indexEntity.id);
      }

      const companies = await this.handleIndexIds(entityIds, indexName);

      defaultTCR.tenantId = tenantId;

      const isList = Array.isArray(filters) && filters.some((filter) => filter.key === 'lists');
      for (const company of companies as CompanyWithMinorityOwnerShip[]) {
        defaultTCR.companyId = company.id;
        company.tenantCompanyRelation = !company.tenantCompanyRelationships
          ? (defaultTCR as any)
          : (company.tenantCompanyRelationships.filter((x) => x.tenant.id === tenantId)[0] ?? (defaultTCR as any));
        company.latestScore = company?.score[0] ?? StimulusScoreService.buildDefaultScore();
        company.locationsByIndex = company?.locations;
        company.locations = undefined;
        company.tenantCompanyRelationships = undefined;
        company.score = undefined;
        if (!isList) {
          const { values: diverseOwnership } = await this.diverseOwnershipService.getDiverseOwnershipByCompanyId(
            company.id
          );
          company.diverseOwnership = diverseOwnership.map((item) =>
            item.diverseOwnership.toString()
          ) as unknown as DiverseOwnership[];

          const { values: minorityOwnerShip } =
            await this.minorityOwnershipDetailService.getMinorityOwnershipByCompanyId(company.id);
          company.minorityOwnership = minorityOwnerShip.map((item) =>
            item.minorityOwnershipDetail.toString()
          ) as unknown as string[];
        } else {
          company.contactsByIndex = company?.contacts;
          company.certificationsByIndex = company?.certifications;
        }
      }
      const sortedCompanies = this.handleSortCompanyList(companies, entityIds, indexName);
      const filterEmptyCompanies = this.filterEmptyCompanyList(sortedCompanies);

      if (!filters && !search && !column && !locationRange) {
        await this.cacheRedisService.setDiscoverCompanyByCache(
          tenantId,
          { count, results: sortedCompanies },
          queryRequestPayload,
          indexName
        );
      }

      return { count, results: filterEmptyCompanies };
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async countCompaniesByList(listType: controller.GeneralTypeList) {
    try {
      switch (listType) {
        case controller.GeneralTypeList.FAVORITE:
          const countOfFavoritesLists = await this.tenantCompanyRelationService.countCompanyRelationByFavorite();
          return { count: countOfFavoritesLists };

        case controller.GeneralTypeList.ALL:
          const countOfAllLists = await this.companyRepository.count();
          return { count: countOfAllLists };

        case controller.GeneralTypeList.INTERNAL:
          const countOfInternalLists = await this.tenantCompanyRelationService.countInternalCompany();
          return { count: countOfInternalLists };
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async handleIndexIds(idsFromIndex: string[], indexName: string) {
    if (indexName === this.globalCompanyAggregateIndexName) {
      return this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.tenantCompanyRelationships', 'tenantCompanyRelationships')
        .leftJoinAndSelect('tenantCompanyRelationships.tenant', 'tenant')
        .leftJoinAndSelect('company.score', 'score')
        .leftJoinAndSelect('company.industries', 'industries')
        .leftJoinAndSelect('company.contacts', 'contacts')
        .leftJoinAndSelect('company.locations', 'locationsByIndex')
        .leftJoinAndSelect('company.certifications', 'certifications')
        .where('company.id IN (:...idsFromIndex)', { idsFromIndex })
        .orderBy('score.timestamp', 'DESC')
        .getMany();
    }
    if (indexName === this.globalLocationAggregateIndexName) {
      return this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.tenantCompanyRelationships', 'tenantCompanyRelationships')
        .leftJoinAndSelect('tenantCompanyRelationships.tenant', 'tenant')
        .leftJoinAndSelect('company.score', 'score')
        .leftJoinAndSelect('company.locations', 'locationsByIndex')
        .leftJoinAndSelect('company.industries', 'industries')
        .where('locationsByIndex.id IN (:...idsFromIndex)', { idsFromIndex })
        .getMany();
    }
  }

  private handleSortCompanyList = (companies: any[], order: string[], indexName: string) => {
    const ordersLists = {
      [this.globalCompanyAggregateIndexName]: this.sortCompanyListByOrder(companies, order),
      [this.globalLocationAggregateIndexName]: companies,
    };

    return ordersLists[indexName];
  };

  private filterEmptyCompanyList = (companies: any[]) => {
    const filterLists = companies.filter((item) => item !== null && item !== undefined);
    return filterLists;
  };

  private sortCompanyListByOrder = (companies: any[], order: string[]) => {
    const mapping = {};

    for (const company of companies) {
      mapping[company.id] = company;
    }

    const sortedCompanies = order.map((id) => mapping[id.toUpperCase()]);

    return sortedCompanies;
  };

  private handleLocationRange(
    locationRange: controller.IGeoFilter,
    queryFilterLocations: QueryFilter,
    filters: controller.IQueryFilter[],
    indexName: string
  ) {
    if (locationRange?.radius > 0) {
      const indexesMap = {
        [this.globalCompanyAggregateIndexName]:
          `locations/any(x: geo.distance(x/location, geography'POINT(${locationRange.lng} ${locationRange.lat})') ${GeoComparison.le} ${locationRange.radius})`,
        [this.globalLocationAggregateIndexName]:
          `geo.distance(location, geography'POINT(${locationRange.lng} ${locationRange.lat})') ${GeoComparison.le} ${locationRange.radius}`,
      };
      queryFilterLocations.field(indexesMap[indexName]);
    }
    if (filters) {
      let locationFilter = filters.filter((filter) => this.locationsColumns.includes(filter.key));
      locationFilter.sort((a, b) => this.locationsColumns.indexOf(a.key) - this.locationsColumns.indexOf(b.key));
      locationFilter = locationFilter.slice(0, 2);
      for (const filter of locationFilter) {
        const { key, value } = filter;
        queryFilterLocations.field(this.locationsSearchByIndexName(key, value, indexName));
      }
    }
  }

  private async handleRelationshipFilter(
    relationshipFilter: controller.IQueryFilter,
    queryFilterRelationship: QueryFilter,
    indexName: string,
    tenantId: string
  ) {
    try {
      const {
        array: { values },
      } = relationshipFilter;
      const types = values.map((value) => value.toUpperCase());
      const companyIds: string[] = [];
      const TYPE_HIERARCHY = {
        [CompanyType.AWARDED]: ['NULL'],
        [CompanyType.SHORTLISTED]: [CompanyType.AWARDED],
        [CompanyType.QUALIFIED]: [CompanyType.SHORTLISTED, CompanyType.AWARDED],
        [CompanyType.CONSIDERED]: [CompanyType.QUALIFIED, CompanyType.SHORTLISTED, CompanyType.AWARDED],
      };
      for (const type of types) {
        const cache = await this.cacheRedisService.get(`companyIdsByType-${tenantId}-${type}`);
        if (!cache) {
          const companiesSubQuery = this.projectCompanyRepository
            .createQueryBuilder('projectCompany')
            .leftJoin('projectCompany.project', 'project')
            .select('projectCompany.companyId')
            .where('projectCompany.type IN (:...typesSq)', { typesSq: TYPE_HIERARCHY[type] })
            .andWhere(`projectCompany.type != '${CompanyType.CLIENT}'`)
            .andWhere('project.status in (:...statusSq)', {
              statusSq: [ProjectStatus.COMPLETED, ProjectStatus.INPROGRESS],
            });

          const companies = await this.projectCompanyRepository
            .createQueryBuilder('projectCompany')
            .leftJoin('projectCompany.project', 'project')
            .select('projectCompany.companyId')
            .where('projectCompany.type = :type', { type })
            .andWhere(`projectCompany.type != '${CompanyType.CLIENT}'`)
            .andWhere('project.status in (:...status)', { status: [ProjectStatus.COMPLETED, ProjectStatus.INPROGRESS] })
            .andWhere(`projectCompany.companyId NOT IN (${companiesSubQuery.getQuery()})`)
            .setParameters(companiesSubQuery.getParameters())
            .getMany();

          let companiesIds = companies.map((company) => company.companyId.toLowerCase());
          companiesIds = [...new Set(companiesIds)];
          companyIds.push(...companiesIds);
          await this.cacheRedisService.set(
            `companyIdsByType-${tenantId}-${type}`,
            companiesIds,
            DefaultTimesForCache.ONE_MINUTE
          );
        } else {
          companyIds.push(...cache);
        }
      }
      if (indexName === this.globalCompanyAggregateIndexName) {
        queryFilterRelationship.in(this.idNameSelectorByAzureIndex(indexName), companyIds);
      }
      if (indexName === this.globalLocationAggregateIndexName) {
        queryFilterRelationship.in(this.idNameSelectorByAzureIndex(indexName), companyIds);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  private async handleRelationshipLengthFilter(
    relationshipLengthFilter: controller.IQueryFilter,
    queryFilterRelationship: QueryFilter,
    indexName: string,
    tenantId: string
  ) {
    try {
      let startValue = 0;
      let endValue = Number.MAX_SAFE_INTEGER;

      if (relationshipLengthFilter.range.start) {
        startValue = this.parseFilterValue(relationshipLengthFilter.range.start, relationshipLengthFilter.keyType);
      }

      if (relationshipLengthFilter.range.end) {
        endValue = this.parseFilterValue(relationshipLengthFilter.range.end, relationshipLengthFilter.keyType);
      }

      const companyIds: string[] = [];

      const cache = await this.cacheRedisService.get(`companyIdsByLength-${tenantId}-${startValue}-${endValue}`);
      if (!cache) {
        const subQuery = this.projectCompanyRepository
          .createQueryBuilder('pc')
          .select('pc.companyId', 'companyId')
          .addSelect('YEAR(GETDATE()) - YEAR(MIN(p.startDate))', 'relationshipLength')
          .innerJoin('pc.project', 'p')
          .groupBy('pc.companyId');

        const companies = await this.projectCompanyRepository
          .createQueryBuilder()
          .select('c.companyId')
          .from(`(${subQuery.getQuery()})`, 'c')
          .where(`c.relationshipLength >= ${startValue}`)
          .andWhere(`c.relationshipLength <= ${endValue}`)
          .setParameters(subQuery.getParameters())
          .getRawMany();

        let companiesIds = companies.map((company) => company.companyId.toLowerCase());
        companiesIds = [...new Set(companiesIds)];
        companyIds.push(...companiesIds);
        await this.cacheRedisService.set(
          `companyIdsByLength-${tenantId}-${startValue}-${endValue}`,
          companiesIds,
          DefaultTimesForCache.ONE_MINUTE
        );
      } else {
        companyIds.push(...cache);
      }

      if (indexName === this.globalCompanyAggregateIndexName) {
        queryFilterRelationship.in(this.idNameSelectorByAzureIndex(indexName), companyIds);
      }
      if (indexName === this.globalLocationAggregateIndexName) {
        queryFilterRelationship.in(this.idNameSelectorByAzureIndex(indexName), companyIds);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  private handleRangeFilter(filter: controller.IQueryFilter, queryFilter: QueryFilter<any>) {
    const rangeQueryFilter: QueryFilter = new QueryFilter(Logical.and);

    let startValue = 0;
    let endValue = Number.MAX_SAFE_INTEGER;

    if (filter.range.start) {
      startValue = this.parseFilterValue(filter.range.start, filter.keyType);
      rangeQueryFilter.ge(filter.key, startValue);
    }

    if (filter.range.end) {
      endValue = this.parseFilterValue(filter.range.end, filter.keyType);
      rangeQueryFilter.le(filter.key, endValue);
    }

    const defaultScore = StimulusScoreService.buildDefaultScore();
    const defaultScoreQueryFilter: QueryFilter = new QueryFilter(Logical.or);

    if (
      filter.key === 'score/scoreValue' &&
      defaultScore.scoreValue >= startValue &&
      defaultScore.scoreValue <= endValue
    ) {
      defaultScoreQueryFilter.eq(filter.key, null);
      defaultScoreQueryFilter.or(rangeQueryFilter);
      queryFilter.and(defaultScoreQueryFilter);
      return;
    }

    queryFilter.and(rangeQueryFilter);
  }

  private handleSearchArrayOrStrings(search: string) {
    const fullSearchValue = search.trim();
    const sanitizedSearchTerms = [search.trim()];
    const splitSearchValue = search.trim().split(/\s+/);
    if (splitSearchValue[0] !== fullSearchValue) sanitizedSearchTerms.push(...search.trim().split(/\s+/));
    let processedSearchTerm = '';
    if (sanitizedSearchTerms.length > 0) {
      if (sanitizedSearchTerms.length === 1) {
        processedSearchTerm = `("${sanitizedSearchTerms[0]}" || ${QueryBuilder.escape(sanitizedSearchTerms[0])}*)`;
      } else {
        processedSearchTerm += `("${sanitizedSearchTerms[0]}" ||(`;
        for (const iterator of sanitizedSearchTerms) {
          if (iterator === sanitizedSearchTerms[sanitizedSearchTerms.length - 1]) {
            processedSearchTerm += `+${QueryBuilder.escape(iterator)}*`;
          } else processedSearchTerm += `+"${iterator}"`;
        }
        processedSearchTerm += `))`;
      }
    }
    return processedSearchTerm;
  }

  private async handleArrayStringsIndustriesQueryFilter(
    filter: controller.IQueryFilter,
    queryFilter: QueryFilter<any>
  ) {
    const codes = [];
    const strings = [];
    const ids = [];
    for (const value of filter.array.values) {
      if (/^\d+$/.test(value)) {
        codes.push(value);
      } else if (/\b\d+-\d+\b/.test(value)) {
        const [start, end] = value.split('-');
        const range = await this.industryService.getIndustriesByRange(start, end);
        codes.push(...range.map((item) => item.code));
      } else if (value.length === 36) {
        ids.push(value);
      } else {
        strings.push(value);
      }
    }

    if (codes.length > 0) {
      const industries = await this.industryRepository.find({ where: { code: In(codes) } });
      const codesFounded = industries.map((i) => i.code);
      queryFilter.field(
        `industries/any(x: search.in(x/code, \'${(await this.getIndustriesDescendants(codesFounded)).join()}\'))`
      );
    }
    if (strings.length > 0)
      queryFilter.isMatch(
        `${this.parseFilterValue(this.parseArrayValues(strings), filter.keyType)}`,
        ['industries/title_index'],
        QueryType.simple,
        SearchMode.any
      );
    if (ids.length > 0) {
      const tenantId = this.reqContextResolutionService.getTenantId();
      const filterByIndustriesIds: QueryFilter = new QueryFilter().isMatch(
        `${this.parseFilterValue(this.parseArrayValues(ids), filter.keyType)}`,
        ['industries/industryId'],
        QueryType.simple,
        SearchMode.any
      );
      const filterByTenantId: QueryFilter = new QueryFilter().isMatch(
        `${this.parseFilterValue(this.parseArrayValues([tenantId]), filter.keyType)}`,
        ['industries/tenants/tenantId'],
        QueryType.simple,
        SearchMode.any
      );
      queryFilter.and(filterByIndustriesIds, filterByTenantId);
    }
  }

  private handleStringQueryFilter(filter: controller.IQueryFilter, queryFilter: QueryFilter<any>) {
    const value = filter.value.trim();
    const valueLowered = value.toLowerCase();
    if (this.filtersToIgnore.includes(filter.key)) return;
    switch (filter.key) {
      case 'certification':
      case 'product':
      case 'insurance':
        queryFilter.isMatch(
          `/.*${this.parseFilterValue(valueLowered, filter.keyType)}.*/`,
          [filter.key + 's/name'],
          QueryType.full,
          SearchMode.any
        );
        break;
      case 'typeOfLegalEntity':
        queryFilter.eq(filter.key, this.parseFilterValue(value, filter.keyType));
        break;
      default:
        queryFilter.isMatch(
          `${this.parseFilterValue(valueLowered, filter.keyType)}~`,
          [filter.key],
          QueryType.full,
          SearchMode.any
        );
        break;
    }
  }

  private handleDoubleQueryFilter(filter: controller.IQueryFilter, queryFilter: QueryFilter<any>) {
    if (this.filtersToIgnore.includes(filter.key)) return;
    else queryFilter.eq(filter.key, this.parseFilterValue(filter.value, filter.keyType));
  }

  private locationsSearchByIndexName(key: string, value: string, indexName: string) {
    const translatedState = this.handleSearchByState(key, value, indexName);
    const filteByIndexName = {
      [this.globalCompanyAggregateIndexName]:
        `locations/any(x: x/${key} eq '${value}' or x/${key} eq '${value.toUpperCase()}' or x/${key} eq '${value.toLowerCase()}'${
          translatedState ? translatedState : ''
        })`,
      [this.globalLocationAggregateIndexName]:
        `${key} eq '${value}' or ${key} eq '${value.toUpperCase()}' or ${key} eq '${value.toLowerCase()}'${
          translatedState ? translatedState : ''
        } `,
    };
    return filteByIndexName[indexName];
  }

  private handleSearchByState(key: string, value: string, indexName: string) {
    let translatedState = '';
    if (key === 'state') translatedState = findState(value);
    const stateByIndexName = {
      [this.globalCompanyAggregateIndexName]: `${
        translatedState
          ? ` or x/${key} eq '${translatedState}' or x/${key} eq '${translatedState.toUpperCase()}' or x/${key} eq '${translatedState.toLowerCase()}'`
          : ''
      }`,
      [this.globalLocationAggregateIndexName]: `${
        translatedState
          ? ` or ${key} eq '${translatedState}' or ${key} eq '${translatedState.toUpperCase()}' or ${key} eq '${translatedState.toLowerCase()}'`
          : ''
      }`,
    };
    return stateByIndexName[indexName];
  }

  async getDistinctDiverseOwnership(): Promise<{ values: any[] }> {
    try {
      const response = await this.diverseOwnershipService.findAll();
      return {
        values: [...new Set(response.map((item: DiverseOwnership) => item.diverseOwnership))],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDistinctMinoryOwnership(): Promise<{ values: any[] }> {
    try {
      const response = await this.minorityOwnershipDetailService.findAll();
      return {
        values: [...new Set(response.map((item: MinorityOwnershipDetail) => item.minorityOwnershipDetail))],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMinorityOwnership(): Promise<{ results: MinorityOwnershipDetail[] }> {
    try {
      const response = await this.minorityOwnershipDetailService.findAll();
      return {
        results: response,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnusedCompanies(queryUnusedRequestPayload: controller.SearchUnusedRequestPayload) {
    const { pagination, createdTo, createdFrom } = queryUnusedRequestPayload;
    const { limit, page } = pagination;
    const tenantId = this.reqContextResolutionService.getTenantId();
    const offset = limit * (page - 1);

    const usedProjectCompany = await this.projectCompanyRepository
      .createQueryBuilder('projectCompany')
      .leftJoinAndSelect('projectCompany.project', 'project')
      .select(['projectCompany.companyId'])
      .where('project.endDate > :createdFrom', { createdFrom })
      .andWhere('project.endDate < :createdTo', { createdTo })
      .andWhere('project.endDate > :dateLimit', { dateLimit: this.addDateYears(Date.now(), -1).toISOString() })
      .getMany();

    const usedCompaniesIds = R.uniq(usedProjectCompany.map((x) => x.companyId));

    let companiesQuery = this.companyRepository
      .createQueryBuilder('company')
      .innerJoinAndSelect('company.tenantCompanyRelationships', 'tenantCompanyRelationships')
      .leftJoinAndSelect('tenantCompanyRelationships.tenant', 'tenant')
      .leftJoinAndSelect('company.score', 'score')
      .where('tenantCompanyRelationships.tenantId = :tenantId', { tenantId })
      .andWhere('tenantCompanyRelationships.type = :type', { type: SupplierType.INTERNAL });

    if (usedCompaniesIds.length > 0) {
      companiesQuery = companiesQuery.andWhere('company.id NOT IN (:...usedCompaniesIds)', { usedCompaniesIds });
    }
    const companies = await companiesQuery.orderBy('company.id').skip(offset).take(limit).getManyAndCount();

    defaultTCR.tenantId = tenantId;

    for (const company of companies[0]) {
      defaultTCR.companyId = company.id;
      company.tenantCompanyRelation = !company.tenantCompanyRelationships
        ? (defaultTCR as any)
        : (company.tenantCompanyRelationships.filter((x) => x.tenant.id === tenantId)[0] ?? (defaultTCR as any));
      company.latestScore = company.score[0] ?? ({ scoreValue: 1000 } as any);
      company.tenantCompanyRelationships = undefined;
      company.score = undefined;
    }

    return companies;
  }

  async getInternalCompaniesDashboard(queryInternalCompaniesDashboard: controller.FiltersDashboardPayload) {
    const { timePeriodFilter, granularityFilter } = queryInternalCompaniesDashboard;
    const tenantId = await this.reqContextResolutionService.getTenantId();

    const year = new Date().getFullYear();

    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.tenantCompanyRelationships', 'tenantCompanyRelationships')
      .leftJoinAndSelect('tenantCompanyRelationships.tenant', 'tenant')
      .where('tenant.id = :tenantId', { tenantId })
      .andWhere('tenantCompanyRelationships.type = :type', { type: 'internal' });

    const checkPrevYear = await query
      .andWhere('YEAR(tenantCompanyRelationships.created)= :year', { year: year - 1 })
      .getCount();

    query.andWhere('YEAR(tenantCompanyRelationships.created)= :year', {
      year: timePeriodFilter === 'current' ? year : year - 1,
    });

    if (granularityFilter === 'month') {
      query
        .select(
          `MONTH(tenantCompanyRelationships.created) as name, SUM(COUNT(*)) OVER(ORDER BY MONTH(tenantCompanyRelationships.created)) +
  ${timePeriodFilter === 'current' ? checkPrevYear : 0} as Companies`
        )
        .groupBy('MONTH(tenantCompanyRelationships.created)');
    } else if (granularityFilter === 'quarter') {
      query
        .select(
          `DATEPART(quarter, tenantCompanyRelationships.created) as name, SUM(COUNT(*)) OVER(ORDER BY DATEPART(quarter, tenantCompanyRelationships.created)) +
  ${timePeriodFilter === 'current' ? checkPrevYear : 0} as Companies`
        )
        .groupBy('DATEPART(quarter, tenantCompanyRelationships.created)');
    }

    const count = await query.getCount();
    const internalCompanies = await query.execute();

    const results = internalCompanies.map((data) => {
      return { ...data, name: granularityFilter === 'month' ? getMonthName(data.name) : 'Q' + data.name };
    });

    return [results, count + (timePeriodFilter === 'current' ? checkPrevYear : 0), checkPrevYear];
  }
  async checkDataInternalDashboard() {
    const tenantId = await this.reqContextResolutionService.getTenantId();
    const year = new Date().getFullYear();
    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.tenantCompanyRelationships', 'tenantCompanyRelationships')
      .leftJoinAndSelect('tenantCompanyRelationships.tenant', 'tenant')
      .where('tenant.id = :tenantId', { tenantId })
      .andWhere('tenantCompanyRelationships.type = :type', { type: 'internal' });

    const prevYear = await query
      .andWhere('YEAR(tenantCompanyRelationships.created) >= :year', { year: year - 1 })
      .getCount();
    const currentYear = await query.andWhere('YEAR(tenantCompanyRelationships.created) >= :year', { year }).getCount();

    const hasData = (prevYear ?? currentYear) > 0 ? true : false;
    return [hasData, prevYear, currentYear];
  }

  async getCompaniesByTaxIdAndName(queryRequestPayload: controller.QueryRequestPayload, indexName: string) {
    try {
      const { order, pagination, search, column } = queryRequestPayload;
      const { key, direction } = order;
      const { limit, page } = pagination;
      const tenantId = this.reqContextResolutionService.getTenantId();
      const query = this.globalSearchClient.indexes
        .use(indexName)
        .buildQuery()
        .queryType(QueryType.full)
        .searchMode(SearchMode.any);
      if (search) {
        const processedSearchTerm = this.handleSearchArrayOrStrings(search);
        this.logger.log(`Processed search term: ${processedSearchTerm}`);
        if (column) query.searchFields(column);
        query.search(processedSearchTerm);
      }
      if (limit && page) {
        const offset = limit * (page - 1);
        query.top(limit);
        query.skip(offset);
      }
      if (key && direction) {
        if (direction === 'ASC') query.orderbyAsc(key);
        else query.orderbyDesc(key);
      }
      this.logger.log(`Query ${JSON.stringify(query.query)}`);
      const response = await query.count(true).executeQuery();
      const count = response.result['@odata.count'];
      const values = response.result.value;
      this.logger.log(`Found ${count} results`);
      if (count <= 0) {
        return { count: 0, results: [] };
      }
      const entityIds: string[] = [];
      for (const indexEntity of values) {
        entityIds.push(indexEntity.id);
      }
      const companies = await this.handleIndexIds(entityIds, indexName);
      defaultTCR.tenantId = tenantId;
      for (const company of companies) {
        defaultTCR.companyId = company.id;
        company.tenantCompanyRelation = !company.tenantCompanyRelationships
          ? (defaultTCR as any)
          : (company.tenantCompanyRelationships.filter((x) => x.tenant.id === tenantId)[0] ?? (defaultTCR as any));
        company.latestScore = company.score[0] ?? StimulusScoreService.buildDefaultScore();
        company.locationsByIndex = company.locations;
        company.locations = undefined;
        company.tenantCompanyRelationships = undefined;
        company.score = undefined;
      }
      return { count, results: companies };
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  private addDateYears = (date, years) => {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(dateCopy.getFullYear() + years);
    return dateCopy;
  };

  private handleOwnershipArrays = (ownership: string[], repositoryResponse: any[]) => {
    if (ownership.includes(PAST_TO_EMPTY)) return [];
    return repositoryResponse;
  };

  private handleParentTaxId = async (parentTaxId: string) => {
    const parentCompany = await this.companyRepository.findOne({ taxIdNo: parentTaxId });
    if (!parentCompany) return this.companyRepository.save({ taxIdNo: parentTaxId });
    return parentCompany;
  };

  private handleCompanyPropertyNames = ({
    columns,
    values,
    targetCompany,
  }: {
    columns: any;
    values: any;
    targetCompany: Company;
  }) => {
    const otherBusinessNames = targetCompany.names
      .filter((element) => element.type === CompanyNameType.OTHER)
      .map((element) => element.name);
    const previousBusinessNames = targetCompany.names
      .filter((element) => element.type === CompanyNameType.PREVIOUS)
      .map((element) => element.name);
    const companyWithCustomProperties = { ...targetCompany, otherBusinessNames, previousBusinessNames };

    const updateToMetaData = [];
    const updates = [];

    columns.map((element) => {
      updateToMetaData.push({
        id: element,
        from: Array.isArray(companyWithCustomProperties[element])
          ? companyWithCustomProperties[element].join(', ')
          : companyWithCustomProperties[element],
        to: Array.isArray(values[element]) ? values[element].join(', ') : values[element],
      });
      updates.push({
        id: element,
        from: companyWithCustomProperties[element],
        to: values[element],
      });
    });
    return { updateToMetaData, updates };
  };

  private handleSearchAndAdditionalRulesByColumn = (column: string): [string, QueryBuilder | any] => {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const rulesByColumn = {
      description: null,
      industry: [
        new QueryFilter(Logical.and).isMatch(
          `${this.parseFilterValue(this.parseArrayValues([tenantId]), controller.QueryFilter.KeyType.ARRAY_STRINGS)}`,
          ['industries/tenants/tenantId'],
          QueryType.simple,
          SearchMode.any
        ),
      ],
      tags: null,
      certifications: null,
      insurance: null,
      productsAndServices: null,
      riskManagement: null,
      title: null,
      taxIdNo: null,
      taxIdAndLegalName: null,
    };

    return [this.columnsToSearch[column], rulesByColumn[column]] as [string, QueryBuilder[] | any];
  };
}
