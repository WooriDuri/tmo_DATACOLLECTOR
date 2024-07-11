import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from 'src/entity/champion.entity';
import { ItemEntity } from 'src/entity/item.entity';
import { SpellEntity } from 'src/entity/spell.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Champion, ItemEntity, SpellEntity])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
