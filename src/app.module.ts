import { CacheModule, Module } from '@nestjs/common';
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
import { ChampionModule } from './champion/champion.module';
import { ItemModule } from './item/item.module';
import { RuneModule } from './rune/rune.module';
import { SpellModule } from './spell/spell.module';
import { SkillModule } from './skill/skill.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 3000,
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
    ChampionModule,
    ItemModule,
    RuneModule,
    SpellModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
