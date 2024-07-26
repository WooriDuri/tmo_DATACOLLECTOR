import { Module } from '@nestjs/common';
import { SpellService } from './spell.service';
import { SpellEntity } from 'src/entity/spell.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SpellEntity])],
  providers: [SpellService],
})
export class SpellModule {}
