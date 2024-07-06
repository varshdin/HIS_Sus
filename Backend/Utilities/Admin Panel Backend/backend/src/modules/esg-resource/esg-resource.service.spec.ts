import { Test, TestingModule } from '@nestjs/testing';
import { EsgResourceService } from './esg-resource.service';

describe('EsgResourceService', () => {
  let service: EsgResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsgResourceService]
    }).compile();

    service = module.get<EsgResourceService>(EsgResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
