import { Test, TestingModule } from '@nestjs/testing';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

describe('EmailController', () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
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

    controller = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
