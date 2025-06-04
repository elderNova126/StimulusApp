import { CompanyProvider } from 'src/company/company.provider';
import { DataPoint } from 'src/data-point/data-point.entity';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { CompanyEvaluation } from 'src/evaluation/company-evaluation.entity';
import { TenantCompany } from 'src/tenant/tenant-company.entity';

const company = CompanyProvider.buildCompany('id');
const companies = CompanyProvider.buildCompanies('id');

const transactionEntityManager: any = {
  save: jest.fn().mockReturnValue(Promise.resolve(company)),
  startTransaction: jest.fn().mockReturnThis(),
  transaction: jest.fn().mockReturnThis(),
  loadAllRelationIds: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoinAndMapOne: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  manager: {
    createQueryBuilder: jest.fn().mockReturnThis(),
    startTransaction: jest.fn().mockReturnThis(),
    transaction: jest.fn().mockReturnThis(),
    loadAllRelationIds: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndMapOne: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnValue(Promise.resolve({ count: 1 })),
    clone: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnValue([]),
    getMany: jest.fn().mockReturnValue(Promise.resolve(companies)),
    leftJoin: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    findOneOrFail: jest.fn().mockReturnValue(Promise.resolve(company)),
  },
  release: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
};
export const repositoryMock: any = {
  save: jest.fn().mockReturnValue(Promise.resolve(company)),
  startTransaction: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndMapOne: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getRawOne: jest.fn().mockReturnValue(Promise.resolve({ count: 1 })),
  clone: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockReturnValue([]),
  getMany: jest.fn().mockReturnValue(Promise.resolve(companies)),
  getManyAndCount: jest.fn().mockReturnValue(Promise.resolve([companies, companies.length])),
  leftJoin: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  findOneOrFail: jest.fn().mockReturnValue(Promise.resolve(company)),
  find: jest.fn().mockReturnValueOnce(new CompanyEvaluation()),
  findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
};
// eslint-disable-next-line
const GlobalConnectionMock = {
  provide: GLOBAL_CONNECTION,
  useValue: {
    getRawMany: jest.fn().mockReturnValue([]),
    getMany: jest.fn().mockReturnValue(Promise.resolve(companies)),
    getManyAndCount: jest.fn().mockReturnValue(Promise.resolve([companies, companies.length])),
    find: jest.fn().mockReturnValueOnce(new CompanyEvaluation()),
    findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
    createQueryRunner: jest.fn().mockReturnValue(transactionEntityManager),
    getRepository: jest.fn().mockReturnValue(repositoryMock),
  },
};
export default GlobalConnectionMock;
