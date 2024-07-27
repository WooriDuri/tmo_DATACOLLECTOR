import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpellEntity } from 'src/entity/spell.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpellService {
  constructor(
    @InjectRepository(SpellEntity)
    private readonly spellRepository: Repository<SpellEntity>,
  ) {}
}
