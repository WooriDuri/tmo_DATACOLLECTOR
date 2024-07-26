import { Injectable } from '@nestjs/common';
import { Champion } from 'src/entity/champion.entity';
import { ChampionWinEntity } from 'src/entity/champion_win.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChampionService {
  constructor(
    private readonly championRepository: Repository<Champion>,
    private readonly championWinRepository: Repository<ChampionWinEntity>,
  ) {}
}
