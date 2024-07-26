import { Module } from '@nestjs/common';
import { RuneService } from './rune.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuneMainEntity } from 'src/entity/rune_main.entity';
import { RuneStatEntity } from 'src/entity/rune_stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RuneMainEntity, RuneStatEntity])],
  providers: [RuneService],
})
export class RuneModule {}
