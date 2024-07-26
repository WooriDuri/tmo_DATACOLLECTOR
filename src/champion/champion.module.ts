import { ChampionWinEntity } from './../entity/champion_win.entity';
import { Module } from '@nestjs/common';
import { ChampionService } from './champion.service';
import { Champion } from 'src/entity/champion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Champion, ChampionWinEntity])],
  providers: [ChampionService],
})
export class ChampionModule {}
