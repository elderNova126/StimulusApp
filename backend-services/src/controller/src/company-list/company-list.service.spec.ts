import { Test, TestingModule } from '@nestjs/testing';
import { CompanyListService } from 'src/company-list/company-list.service';
import { ConnectionProviderService } from 'src/database/connection-provider.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { globalConnectionMock, MockQueryBuilder, tenantConnectionMock } from 'test/typeormConnectionMock';
import { CompanyProvider } from '../company/company.provider';
import { CompanyListProvider } from './company-list.provider';

describe('CompanyService', () => {
  const companyList = CompanyListProvider.buildCompanyListById(1);
  let connectionProviderService: ConnectionProviderService;
  let service: CompanyListService | any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyListService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: InternalEventService,
          useValue: {
            dispatchInternalEvent: jest.fn(),
          },
        },
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: ConnectionProviderService,
          useValue: {
            getTenantConnection: jest.fn().mockResolvedValue(tenantConnectionMock),
          },
        },
      ],
    }).compile();

    service = await module.resolve(CompanyListService);
    connectionProviderService = module.get<ConnectionProviderService>(ConnectionProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return company list', async () => {
    const filters = companyList;
    const order = {};
    const pagination = {};

    service.companyListRepository.findAndCount = jest.fn().mockResolvedValueOnce([[companyList], 1]);

    const { results, count } = await service.getCompanyLists(filters, order, pagination);
    expect(results).toMatchObject([companyList]);
    expect(count).toBe(1);
    expect(service.companyListRepository.findAndCount).toHaveBeenCalled();
  });

  it('should return company list by tenant', async () => {
    const tenantConnectionMock = {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValueOnce(companyList),
      }),
    };
    connectionProviderService.getTenantConnection = jest.fn().mockResolvedValueOnce(tenantConnectionMock);

    const result = await service.getCompanyListsByTenant('tenant-id', 1);
    expect(result).toMatchObject(companyList);
    expect(connectionProviderService.getTenantConnection).toHaveBeenCalled();
    const getRepositorySpyOn = jest.spyOn(tenantConnectionMock, 'getRepository');
    expect(getRepositorySpyOn).toHaveBeenCalled();
  });

  it('should create company list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const companyListRepository = {
      save: jest.fn().mockResolvedValueOnce(companyList),
    };
    service.companyListRepository = companyListRepository;
    const result = await service.createCompanyList(companyList);
    expect(result).toMatchObject(companyList);
    expect(companyListRepository.save).toHaveBeenCalled();
  });

  it('should return clone list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const expectedSaved = {
      id: 2,
      name: `${companyList.name} (copy)`,
      companies: [],
    };
    const companyListRepository = {
      save: jest.fn().mockResolvedValueOnce(expectedSaved),
      findOneOrFail: jest.fn().mockResolvedValueOnce(companyList),
    };
    service.companyListRepository = companyListRepository;

    const result = await service.cloneCompanyList(companyList.id, companyList.name, 'user-id');

    expect(result).toMatchObject(expectedSaved);
    // check name company list
    expect(result.name).toBe(`${companyList.name} (copy)`);
    expect(companyListRepository.save).toHaveBeenCalled();
  });

  it('should update company list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const updates = {
      ...companyList,
      name: 'new new new new name',
      companies: ['company1', 'company2'],
    };

    const companyListRepository = {
      save: jest.fn().mockResolvedValueOnce({ ...companyList, ...updates }),
      findOneOrFail: jest.fn().mockResolvedValueOnce({ ...companyList, createdBy: 'user-id' }),
    };
    service.companyListRepository = companyListRepository;

    const result = await service.updateCompanyList(companyList.id, updates, 'user-id');
    expect(result).toMatchObject({ ...companyList, ...updates });
    expect(companyListRepository.save).toHaveBeenCalled();
  });

  it('should add company to list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const companyIds = ['newCompanyList1', 'newCompanyList2'];
    const companyListRepository = {
      save: jest.fn().mockResolvedValueOnce({ ...companyList, companies: [...companyIds] }),
      findOneOrFail: jest.fn().mockResolvedValueOnce(companyList),
    };
    service.companyListRepository = companyListRepository;

    service?.companyRepository?.createQueryBuilder.mockReturnValueOnce({
      ...MockQueryBuilder,
      getMany: jest
        .fn()
        .mockReturnValueOnce([
          CompanyProvider.buildCompany('newCompanyList1'),
          CompanyProvider.buildCompany('newCompanyList1'),
        ]),
    } as any);

    const result = await service.addToCompanyList(companyList.id, companyIds, 'createdBy');

    expect(result).toMatchObject({ ...companyList, companies: [...companyIds] });
    expect(companyListRepository.save).toHaveBeenCalled();
    expect(service.eventService.dispatchInternalEvent).toHaveBeenCalledTimes(2);
  });

  it('should remove company from shared list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const companyIds = ['newCompanyList1', 'newCompanyList2'];
    const tenantConnectionMock = {
      getRepository: jest.fn().mockReturnValue({
        findOneOrFail: jest.fn().mockResolvedValueOnce({ ...companyList, companies: companyIds }),
        save: jest.fn().mockResolvedValueOnce({ ...companyList, companies: [] }),
      }),
    };

    connectionProviderService.getTenantConnection = jest.fn().mockResolvedValueOnce(tenantConnectionMock);
    const data = { id: companyList.id, companyIds, userId: 'createdBy', tenantId: 'tenant-id' };
    const result = await service.removeFromCompanyList(data);

    expect(result).toMatchObject({ ...companyList, companies: [] });
    expect(tenantConnectionMock.getRepository).toHaveBeenCalled();
    expect(service.eventService.dispatchInternalEvent).toHaveBeenCalledTimes(2);
  });

  it('should remove company from custom list', async () => {
    const companyList = CompanyListProvider.buildCompanyListById(1);
    const companyIds = ['newCompanyList1', 'newCompanyList2'];

    service?.companyListRepository?.findOneOrFail?.mockReturnValueOnce({ ...companyList, companies: companyIds });
    service?.companyListRepository?.save?.mockReturnValueOnce({ ...companyList, companies: [] });

    const data = { id: companyList.id, companyIds, userId: 'createdBy' };
    const result = await service.removeFromCompanyList(data);

    expect(result).toMatchObject({ ...companyList, companies: [] });
    expect(tenantConnectionMock.getRepository).toHaveBeenCalled();
    expect(service.eventService.dispatchInternalEvent).toHaveBeenCalledTimes(2);
  });

  it('should remove company list', async () => {
    service.companyListRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce(CompanyListProvider.buildCompanyListById(1));
    service.companyListRepository.remove = jest.fn().mockResolvedValueOnce({
      raw: { affectedRows: 1 },
    });
    await service.deleteCompanyList(1, 'createdBy');

    expect(service.companyListRepository.findOne).toHaveBeenCalled();
    expect(service.companyListRepository.remove).toHaveBeenCalled();
  });
});
