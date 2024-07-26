import { Injectable } from '@nestjs/common';
import { SpellEntity } from 'src/entity/spell.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpellService {
  constructor(private readonly spellRepository: Repository<SpellEntity>) {}
}
