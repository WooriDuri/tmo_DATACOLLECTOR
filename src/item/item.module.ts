import { Module, forwardRef } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemEntity } from 'src/entity/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { ChampItemEntity } from 'src/entity/champ_item.entity';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([ChampItemEntity]),
  ],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
