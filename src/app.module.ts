import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SeedModule } from './seed/seed.module';
import typeorm from './config/typeorm.config';
import { Champion } from './entity/champion.entity';
import { ItemEntity } from './entity/item.entity';
import { SpellEntity } from './entity/spell.entity';
import { RiotModule } from './riot/riot.module';
import { ChampItemEntity } from './entity/champ_item.entity';
import { ChampSkillEntity } from './entity/champ_skill.entity';
import { ChampionWinEntity } from './entity/champion_win.entity';
import { RuneMainEntity } from './entity/rune_main.entity';
import { RuneStatEntity } from './entity/rune_stat.entity';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 3,
      }),
    }),
    TypeOrmModule.forFeature([
      Champion,
      ItemEntity,
      SpellEntity,
      ChampItemEntity,
      ChampSkillEntity,
      ChampionWinEntity,
      RuneMainEntity,
      RuneStatEntity,
    ]),
    SeedModule,
    RiotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
