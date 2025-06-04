import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { SEARCH_QUEUE } from 'src/search/search.constants';
import { globalConnectionMock, MockQueryBuilder } from 'test/typeormConnectionMock';
import { IndustryService } from './industry.service';
import { industryProvider } from './industry.provider';

describe('IndustryService', () => {
  let service: IndustryService | any;

  const industries = industryProvider.buildGlobalProjects(['industry1', 'industry2'], 'companyId', 'tenantId');
  const industriesWithOutCompany = industryProvider.buildWithOutCompany(industries);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustryService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getQueueToken(SEARCH_QUEUE),
          useValue: {},
        },
        {
          provide: ReqContextResolutionService,
          useValue: {
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
      ],
    }).compile();

    service = module.get<IndustryService>(IndustryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('joinCurrentTenantWithIndustry', async () => {
    const mockQueryBuilder = {
      ...MockQueryBuilder,
      relation: jest.fn().mockReturnThis(),
      of: jest.fn().mockReturnThis(),
      add: jest.fn().mockResolvedValue(industries),
    };
    service?.industryRepository?.createQueryBuilder.mockReturnValueOnce(mockQueryBuilder);
    service.tenantCompanyRepository.find.mockResolvedValueOnce(industries);

    const response = await service.joinCurrentTenantWithIndustry(industries, 'tenantId');
    expect(response).toEqual(industriesWithOutCompany);

    expect(service?.industryRepository?.createQueryBuilder).toHaveBeenCalledTimes(1);
  });

  it('getCompanyIndustriesByTenant', async () => {
    const mockQueryBuilder = {
      ...MockQueryBuilder,
      getMany: jest.fn().mockResolvedValue(industries),
    };
    service?.industryRepository?.createQueryBuilder.mockReturnValueOnce(mockQueryBuilder);
    service.tenantCompanyRepository.find.mockResolvedValueOnce(industries);

    const response = await service.getCompanyIndustriesByTenant([industries[0].id, industries[1].id], 'tenantId');
    expect(response).toEqual(industriesWithOutCompany);

    expect(service?.industryRepository?.createQueryBuilder).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
