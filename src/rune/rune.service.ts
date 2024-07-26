import { Injectable } from '@nestjs/common';
import { RuneMainEntity } from 'src/entity/rune_main.entity';
import { RuneStatEntity } from 'src/entity/rune_stat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RuneService {
  constructor(
    private readonly runeMainRepository: Repository<RuneMainEntity>,
    private readonly runeStatRepository: Repository<RuneStatEntity>,
  ) {}
}
