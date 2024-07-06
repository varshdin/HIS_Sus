import { Test, TestingModule } from '@nestjs/testing';
import { EsgResourceController } from './esg-resource.controller';

describe('EsgResourceController', () => {
  let controller: EsgResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EsgResourceController],
    }).compile();

    controller = module.get<EsgResourceController>(EsgResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
