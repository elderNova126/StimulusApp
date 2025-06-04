import { Test, TestingModule } from '@nestjs/testing';
import { CompanyListService } from 'src/company-list/company-list.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { UserService } from 'src/user/user.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { SharedListService } from './shared-list.service';
import { EmailService } from 'src/email/email.service';

describe('SharedListService', () => {
  let service: SharedListService;
  // const company = CompanyProvider.buildCompany('id');
  // const companies = CompanyProvider.buildCompanies('id');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedListService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: CompanyListService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: InternalEventService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SharedListService>(SharedListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
