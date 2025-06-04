import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CompanyService } from './company.service';
import { CompanyProvider } from './company.provider';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';

describe('Company Controller', () => {
  const company = CompanyProvider.buildCompany('id');
  const companies = CompanyProvider.buildCompanies('id');

  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            createCompany: jest.fn().mockReturnValue(Promise.resolve(company)),
            getDistinctTags: jest.fn(),
            getDistinctDiverseOwnership: jest.fn(),
            getCompanies: jest.fn().mockReturnValue(Promise.resolve([companies, 1])),
            updateCompany: jest.fn().mockReturnValue(Promise.resolve(company)),
            deleteCompany: jest.fn().mockReturnValue(Promise.resolve(CompanyProvider.buildDeleteResult())),
            discoverCompanies: jest.fn().mockReturnValue(Promise.resolve({ results: companies, count: 1 })),
          },
        },
        {
          provide: StimulusLogger,
          useValue: jest.fn(),
        },
      ],
    })
      .overrideInterceptor(LoggingInterceptor)
      .useValue(jest.fn())
      .compile();
    controller = moduleRef.get<CompanyController>(CompanyController);
    service = moduleRef.get<CompanyService>(CompanyService);
  });

  it.skip('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it.skip('should search companies and return', async () => {
    const result = await controller.searchCompanies({});
    expect(result.results).toStrictEqual(companies);
    expect(result.count).toBe(1);
  });

  it.skip('should get distinct diverse ownership', async () => {
    controller.getDistinctDiverseOwnership({});
    expect(service.getDistinctDiverseOwnership).toHaveBeenCalledTimes(1);
  });

  it.skip('should update a company and return', async () => {
    const result = await controller.updateCompany({ company: company });
    expect(result).toStrictEqual(company);
  });

  it.skip('should delete company', async () => {
    const { done } = await controller.deleteCompany({ id: 'id' });
    expect(done).toBeTruthy();
  });

  it.skip('should discover companies and return', async () => {
    const result = await controller.discoverCompanies(CompanyProvider.buildQueryRequestPayload());
    expect(result.results).toStrictEqual(companies);
    expect(result.count).toBe(1);
  });
});
