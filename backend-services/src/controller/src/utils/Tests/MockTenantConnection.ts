import { CompanyProvider } from 'src/company/company.provider';
import { DataPoint } from 'src/data-point/data-point.entity';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { CompanyEvaluation } from 'src/evaluation/company-evaluation.entity';
import { TenantCompany } from 'src/tenant/tenant-company.entity';
import { ProjectProvider } from '../../project/project.provider';
const company = CompanyProvider.buildCompany('id');
const companies = CompanyProvider.buildCompanies('id');
const projectCompany = ProjectProvider.buildProjectCompanies(1, 'id');

const transactionEntityManager: any = {
  save: jest.fn().mockReturnValue(Promise.resolve(company)),
  startTransaction: jest.fn().mockReturnThis(),
  loadAllRelationIds: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoinAndMapOne: jest.fn().mockReturnThis(),
  manager: {
    createQueryBuilder: jest.fn().mockReturnThis(),
    startTransaction: jest.fn().mockReturnThis(),
    transaction: jest.fn().mockReturnThis(),
    loadAllRelationIds: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
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
    findAndCount: jest.fn().mockReturnValue(Promise.resolve({ projectCompaniesResult: projectCompany, count: 1 })),
  },
  release: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
  findAndCount: jest.fn().mockReturnValue(Promise.resolve({ projectCompaniesResult: projectCompany, count: 1 })),
};
export const repositoryMock: any = {
  save: jest.fn().mockReturnValue(Promise.resolve(company)),
  startTransaction: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndMapOne: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  transaction: jest.fn().mockReturnThis(),
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
  find: jest.fn().mockReturnValueOnce(new CompanyEvaluation()),
  findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
  findAndCount: jest.fn().mockReturnValue(Promise.resolve({ projectCompaniesResult: projectCompany, count: 1 })),
};

const TenantConnectionMock = {
  provide: TENANT_CONNECTION,
  useValue: {
    getRawMany: jest.fn().mockReturnValue([]),
    getMany: jest.fn().mockReturnValue(Promise.resolve(companies)),
    find: jest.fn().mockReturnValueOnce(new CompanyEvaluation()),
    findOne: jest.fn().mockReturnValueOnce(new TenantCompany()).mockReturnValueOnce(new DataPoint()),
    createQueryRunner: jest.fn().mockReturnValue(transactionEntityManager),
    transaction: jest.fn().mockReturnValue(transactionEntityManager),
    getRepository: jest.fn().mockReturnValue(repositoryMock),
  },
};
export default TenantConnectionMock;
