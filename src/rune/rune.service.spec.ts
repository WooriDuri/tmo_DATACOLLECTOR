import { Test, TestingModule } from '@nestjs/testing';
import { RuneService } from './rune.service';

describe('RuneService', () => {
  let service: RuneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuneService],
    }).compile();

    service = module.get<RuneService>(RuneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
