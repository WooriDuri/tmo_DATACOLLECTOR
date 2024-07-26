import { Injectable } from '@nestjs/common';
import { ChampSkillEntity } from 'src/entity/champ_skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    private readonly championSkillRepository: Repository<ChampSkillEntity>,
  ) {}
}
