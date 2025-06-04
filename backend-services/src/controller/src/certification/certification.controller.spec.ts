import { Test, TestingModule } from '@nestjs/testing';
import { CertificationController } from './certification.controller';

describe('Certification Controller', () => {
  let controller: CertificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificationController],
    }).compile();

    controller = module.get<CertificationController>(CertificationController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
