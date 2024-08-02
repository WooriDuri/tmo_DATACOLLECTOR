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
import axiosRetry from 'axios-retry';
import { HttpService } from '@nestjs/axios';

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
    private readonly httpService: HttpService,
  ) {
    this.called = 0;
  }

  async onModuleInit() {
    // const axiosInstance = this.httpService.axiosRef;

    // // axios-retry 설정
    // axiosRetry(axiosInstance, {
    //   retries: 3, // 재시도 횟수
    //   retryCondition: (error) => {
    //     // 재시도 조건
    //     return error.code === 'ECONNABORTED' || error.response?.status >= 500;
    //   },
    //   retryDelay: (retryCount) => {
    //     // 재시도 딜레이 (기본은 0)
    //     return retryCount * 1000; // 1초 간격으로 증가
    //   },
    // });
    //* 첫 시작시 주석 필요 시작라인
    const getCachedSummoners = await this.getCache<Array<string>>(
      'summonerIds',
    );
    const getSummonerCountAndLength = await this.getCache<CountAndLength>(
      'summonerCountAndLength',
    );
    //TODO : summoner 다 사용 했을 때 서버를 다시 킨 경우 생각해야함.
    if (
      !getCachedSummoners ||
      getSummonerCountAndLength.count >= getSummonerCountAndLength.length
    ) {
      await this.riotService.getEntries();
    }
    const summoner = await this.getCache<Array<string>>('summonerIds');
    const puuid = await this.getUserPuuidBySummonerId(summoner);
    await this.getMatchesByPuuid(puuid);
    console.log('start');
    await this.insertRiotData(); //* 첫 시작시 주석필요 마지막 라인
  }

  async getUserPuuidBySummonerId(data: any[]) {
    try {
      const getCachedSummonerInfo = await this.getCache<CountAndLength>(
        'summonerCountAndLength',
      );
      if (!getCachedSummonerInfo || getCachedSummonerInfo == null) {
        await this.riotService.getEntries();
      }
      if (getCachedSummonerInfo.count >= getCachedSummonerInfo.length) {
        await this.riotService.getEntries();
        // 갱신 후 getCachedSummonerInfo를 다시 가져와야함
        const updatedSummonerInfo = await this.getCache<CountAndLength>(
          'summonerCountAndLength',
        );
        if (!updatedSummonerInfo || updatedSummonerInfo == null) {
          await this.riotService.getEntries();
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
      throw new HttpException(error, error.status || 500);
    }
  }

  //* 호출하면 예외없이 바로 가져와야함. 다른데서 예외함.
  async getMatchesByPuuid(puuid: string) {
    try {
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
      throw new HttpException(error, error.status || 500);
    }
  }

  //* 라이엇 데이터 삽입
  async insertRiotData() {
    try {
      console.log(this.called++);
      //기존 캐시에 저장된 매치리스트 가져오기 무조건 저장되어 있어야함.
      const matches = await this.getCache<Array<string>>('matchesList');
      const getCachedMatchesInfo = await this.getCache<CountAndLength>(
        'matchesCountAndLength',
      );

      const match = await this.riotService.getMatchDetail(
        matches[getCachedMatchesInfo.count],
      );

      await this.insertParticipantData(match);
      const timeline = await this.riotService.getTimeline(
        matches[getCachedMatchesInfo.count],
      );

      await this.insertGroupByEvent(timeline);
      getCachedMatchesInfo.count++;
      await this.saveSummonerIds();
      await this.saveCache('matchesCountAndLength', getCachedMatchesInfo);

      if (
        !matches ||
        matches == null ||
        !getCachedMatchesInfo ||
        getCachedMatchesInfo == null ||
        getCachedMatchesInfo.count >= getCachedMatchesInfo.length
      ) {
        const summoner = await this.getCache<Array<string>>('summonerIds');
        if (!summoner) {
          await this.riotService.getEntries();
        }
        const puuid = await this.getUserPuuidBySummonerId(summoner);
        await this.getMatchesByPuuid(puuid);
        await this.insertRiotData();
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await this.insertRiotData();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  //* 아이템, 스킬 데이터 삽입
  async insertGroupByEvent(timelineData: any): Promise<any> {
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
      throw new HttpException(error, error.status || 500);
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
      throw new HttpException(error, error.status || 500);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async saveSummonerIds() {
    try {
      const existSummoners = await this.getCache<Array<string>>('summonerIds');
      return await this.saveCache('summonerIds', existSummoners);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async saveCache(name: string, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      return await this.cacheManager.set(name, serializedValue, 0);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
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
}
