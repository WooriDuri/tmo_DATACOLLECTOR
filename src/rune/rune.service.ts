import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { RuneMainEntity } from 'src/entity/rune_main.entity';
import { RuneStatEntity } from 'src/entity/rune_stat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RuneService {
  constructor(
    @InjectRepository(RuneMainEntity)
    private readonly runeMainRepository: Repository<RuneMainEntity>,
    @InjectRepository(RuneStatEntity)
    private readonly runeStatRepository: Repository<RuneStatEntity>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  async insertRuneData(runeData: any[]): Promise<RuneMainEntity[]> {
    try {
      const participantsMap = await this.appService.getCache('participantsMap');
      const rune = runeData.map((participant) => {
        let target;
        if (Number(participant.participantId) > 5) {
          target = Number(participant.participantId) - 5;
        } else {
          target = Number(participant.participantId) + 5;
        }
        return {
          champ_id: participantsMap[participant.participantId].champion_id,
          primary_rune: participant.perks.styles[0].selections.map(
            (selection) => selection.perk,
          ),
          primary_style: participant.perks.styles[0].style,
          secondary_rune: participant.perks.styles[1].selections.map(
            (selection) => selection.perk,
          ),
          secondary_style: participant.perks.styles[1].style,
          vs_champ_id: participantsMap[target].champion_id,
        };
      });
      return await this.runeMainRepository.save(rune);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async insertRuneStatData(runeData: any[]): Promise<RuneStatEntity[]> {
    try {
      const participantsMap = await this.appService.getCache('participantsMap');
      const rune = runeData.map((participant) => {
        return {
          champ_id: participantsMap[participant.participantId].champion_id,
          defense: participant.perks.statPerks.defense,
          flex: participant.perks.statPerks.flex,
          offense: participant.perks.statPerks.offense,
        };
      });
      return await this.runeStatRepository.save(rune);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
