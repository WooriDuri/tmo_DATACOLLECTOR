import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { AppService } from 'src/app.service';
import { CountAndLength } from 'src/common/interface';

@Injectable()
export class RiotService {
  riotApiKey;
  tier;
  tierCount;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {
    this.riotApiKey = this.configService.get('RIOT_API_KEY');
    this.tier = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND'];
    this.tierCount = 0;
  }

  async getEntries() {
    try {
      const queue = `RANKED_SOLO_5x5`;
      const targetTier = this.tier[this.tierCount];

      const division = `I`;
      const data = await lastValueFrom(
        this.httpService
          .get(
            `https://kr.api.riotgames.com/lol/league-exp/v4/entries/${queue}/${targetTier}/${division}?page=1&api_key=${this.riotApiKey}`,
          )
          .pipe(
            map((response) => {
              if (response.status != 200) {
                if (response.data.error_description) {
                  throw new BadRequestException(
                    response.data.error_description,
                  );
                } else {
                  throw new BadRequestException();
                }
              }
              return response.data.map((entry: any) => entry.summonerId);
            }),
          ),
      );
      await this.appService.saveCache('summonerIds', data);
      const countAndLength: CountAndLength = { count: 0, length: data.length };
      await this.appService.saveCache('summonerCountAndLength', countAndLength);
      const test = await this.appService.getCache('summonerCountAndLength');
      // console.log('test : ', test);
      // console.log('cached summonerIds : ', data);
      // console.log(this.tierCount);
      this.tierCount++;
      return data; // array data
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getPuuid(summonerId: string) {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get(
            `https://kr.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${this.riotApiKey}`,
          )
          .pipe(
            map((response) => {
              if (response.status != 200) {
                if (response.data.error_description) {
                  throw new BadRequestException(
                    response.data.error_description,
                  );
                } else {
                  throw new BadRequestException();
                }
              }
              return response.data.puuid;
            }),
          ),
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getMatches(puuid: string) {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&type=ranked&start=0&count=100&api_key=${this.riotApiKey}`,
          )
          .pipe(
            map((response) => {
              if (response.status != 200) {
                if (response.data.error_description) {
                  throw new BadRequestException(
                    response.data.error_description,
                  );
                } else {
                  throw new BadRequestException();
                }
              }
              return response.data;
            }),
          ),
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getMatchDetail(matchId: string) {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${this.riotApiKey}`,
          )
          .pipe(
            map((response) => {
              if (response.status != 200) {
                if (response.data.error_description) {
                  throw new BadRequestException(
                    response.data.error_description,
                  );
                } else {
                  throw new BadRequestException();
                }
              }
              return response.data;
            }),
          ),
      );
      return data; //match.json
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getTimeline(matchId: string) {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${this.riotApiKey}`,
          )
          .pipe(
            map((response) => {
              if (response.status != 200) {
                if (response.data.error_description) {
                  throw new BadRequestException(
                    response.data.error_description,
                  );
                } else {
                  throw new BadRequestException();
                }
              }
              return response.data;
            }),
          ),
      );
      return data; //timeline.json
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
