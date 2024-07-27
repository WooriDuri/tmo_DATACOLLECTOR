import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { ChampItemEntity } from 'src/entity/champ_item.entity';
import { ItemEntity } from 'src/entity/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ChampItemEntity)
    private readonly itemRepository: Repository<ChampItemEntity>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  async insertItemData(itemPurchases: any[]): Promise<ChampItemEntity[]> {
    try {
      const participantsMap = await this.appService.getCache('participantsMap');
      const itemtest = itemPurchases.map((item) => {
        let target;
        if (Number(item.participantId) > 5) {
          target = Number(item.participantId) - 5;
        } else {
          target = Number(item.participantId) + 5;
        }
        return {
          champ_id: participantsMap[item.participantId].champion_id,
          item_id: item.itemId,
          timestamp: item.timestamp,
          vs_champ_id: participantsMap[target].champion_id,
          type: item.type,
        };
      });
      return await this.itemRepository.save(itemtest);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
