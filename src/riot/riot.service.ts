import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';

@Injectable()
export class RiotService {
  riotApiKey;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.riotApiKey = this.configService.get('RIOT_API_KEY');
  }

  async getEntries() {
    try {
      const queue = `RANKED_SOLO_5x5`;
      const tier = `CHALLENGER`;
      const division = `I`;
      const data = this.httpService
        .get(
          `https://kr.api.riotgames.com/lol/league-exp/v4/entries/${queue}/${tier}/${division}?page=1&api_key=${this.riotApiKey}`,
        )
        .pipe(
          map((response) => {
            console.log(response.data.length); //205
            if (response.status != 200) {
              if (response.data.error_description) {
                throw new BadRequestException(response.data.error_description);
              } else {
                throw new BadRequestException();
              }
            }
            return response.data;
          }),
        );
      // console.log(data);
      return data; // array data
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getPuuid(summonerId: string) {
    try {
      const data = this.httpService
        .get(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${this.riotApiKey}`,
        )
        .pipe(
          map((response) => {
            console.log(response.data);
            if (response.status != 200) {
              if (response.data.error_description) {
                throw new BadRequestException(response.data.error_description);
              } else {
                throw new BadRequestException();
              }
            }
            return response.data.puuid;
          }),
        );
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getMatch(puuid: string) {
    try {
      console.log(puuid);
      const data = this.httpService
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&type=ranked&start=0&count=100&api_key=${this.riotApiKey}`,
        )
        .pipe(
          map((response) => {
            console.log(response.data);
            if (response.status != 200) {
              if (response.data.error_description) {
                throw new BadRequestException(response.data.error_description);
              } else {
                throw new BadRequestException();
              }
            }
            return response.data;
          }),
        );
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getMatchDetail(matchId: string) {
    try {
      console.log(matchId);
      const data = this.httpService
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${this.riotApiKey}`,
        )
        .pipe(
          map((response) => {
            console.log(response.data);
            if (response.status != 200) {
              if (response.data.error_description) {
                throw new BadRequestException(response.data.error_description);
              } else {
                throw new BadRequestException();
              }
            }
            return response.data;
          }),
        );
      return data; //match.json
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }

  async getTimeline(matchId: string) {
    try {
      console.log(matchId);
      const data = this.httpService
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${this.riotApiKey}`,
        )
        .pipe(
          map((response) => {
            console.log(response.data);
            if (response.status != 200) {
              if (response.data.error_description) {
                throw new BadRequestException(response.data.error_description);
              } else {
                throw new BadRequestException();
              }
            }
            return response.data;
          }),
        );
      return data; //timeline.json
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status || 500);
    }
  }
}
