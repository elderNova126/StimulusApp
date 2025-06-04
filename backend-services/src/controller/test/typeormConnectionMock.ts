import { SelectQueryBuilder } from 'typeorm';

const MockQueryBuilder: Partial<SelectQueryBuilder<any>> = {
  getMany: jest.fn().mockReturnThis(),
  loadAllRelationIds: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoinAndMapOne: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockReturnThis(),
  getRawOne: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoinAndMapOne: jest.fn().mockReturnThis(),
  innerJoinAndMapMany: jest.fn().mockReturnThis(),
  leftJoinAndMapMany: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnValue({ affected: 1 }),
  delete: jest.fn().mockReturnValue({ affected: 1 }),
};
const repositoryMock = {
  findOneOrFail: jest.fn(),
  findAndCount: jest.fn(),
  findByIds: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn().mockReturnValue({ affected: 1 }),
  createQueryBuilder: jest.fn().mockImplementation(() => MockQueryBuilder),
};

const tenantConnectionMock = {
  // Mocked methods and properties of the Connection object
  getRepository: jest.fn().mockImplementation(() => repositoryMock),
  manager: {
    transaction: jest.fn(),
    // ... add other required properties and methods here
  },
  // ... add other required properties and methods here
};

const globalConnectionMock = {
  // Mocked methods and properties of the Connection object
  getRepository: jest.fn().mockImplementation(() => repositoryMock),
  getCustomRepository: jest.fn().mockImplementation(() => ({
    // Mocked Repository methods and properties
    findAndCount: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    findOne: jest.fn(),
    findByIds: jest.fn(),
    save: jest.fn(),
  })),

  getTreeRepository: jest.fn().mockImplementation(() => ({
    createQueryBuilder: jest.fn().mockImplementation(() => MockQueryBuilder),
    findTrees: jest.fn(),
    findDescendants: jest.fn(),
    findAncestors: jest.fn(),
    ...repositoryMock,
    // Mocked Repository methods and properties
  })),

  manager: {
    transaction: jest.fn(),
    createQueryBuilder: jest.fn().mockImplementation(() => MockQueryBuilder),
    getRepository: jest.fn().mockReturnThis(),
    // ... add other required properties and methods here
  },
  createQueryBuilder: jest.fn().mockImplementation(() => MockQueryBuilder),
  loadAllRelationIds: jest.fn().mockReturnThis(),
  // ... add other required properties and methods here
};

export { tenantConnectionMock, globalConnectionMock, MockQueryBuilder, repositoryMock };
