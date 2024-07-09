import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Champion } from 'src/entity/champion.entity';
import { Repository } from 'typeorm';
import * as itemData from './item.json';
import * as championData from './champion.json';
import { ItemEntity } from 'src/entity/item.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async insertData(): Promise<Champion[]> {
    try {
      const champions = Object.entries(championData.data).map(
        ([id, value]) => ({
          champ_id: Number(value.key),
          name: value.name,
          e_name: value.id,
        }),
      );
      console.log(champions);
      return await this.championRepository.save(champions);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async insertItemData() {
    try {
      const items = Object.entries(itemData.data).map(([id, value]) => {
        return {
          item_id: Number(id),
          name: value.name,
          into: 'into' in value ? (value.into ? 1 : 0) : 0,
        };
      });
      return await this.itemRepository.save(items);
      return items;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
