import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemEntity } from 'src/entity/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ItemService],
})
export class ItemModule {}
