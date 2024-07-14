import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from 'src/entity/champion.entity';
import { ItemEntity } from 'src/entity/item.entity';
import { SpellEntity } from 'src/entity/spell.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Champion, ItemEntity, SpellEntity]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 3,
      }),
    }),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
