import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {
  let service: AttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
      ],
    }).compile();

    service = module.get<AttachmentService>(AttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
