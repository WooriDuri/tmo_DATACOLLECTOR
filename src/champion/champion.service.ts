import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Champion } from 'src/entity/champion.entity';
import { ChampionWinEntity } from 'src/entity/champion_win.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChampionService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ChampionWinEntity)
    private readonly championWinRepository: Repository<ChampionWinEntity>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  async saveWin(data: any[]) {
    const participantsMap = await this.appService.getCache('participantsMap');
    const winYn = data.map((participant) => {
      let target;
      if (Number(participant.participantId) > 5) {
        target = Number(participant.participantId) - 5;
      } else {
        target = Number(participant.participantId) + 5;
      }
      return {
        champ_id: participant.championId,
        win: participant.win,
        vs_champ_id: participantsMap[target].champion_id,
      };
    });
    await this.championWinRepository.save(winYn);
    try {
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
