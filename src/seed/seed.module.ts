import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from 'src/entity/champion.entity';
import { ItemEntity } from 'src/entity/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Champion, ItemEntity])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
