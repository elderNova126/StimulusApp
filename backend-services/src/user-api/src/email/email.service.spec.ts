import { Test, TestingModule } from '@nestjs/testing';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: StimulusLogger,
          useValue: {
            error: jest.fn(),
          },
        },
        { provide: 'DataService', useValue: {} },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
