import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from 'azure-search-client';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { CompanyListService } from 'src/company-list/company-list.service';
import { CompanyNoteService } from 'src/company-note/company-note.service';
import { DataTraceSource } from 'src/core/datatrace.types';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { ConnectionProviderService } from 'src/database/connection-provider.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { DiverseOwnershipService } from 'src/diverse-ownership/diverse-ownership.service';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { InternalEventService } from 'src/event/internal-event.service';
import { IndustryService } from 'src/industry/industry.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { MinorityOwnershipDetailService } from 'src/minority-ownershipDetail/minority-ownershipDetail.service';
import { ProjectService } from 'src/project/project.service';
import {
  GLOBAL_COMPANY_AGGREGATE_INDEX_NAME,
  GLOBAL_LOCATION_AGGREGATE_INDEX_NAME,
  GLOBAL_SEARCH_CLIENT,
} from 'src/search/search.constants';
import { TagService } from 'src/tag/tag.service';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { defaultTCR } from 'src/tenant-company-relationship/tenant-company-relationship.constants';
import { TenantService } from 'src/tenant/tenant.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserService } from 'src/user/user.service';
import GlobalSearchMock from 'src/utils/Tests/GlobalSearchMock';
import { cacheRedisMock } from 'test/cacheRedisMock';
import { globalConnectionMock, MockQueryBuilder, tenantConnectionMock } from 'test/typeormConnectionMock';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanyProvider } from './company.provider';
import { CompanyService } from './company.service';
import { CompanyNamesService } from 'src/company-names/company-names.service';

