import { ChampionWinEntity } from './../entity/champion_win.entity';
import { Module, forwardRef } from '@nestjs/common';
import { ChampionService } from './champion.service';
import { Champion } from 'src/entity/champion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([Champion, ChampionWinEntity]),
  ],
  providers: [ChampionService],
  exports: [ChampionService],
})
export class ChampionModule {}
