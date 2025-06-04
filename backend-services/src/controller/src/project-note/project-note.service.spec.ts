import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { ProjectNoteService } from './project-note.service';

describe('ProjectNoteService', () => {
  let service: ProjectNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectNoteService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
      ],
    }).compile();

    service = module.get<ProjectNoteService>(ProjectNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
