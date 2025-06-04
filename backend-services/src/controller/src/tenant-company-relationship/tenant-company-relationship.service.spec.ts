import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { CompanyProvider } from '../company/company.provider';
import { TenantCompanyRelationshipService } from './tenant-company-relationship.service';

describe('TenantCompanyRelationshipService', () => {
  const company = CompanyProvider.buildCompanyWithTenant();
  let service: TenantCompanyRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantCompanyRelationshipService,
        {
          provide: ReqContextResolutionService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user'),
            getTenantId: jest.fn().mockReturnValue('tenantId'),
            find: jest.fn(),
          },
        },
        {
          provide: TenantCompanyRelationshipService,
          useValue: {
            getCompanyRelationByCompanyId: jest.fn(),
            getTenantCompanyRelation: jest.fn(),
            saveTenantCompanyRelation: jest.fn(),
            updateTenantCompanyRelation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve(TenantCompanyRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get tenants relationships', async () => {
    const result = await service.getTenantCompanyRelation(company.tenantCompanyRelation);
    expect(service.getTenantCompanyRelation).toHaveBeenCalledWith(company.tenantCompanyRelation);
    expect(result).toStrictEqual(company.tenantCompanyRelation[0]);
  });
});
