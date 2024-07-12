import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Champion } from 'src/entity/champion.entity';
import { Repository } from 'typeorm';
import * as itemData from './item.json';
import * as championData from './champion.json';
import * as timelineData from './timeline.json';
import * as matchData from './match.json';
import * as spellData from './spell.json';
import { ItemEntity } from 'src/entity/item.entity';
import { SpellEntity } from 'src/entity/spell.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(SpellEntity)
    private readonly spellRepository: Repository<SpellEntity>,
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

  async insertItemData(): Promise<ItemEntity[]> {
    try {
      const items = Object.entries(itemData.data).map(([id, value]) => {
        return {
          item_id: Number(id),
          name: value.name,
          into: 'into' in value ? (value.into ? 1 : 0) : 0,
          gold: value.gold.total,
        };
      });
      return await this.itemRepository.save(items);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async insertSpellData() {
    try {
      const spells = Object.entries(spellData.data).map(([id, value]) => {
        return {
          spell_id: Number(value.key),
          name: value.name,
        };
      });
      return await this.spellRepository.save(spells);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async test() {
    try {
      const matchid = matchData.metadata.matchId;
      const test = matchData.info.participants;
      // let participants = [];
      // test.map((participant) => {
      //   participants.push({
      //     participant_id: participant.participantId,
      //     champion_id: participant.championId,
      //     lane: participant.individualPosition,
      //   });
      // });
      // {
      //   '1': { participant_id: 1, champion_id: 154, lane: 'TOP' },
      //   '2': { participant_id: 2, champion_id: 11, lane: 'JUNGLE' },
      //   '3': { participant_id: 3, champion_id: 34, lane: 'MIDDLE' },
      //   '4': { participant_id: 4, champion_id: 236, lane: 'BOTTOM' },
      //   '5': { participant_id: 5, champion_id: 526, lane: 'UTILITY' },
      //   '6': { participant_id: 6, champion_id: 420, lane: 'TOP' },
      //   '7': { participant_id: 7, champion_id: 76, lane: 'JUNGLE' },
      //   '8': { participant_id: 8, champion_id: 8, lane: 'MIDDLE' },
      //   '9': { participant_id: 9, champion_id: 360, lane: 'BOTTOM' },
      //   '10': { participant_id: 10, champion_id: 111, lane: 'UTILITY' }
      // }

      const participantsMap = {};
      test.forEach((participant) => {
        participantsMap[participant.participantId] = {
          participant_id: participant.participantId,
          champion_id: participant.championId,
          lane: participant.role,
        };
      });
      // console.log(matchid, participantsMap);

      const allEvents = timelineData.info.frames.reduce(
        (acc, frame) => acc.concat(frame.events),
        [],
      );

      // console.log(allEvents); // 모든 event들을 다 가져옴
      const groupedEvents = allEvents.reduce((acc, event) => {
        if (!acc[event.type]) {
          acc[event.type] = [];
        }
        acc[event.type].push(event);
        return acc;
      }, {}); // event type 별로 그룹핑

      const sortedKeys = Object.keys(groupedEvents).sort(); // event type 별로 정렬
      // console.log(sortedKeys);

      //* item db에 넣기 좋게 만듬
      const itemtest = groupedEvents.ITEM_PURCHASED.map((item) => {
        let target;
        if (Number(item.participantId) > 5) {
          target = Number(item.participantId) - 5;
        } else {
          target = Number(item.participantId) + 5;
        }
        return {
          champion_id: participantsMap[item.participantId].champion_id,
          item_id: item.itemId,
          timestamp: item.timestamp,
          vs_champion_id: participantsMap[target].champion_id,
          type: item.type,
        };
      });
      // console.log(itemtest);
      // console.log(groupedEvents.SKILL_LEVEL_UP);
      //* champion_id , skill[], vs_champion_id
      const skillGroupedData = groupedEvents.SKILL_LEVEL_UP.reduce(
        (acc, curr) => {
          const { participantId, skillSlot } = curr;

          // 이미 해당 participantId가 있는 경우 기존 배열에 skillSlot 추가
          if (acc[participantId]) {
            acc[participantId].push(skillSlot);
          } else {
            // 해당 participantId가 없는 경우 새로운 배열로 초기화
            acc[participantId] = [skillSlot];
          }

          return acc;
        },
        {},
      );
      // console.log(skillGroupedData); // skill level up event를 participantId 별로 그룹핑

      const dbskill = Object.entries(skillGroupedData).map(([key, value]) => {
        let target;
        if (Number(key) > 5) {
          target = Number(key) - 5;
        } else {
          target = Number(key) + 5;
        }
        return {
          champion_id: participantsMap[key].champion_id,
          skill: value,
          vs_champion_id: participantsMap[target].champion_id,
        };
      });
      // console.log(dbskill); // 디비에 넣기 좋게 만듬

      const winYn = test.map((participant) => {
        let target;
        if (Number(participant.participantId) > 5) {
          target = Number(participant.participantId) - 5;
        } else {
          target = Number(participant.participantId) + 5;
        }
        return {
          champion_id: participant.championId,
          win: participant.win,
          vs_champion_id: participantsMap[target].champion_id,
        };
      });
      console.log(winYn); // 승패 여부

      const rune = test.map((participant) => {
        let target;
        if (Number(participant.participantId) > 5) {
          target = Number(participant.participantId) - 5;
        } else {
          target = Number(participant.participantId) + 5;
        }
        return {
          champion_id: participantsMap[participant.participantId].champion_id,
          primary_rune: participant.perks.styles[0].selections.map(
            (selection) => selection.perk,
          ),
          primary_style: participant.perks.styles[0].style,
          secondary_rune: participant.perks.styles[1].selections.map(
            (selection) => selection.perk,
          ),
          secondary_style: participant.perks.styles[1].style,
          vs_champion_id: participantsMap[target].champion_id,
        };
      });
      console.log(rune); // 룬 정보

      return groupedEvents;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
