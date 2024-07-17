import { Body, Controller, Get } from '@nestjs/common';
import { RiotService } from './riot.service';

@Controller('riot')
export class RiotController {
  constructor(private readonly riotService: RiotService) {}

  @Get('entries')
  async getEntries() {
    return this.riotService.getEntries();
  }

  @Get('puuid')
  async getPuuid(@Body() body: { summonerId: string }) {
    return this.riotService.getPuuid(body.summonerId);
  }

  @Get('matches')
  async getMatch(@Body() body: { puuid: string }) {
    return this.riotService.getMatch(body.puuid);
  }

  @Get('match')
  async getMatchDetail(@Body() body: { matchId: string }) {
    return this.riotService.getMatchDetail(body.matchId);
  }

  @Get('timeline')
  async getTimeline(@Body() body: { matchId: string }) {
    return this.riotService.getTimeline(body.matchId);
  }
}