describe('CompanyService', () => {
  const company = CompanyProvider.buildCompany('id');
  const companyWithTenant = CompanyProvider.buildCompanyWithTenant();
  const companies = CompanyProvider.buildCompanies('id');

  let repository: Repository<any>;
  let service: CompanyService | any;
  let internalEventService: InternalEventService;
  let tagService: TagService;
  let cacheRedisService: CacheRedisService;
  let searchService: SearchService;
  let entityManager: EntityManager;
  let handleIndexIdsSpy: jest.SpyInstance;
  let handleSearchArrayOrStringsSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: GLOBAL_SEARCH_CLIENT,
          useValue: GlobalSearchMock,
        },
        {
          provide: GLOBAL_COMPANY_AGGREGATE_INDEX_NAME,
          useValue: 'stimulus-index',
        },
        {
          provide: GLOBAL_LOCATION_AGGREGATE_INDEX_NAME,
          useValue: 'stimulus-index',
        },
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: ReqContextResolutionService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user'),
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: InternalEventService,
          useValue: {
            dispatchInternalEvent: jest.fn(),
          },
        },
        {
          provide: IndustryService,
          useValue: {
            getIndustriesByRange: jest.fn(),
            getCompanyIndustriesByTenant: jest.fn(),
          },
        },
        {
          provide: EvaluationService,
          useValue: {
            getCompanyEvaluations: jest.fn(),
          },
        },
        {
          provide: TenantCompanyRelationshipService,
          useValue: {
            getCompanyRelationByCompanyId: jest.fn(),
            saveTenantCompanyRelation: jest.fn(),
            updateTenantCompanyRelation: jest.fn(),
          },
        },
        {
          provide: CacheRedisService,
          useValue: {
            ...cacheRedisMock,
          },
        },
        {
          provide: ConnectionProviderService,
          useValue: {
            getTenantConnection: jest.fn().mockReturnValue(tenantConnectionMock),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByExternalId: jest.fn(),
          },
        },
        {
          provide: DiverseOwnershipService,
          useValue: {
            getDiverseOwnershipByCompanyId: jest.fn().mockReturnValueOnce({ values: [] } as any),
            findBydiverseOwnership: jest.fn().mockReturnValueOnce({ values: [] } as any),
          },
        },
        {
          provide: MinorityOwnershipDetailService,
          useValue: {
            getMinorityOwnershipByCompanyId: jest.fn().mockReturnValueOnce({ values: [] } as any),
            findBydiverseOwnership: jest.fn().mockReturnValueOnce({ values: [] } as any),
            findAll: jest.fn(),
          },
        },
        {
          provide: TagService,
          useValue: {
            getTagsObjsByCompanyId: jest.fn().mockReturnValueOnce({ values: [] } as any),
            updateTags: jest.fn(),
            getTagsByTagsName: jest.fn().mockReturnValueOnce([company.tags[0].tag]),
          },
        },
        {
          provide: TenantService,
          useValue: {},
        },
        {
          provide: CompanyNoteService,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: {},
        },
        {
          provide: CompanyListService,
          useValue: {},
        },
        {
          provide: UserProfileService,
          useValue: {},
        },
        {
          provide: 'BullQueue_search',
          useValue: {
            add: jest.fn(),
            getWaitingCount: jest.fn(),
          },
        },
        {
          provide: CompanyNamesService,
          useValue: {
            UpdateNames: jest.fn(),
            getCompanyNames: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve(CompanyService);

    internalEventService = module.get<InternalEventService>(InternalEventService);
    tagService = module.get<TagService>(TagService);
    cacheRedisService = module.get<CacheRedisService>(CacheRedisService);
    searchService = module.get<SearchService>(GLOBAL_SEARCH_CLIENT);
    handleIndexIdsSpy = jest.spyOn(service, 'handleIndexIds');
    handleSearchArrayOrStringsSpy = jest.spyOn(service, 'handleSearchArrayOrStrings');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create company', async () => {
    service?.companyRepository?.save.mockReturnValue(Promise.resolve(company));
    service?.companyRepository?.find.mockReturnValueOnce(Promise.resolve([]));
    service?.searchQueue?.add.mockReturnValueOnce(Promise.resolve({ id: 'id' }));
    service?.searchQueue?.getWaitingCount?.mockReturnValueOnce(Promise.resolve(0));

    const result = await service.createCompany(company);
    expect(result).toMatchObject(company);
    expect(service?.companyRepository?.save).toHaveBeenCalledWith(company);
  });

  it('should get companies with default values', async () => {
    service?.globalConnection?.manager.createQueryBuilder.mockReturnValueOnce({
      ...MockQueryBuilder,
      getManyAndCount: jest.fn().mockReturnValueOnce([companies, 1]),
    } as any);

    const [company, count] = await service.getCompanies(companyWithTenant);
    expect(company).toMatchObject(companies);
    expect(count).toBe(1);
  });

  it('should discover companies', async () => {
    service.userService.getUserByExternalId.mockReturnValueOnce({ id: 'user' });
    service?.companyRepository?.createQueryBuilder.mockReturnValueOnce({
      ...MockQueryBuilder,
      getMany: jest.fn().mockReturnValueOnce(companies),
    } as any);

    // company.latestScore = { scoreValue: 1000 } as Score;
    company.latestScore = CompanyProvider.buildDefaultScore();
    company.tenantCompanyRelation = defaultTCR as any;
    company.score = [];

    const result = await service.discoverCompanies(CompanyProvider.buildQueryRequestPayload(), 'stimulus-index');
    const { count } = result;
    expect(count).toBe(1);
    // expect(result.length).toBe(1);

    // check if server run service.handleIndexIds
    jest.spyOn(service, 'handleIndexIds');

    expect(handleIndexIdsSpy).toHaveBeenCalledTimes(1); // Verificar que la función handleIndexIds se haya llamado una vez
    expect(searchService.indexes.use('index_name').search).toHaveBeenCalledWith('*');
    expect(searchService.indexes.use('index_name').buildQuery().top).toHaveBeenCalledWith(20);
    expect(searchService.indexes.use('index_name').buildQuery().orderbyDesc).toHaveBeenCalledWith('created');
  });

  it('should discover companies with options specified', async () => {
    const expectedCompanies: Company[] = CompanyProvider.buildCompanies('id');
    service.userService.getUserByExternalId.mockReturnValueOnce({ id: 'user' });
    service?.companyRepository?.createQueryBuilder.mockReturnValueOnce({
      ...MockQueryBuilder,
      getMany: jest.fn().mockReturnValueOnce(expectedCompanies),
    } as any);
    company.latestScore = CompanyProvider.buildDefaultScore();
    company.tenantCompanyRelation = defaultTCR as any;
    company.score = [];

    const queryRequestPayload = CompanyProvider.buildQueryRequestPayload();
    const newQueryRequestPayload = {
      ...queryRequestPayload,
      search: 'search-name',
      order: { direction: 'ASC', key: 'created' },
    };

    const result = await service.discoverCompanies(newQueryRequestPayload, 'stimulus-index');
    const { count } = result;
    expect(count).toBe(1);

    expect(handleIndexIdsSpy).toHaveBeenCalledTimes(1); // Verificar que la función handleIndexIds se haya llamado una vez
    expect(handleSearchArrayOrStringsSpy).toHaveBeenCalled(); // Verificar que la función handleSearchArrayOrStrings se haya llamado una vez

    expect(searchService.indexes.use('index_name').search).toHaveBeenCalledWith('("search-name" || search\\-name*)');
    expect(searchService.indexes.use('index_name').buildQuery().orderbyAsc).toHaveBeenCalledWith('created');
  });

  it('should get company by id', async () => {
    service?.globalConnection?.createQueryBuilder?.mockReturnValueOnce({
      ...MockQueryBuilder,
      getOne: jest.fn().mockReturnValueOnce(company),
    } as any);

    service?.evaluationService?.getCompanyEvaluations.mockReturnValueOnce({} as any);
    service?.industryService?.getCompanyIndustriesByTenant.mockReturnValueOnce([] as any);

    const { results, count } = await service.getCompany(1);
    expect(results[0]).toMatchObject(company);
    expect(count).toBe(1);
    expect(service.cacheRedisService.get).toHaveBeenCalledWith('company_1_tenantId');
    expect(service.reqContextResolutionService.getTenantId).toHaveBeenCalled();
    expect(service.globalConnection.createQueryBuilder).toHaveBeenCalledWith(expect.any(Function), 'company');
  });

  it.skip('should get companies with pagination', async () => {
    const result = await service.getCompanies(companyWithTenant, { limit: 20, page: 3 });
    const company = result[0];
    const count = result[1];
    expect(company).toMatchObject(companies);
    expect(count).toBe(1);
    expect(entityManager.createQueryBuilder().limit).toHaveBeenCalledWith(20);
    expect(entityManager.createQueryBuilder().offset).toHaveBeenCalledWith(40);
  });

  it.skip('should get companies with order specified', async () => {
    const result = await service.getCompanies(companyWithTenant, { limit: 10, page: 0 }, CompanyProvider.buildOrder());
    const company = result[0];
    const count = result[1];
    expect(company).toMatchObject(companies);
    expect(count).toBe(1);
    expect(entityManager.createQueryBuilder().orderBy).toHaveBeenCalledWith({ created: 'DESC' });
  });

  it.skip('should get companies with options specified', async () => {
    const result = await service.getCompanies(companyWithTenant, { limit: 10, page: 0 }, CompanyProvider.buildOrder(), {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idIn: ['some-id'],
    });
    const company = result[0];
    const count = result[1];
    expect(company).toMatchObject(companies);
    expect(count).toBe(1);
    expect(entityManager.createQueryBuilder().andWhere).toHaveBeenCalledWith('company.id IN (:...companyIds)', {
      companyIds: ['some-id'],
    });
  });

  it.skip('should update company', async () => {
    service?.companyRepository?.findOneOrFail.mockReturnValueOnce(Promise.resolve(company));
    service?.companyRepository?.save.mockReturnValueOnce(Promise.resolve(company));
    service?.tagService?.getTagsObjsByCompanyId.mockReturnValueOnce({ values: company.tags } as any);

    const options = { dataTraceSource: DataTraceSource.BUYER, meta: { userId: 'some-user-id' } };
    const result = await service.updateCompany('id', company, options);
    expect(result).toStrictEqual(company);
    expect(service?.companyRepository?.findOneOrFail).toHaveBeenCalled();
    expect(internalEventService.dispatchInternalEvent).toHaveBeenCalled();
    expect(tagService.getTagsObjsByCompanyId).toHaveBeenCalledWith(company.id);
    expect(cacheRedisService.set).toHaveBeenCalled();
  });

  it.skip('should get distinct diverse ownership', async () => {
    const result = await service.getDistinctDiverseOwnership();
    expect(result).toStrictEqual({ values: [] });
    expect(repository.createQueryBuilder().select).toHaveBeenCalledWith('diverseOwnership');
    expect(repository.createQueryBuilder().groupBy).toHaveBeenCalledWith('diverseOwnership');
  });

  it('handle parent taxId', async () => {
    const parentTaxId = 'parentTaxId';
    service.companyRepository.findOne.mockReturnValueOnce({ ...company, taxIdNo: parentTaxId });
    service.companyRepository.save.mockReturnValueOnce({ taxIdNo: parentTaxId });
    const parentCompany = await service.handleParentTaxId(parentTaxId);
    expect(parentCompany).toMatchObject({ ...company, taxIdNo: parentTaxId });
  });

  it('add date years', async () => {
    const date = new Date();
    const years = 1;
    const dateCopy = new Date(date);
    dateCopy.setFullYear(dateCopy.getFullYear() + years);
    const result = await service.addDateYears(date, years);
    expect(result).toMatchObject(dateCopy);
  });

  it('should check data internal dashboard', async () => {
    service?.reqContextResolutionService?.getTenantId.mockReturnValueOnce('tenantId');
    service?.companyRepository?.createQueryBuilder.mockReturnValueOnce({
      ...MockQueryBuilder,
      getCount: jest.fn().mockReturnValueOnce(1),
    } as any);

    const result = await service.checkDataInternalDashboard();
    expect(result).toStrictEqual([true, 1, undefined]);
  });

  it('should get distinct minority ownership', async () => {
    service?.minorityOwnershipDetailService?.findAll.mockReturnValueOnce([]);
    const result = await service.getDistinctMinoryOwnership();
    expect(result).toStrictEqual({ values: [] });
    expect(service?.minorityOwnershipDetailService?.findAll).toHaveBeenCalled();
  });
});
