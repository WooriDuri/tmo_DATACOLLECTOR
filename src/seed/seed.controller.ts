import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Champion } from 'src/entity/champion.entity';
import { ItemEntity } from 'src/entity/item.entity';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('champion')
  async insertData(): Promise<Champion[]> {
    return this.seedService.insertData();
  }

  @Post('item')
  async insertItemData(): Promise<ItemEntity[]> {
    return this.seedService.insertItemData();
  }

  @Post('spell')
  async insertSpellData() {
    return this.seedService.insertSpellData();
  }

  @Post('test')
  async test() {
    return this.seedService.test();
  }
}
