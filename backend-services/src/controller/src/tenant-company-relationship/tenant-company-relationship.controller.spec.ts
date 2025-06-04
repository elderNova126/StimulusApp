import { Test, TestingModule } from '@nestjs/testing';
import { TenantCompanyRelationshipController } from './tenant-company-relationship.controller';

describe('TenantCompanyRelationship Controller', () => {
  let controller: TenantCompanyRelationshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantCompanyRelationshipController],
    }).compile();

    controller = module.get<TenantCompanyRelationshipController>(TenantCompanyRelationshipController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
