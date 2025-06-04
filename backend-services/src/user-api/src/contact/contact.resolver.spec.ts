import { Test, TestingModule } from '@nestjs/testing';
import { ContactResolver } from './contact.resolver';

describe('ContactResolver', () => {
  let resolver: ContactResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactResolver],
    }).compile();

    resolver = module.get<ContactResolver>(ContactResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
