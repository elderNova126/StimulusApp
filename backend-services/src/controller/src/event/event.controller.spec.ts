import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';

describe('Event Controller', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
