import { ItemService } from './item/item.service';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RiotService } from './riot/riot.service';
import { CountAndLength } from './common/interface';
import { get } from 'http';
import { SkillService } from './skill/skill.service';
import { ChampionService } from './champion/champion.service';
import { RuneService } from './rune/rune.service';

@Injectable()
export class AppService implements OnModuleInit {
  called;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly riotService: RiotService,
    private readonly itemService: ItemService,
    private readonly skillService: SkillService,
    private readonly champService: ChampionService,
    private readonly runeService: RuneService,
  ) {
    this.called = 0;
  }

  async onModuleInit() {
    // const getMatchList = await this.getCache<Array<string>>('matchesList');
    // const getMatchInfo = await this.getCache<CountAndLength>(
    //   'matchesCountAndLength',
    // );
    // console.log(getMatchList);
    // console.log(getMatchList[getMatchInfo.count - 1]);
    // console.log(getMatchList[getMatchInfo.count]);
    // console.log(getMatchInfo);
    const getCachedSummoners = await this.getCache<Array<string>>(
      'summonerIds',
    );
    if (!getCachedSummoners) {
      await this.riotService.getEntries();
    }
    const summoner = await this.getCache<Array<string>>('summonerIds');
    const puuid = await this.getUserPuuidBySummonerId(summoner);
    const matches = await this.getMatchesByPuuid(puuid);
    await this.insertRiotData(); // 반복시켜야함.
  }

  async getUserPuuidBySummonerId(data: any[]) {
    try {
      const getCachedSummonerInfo = await this.getCache<CountAndLength>(
        'summonerCountAndLength',
      );
      if (!getCachedSummonerInfo) {
        throw new HttpException('summonerCountAndLength is null', 500);
      }
      if (getCachedSummonerInfo.count >= getCachedSummonerInfo.length) {
        await this.riotService.getEntries();
        // 갱신 후 getCachedSummonerInfo를 다시 가져와야함
        const updatedSummonerInfo = await this.getCache<CountAndLength>(
          'summonerCountAndLength',
        );
        if (!updatedSummonerInfo) {
          throw new HttpException('summonerCountAndLength is null', 500);
        }
        const puuid = await this.riotService.getPuuid(
          data[updatedSummonerInfo.count],
        );
        updatedSummonerInfo.count++;
        await this.saveCache('summonerCountAndLength', updatedSummonerInfo);
        return puuid;
      } else {
        const puuid = await this.riotService.getPuuid(
          data[getCachedSummonerInfo.count],
        );
        getCachedSummonerInfo.count++;
        await this.saveCache('summonerCountAndLength', getCachedSummonerInfo);
        return puuid;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getMatchesByPuuid(puuid: string) {
    try {
      const existMatches = await this.getCache<Array<string>>('matchesList');
      const existMatchesInfo = await this.getCache<CountAndLength>(
        'matchesCountAndLength',
      );
      if (existMatches && existMatchesInfo.count < existMatchesInfo.length) {
        return existMatches;
      }
      const matchesList = await this.riotService.getMatches(puuid);
      await this.saveCache('matchesList', matchesList);
      const countAndLength: CountAndLength = {
        count: 0,
        length: matchesList.length,
      };
      await this.saveCache('matchesCountAndLength', countAndLength);
      return matchesList;
    } catch (error) {
      console.log(error);
    }
  }

  //* 라이엇 데이터 삽입
  async insertRiotData() {
    try {
      console.log(this.called++);
      const matches = await this.getCache<Array<string>>('matchesList');
      let getCachedMatchesInfo = await this.getCache<CountAndLength>(
        'matchesCountAndLength',
      );
      if (!getCachedMatchesInfo) {
        await this.riotService.getEntries();
        getCachedMatchesInfo = await this.getCache<CountAndLength>(
          'matchesCountAndLength',
        );
      }
      const match = await this.riotService.getMatchDetail(
        matches[getCachedMatchesInfo.count],
      );
      await this.insertParticipantData(match);
      const timeline = await this.riotService.getTimeline(
        matches[getCachedMatchesInfo.count],
      );
      await this.insertGroupByEvent(timeline);
      getCachedMatchesInfo.count++;
      await this.saveCache('matchesCountAndLength', getCachedMatchesInfo);
      if (getCachedMatchesInfo.count < getCachedMatchesInfo.length) {
        setTimeout(async () => {
          await this.insertRiotData();
        }, 2000);
      } else {
        //다시 매치정보 가져오기
        const summoner = await this.getCache<Array<string>>('summonerIds');
        const puuid = await this.getUserPuuidBySummonerId(summoner);
        await this.getMatchesByPuuid(puuid);
        await this.insertRiotData();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //* 아이템, 스킬 데이터 삽입
  async insertGroupByEvent(timelineData: any) {
    try {
      const allEvents = timelineData.info.frames.reduce(
        (acc, frame) => acc.concat(frame.events),
        [],
      );
      const groupedEvents = allEvents.reduce((acc, event) => {
        if (!acc[event.type]) {
          acc[event.type] = [];
        }
        acc[event.type].push(event);
        return acc;
      }, {}); // event type 별로 그룹핑
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
      await this.itemService.insertItemData(groupedEvents.ITEM_PURCHASED);
      await this.skillService.insertSkillData(skillGroupedData);
      return groupedEvents;
    } catch (error) {
      console.log(error);
    }
  }

  //* 룬, 룬스탯, 승패 데이터 삽입
  async insertParticipantData(matchData: any) {
    try {
      const participantsMap = {};
      matchData.info.participants.forEach((participant) => {
        participantsMap[participant.participantId] = {
          participant_id: participant.participantId,
          champion_id: participant.championId,
          lane: participant.individualPosition,
        };
      });
      await this.saveCache('participantsMap', participantsMap);
      await this.champService.saveWin(matchData.info.participants);
      await this.runeService.insertRuneData(matchData.info.participants);
      await this.runeService.insertRuneStatData(matchData.info.participants);
      return participantsMap;
      // const test = await this.getCache('participantsMap');
      // console.log(test);
    } catch (error) {
      console.log(error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async saveCache(name: string, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      return await this.cacheManager.set(name, serializedValue);
    } catch (error) {
      console.log(error);
    }
  }

  async getCache<T>(name: string): Promise<T | null> {
    try {
      const serializedValue = await this.cacheManager.get<string>(name);
      if (serializedValue) {
        return JSON.parse(serializedValue) as T;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteCache(name: string) {
    try {
      return await this.cacheManager.del(name);
    } catch (error) {
      console.log(error);
    }
  }
  // async saveCache(name: string, value: any) {
  //   try {
  //     return await this.cacheManager.set(name, value);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async getCache(name: string) {
  //   try {
  //     return await this.cacheManager.get(name);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
