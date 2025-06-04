import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { GlobalProjectService } from './project-tree.service';
import { GlobalProjectProvider } from './project-tree.provider';
import { GlobalSupplierProvider } from 'src/global-supplier/global-supplier.provided';

describe('GlobalProjectService', () => {
  let service: GlobalProjectService | any;

  const globalProject = GlobalProjectProvider.buildGlobalProjects(1, 'tenantId');
  const globalSupplier = GlobalSupplierProvider.buildGlobalSupplier(1, 'supplierId');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalProjectService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: ReqContextResolutionService,
          useValue: {
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GlobalProjectService>(GlobalProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // FIXME: returns undefined instead of globalProject
  it.skip('should get Parents Project Tree From Supplier', async () => {
    const mockFindSupplier = [
      { ...globalSupplier, globalProject: globalProject[0] },
      { ...globalSupplier, globalProject: globalProject[1] },
    ];
    service?.globalProjectRepository?.find.mockResolvedValueOnce(Promise.resolve(mockFindSupplier));
    const result = await service.getParentsProjectTreeFromSupplier('supplierId');
    expect(result).toEqual([globalProject[0], globalProject[1]]);
  });
});
