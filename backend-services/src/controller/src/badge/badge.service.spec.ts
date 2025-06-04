import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { CompanyListService } from 'src/company-list/company-list.service';
import { CompanyNoteService } from 'src/company-note/company-note.service';
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
import { GLOBAL_SEARCH_CLIENT } from 'src/search/search.constants';
import { TagService } from 'src/tag/tag.service';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { TenantService } from 'src/tenant/tenant.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserService } from 'src/user/user.service';
import GlobalSearchMock from 'src/utils/Tests/GlobalSearchMock';
import { cacheRedisMock } from 'test/cacheRedisMock';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { BadgeProvider } from './badge.provider';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  const badge = BadgeProvider.buildBadge('id');

  let service: BadgeService | any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: GLOBAL_SEARCH_CLIENT,
          useValue: GlobalSearchMock,
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
          },
        },
        {
          provide: MinorityOwnershipDetailService,
          useValue: {
            getMinorityOwnershipByCompanyId: jest.fn().mockReturnValueOnce({ values: [] } as any),
          },
        },
        {
          provide: TagService,
          useValue: {},
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
      ],
    }).compile();

    service = await module.resolve(BadgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create company', async () => {
    service?.badgeRepository?.save.mockReturnValueOnce(Promise.resolve(badge));
    service?.badgeRepository?.findAndCount.mockReturnValueOnce(Promise.resolve([[], 0]));
    service?.badgeRepository?.find.mockReturnValueOnce(Promise.resolve([]));

    const result = await service.createBadge(badge);
    expect(result).toMatchObject(badge);
    expect(service?.badgeRepository?.save).toHaveBeenCalledWith(badge);
  });

  it('should get badges', async () => {
    service.reqContextResolutionService.getTenantId.mockReturnValue('test_tenant_id');
    service?.badgeRepository?.findAndCount.mockReturnValueOnce(Promise.resolve([[badge], 1]));
    const result = await service.getBadges();
    expect(service.reqContextResolutionService.getTenantId).toHaveBeenCalled();
    expect(result).toEqual([[badge], 1]);
  });

  it('should create a badge tenant relationship', async () => {
    const badgeTenantRelationship: any = {
      id: '1',
      badgeId: '1',
      tenantCompanyRelationshipId: '1',
    };
    service.badgeTenantCompanyRelationshipRepository.create = jest.fn().mockReturnValue(badgeTenantRelationship);
    service.badgeTenantCompanyRelationshipRepository.save = jest.fn().mockResolvedValue(badgeTenantRelationship);
    const result = await service.createBadgeTenantRelationship(badgeTenantRelationship);

    expect(result).toEqual(badgeTenantRelationship);
    expect(service.badgeTenantCompanyRelationshipRepository.create).toHaveBeenCalledWith({
      badgeId: badgeTenantRelationship.badgeId,
      tenantCompanyRelationshipId: badgeTenantRelationship.tenantCompanyRelationshipId,
      badgeDate: badgeTenantRelationship.badgeDate,
    });
    expect(service.badgeTenantCompanyRelationshipRepository.save).toHaveBeenCalledWith(badgeTenantRelationship);
  });
});
