import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { ChampSkillEntity } from 'src/entity/champ_skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(ChampSkillEntity)
    private readonly championSkillRepository: Repository<ChampSkillEntity>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  async insertSkillData(skillGroupedData: any[]): Promise<ChampSkillEntity[]> {
    try {
      const participantsMap = await this.appService.getCache('participantsMap');
      const dbskill = Object.entries(skillGroupedData).map(([key, value]) => {
        let target;
        if (Number(key) > 5) {
          target = Number(key) - 5;
        } else {
          target = Number(key) + 5;
        }
        return {
          champ_id: participantsMap[key].champion_id,
          skills: value,
          vs_champ_id: participantsMap[target].champion_id,
        };
      });
      return await this.championSkillRepository.save(dbskill);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
