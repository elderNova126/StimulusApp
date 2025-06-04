import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProvider } from 'src/company/company.provider';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { CompanyNames, CompanyNameType } from './company-names.entity';
import { CompanyNamesService } from './company-names.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';

describe('CompanyNamesService', () => {
  let service: CompanyNamesService | any;
  const castValue = '| ';
  const company = CompanyProvider.buildCompany('id-company');
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyNamesService,
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
      ],
    }).compile();
    service = module.get<CompanyNamesService>(CompanyNamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save "PREVIOUS" names', async () => {
    const names = ['name1', 'name2'];
    const namesEntity = names.map((name) => ({ type: CompanyNameType.PREVIOUS, name, company }) as CompanyNames);
    service?.namesRepository?.save?.mockResolvedValueOnce(Promise.resolve(namesEntity));

    const result = await service.saveCompanyNames(company, CompanyNameType.PREVIOUS, names);
    expect(result).toEqual(namesEntity);
    expect(service?.namesRepository?.save).toHaveBeenCalledTimes(1);
  });

  it('should save "OTHER" names', async () => {
    const names = ['other1', 'other2'];
    const namesEntity = names.map((name) => ({ type: CompanyNameType.OTHER, name, company }));
    service?.namesRepository?.save?.mockResolvedValueOnce(Promise.resolve(namesEntity));
    const result = await service.saveCompanyNames(company, CompanyNameType.OTHER, names);
    expect(result).toEqual(namesEntity);
    expect(service?.namesRepository?.save).toHaveBeenCalledTimes(1);
  });

  it('should update "PREVIOUS" names', async () => {
    const names = ['name1', 'name2'];
    const namesEntity = names.map((name) => ({ type: CompanyNameType.PREVIOUS, name, company }));
    service?.namesRepository?.delete?.mockResolvedValueOnce(Promise.resolve({}));
    service?.namesRepository?.save?.mockResolvedValueOnce(Promise.resolve(namesEntity));

    const result = await service.UpdateNames(company, CompanyNameType.PREVIOUS, names.join(castValue));
    expect(result).toEqual(namesEntity);
    expect(service?.namesRepository?.delete).toHaveBeenCalledTimes(1);
    expect(service?.namesRepository?.save).toHaveBeenCalledTimes(1);
  });

  it('should update "OTHER" names', async () => {
    const names = ['other1', 'other2'];
    const namesEntity = names.map((name) => ({ type: CompanyNameType.OTHER, name, company }));
    service?.namesRepository?.delete?.mockResolvedValueOnce(Promise.resolve({}));
    service?.namesRepository?.save?.mockResolvedValueOnce(Promise.resolve(namesEntity));
    const result = await service.UpdateNames(company, CompanyNameType.OTHER, names.join(castValue));
    expect(result).toEqual(namesEntity);
    expect(service?.namesRepository?.delete).toHaveBeenCalledTimes(1);
    expect(service?.namesRepository?.save).toHaveBeenCalledTimes(1);
  });

  it('should Update to empty "PREVIOUS" names', async () => {
    const names = '| ';
    const namesEntity = { type: CompanyNameType.PREVIOUS, name: names, company };
    service?.namesRepository?.delete?.mockResolvedValueOnce(Promise.resolve({}));
    service?.namesRepository?.save?.mockResolvedValueOnce(Promise.resolve(namesEntity));

    const result = await service.UpdateNames(company, CompanyNameType.PREVIOUS, names);
    expect(result).toEqual([]);
    expect(service?.namesRepository?.delete).toHaveBeenCalledTimes(1);
  });
});
