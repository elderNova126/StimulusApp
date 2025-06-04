import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { CompanyNoteService } from './company-note.service';

describe('CompanyNoteService', () => {
  let service: CompanyNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyNoteService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
      ],
    }).compile();

    service = module.get<CompanyNoteService>(CompanyNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
