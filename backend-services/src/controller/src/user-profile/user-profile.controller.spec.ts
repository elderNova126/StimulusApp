import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';

describe('UserProfile Controller', () => {
  let controller: UserProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
