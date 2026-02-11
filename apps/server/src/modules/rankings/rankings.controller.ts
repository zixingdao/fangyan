import { Controller, Get, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankType } from '@changsha/shared';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRankings(@Query('type') type: RankType = RankType.TOTAL) {
    if (type === RankType.WEEK) {
      return this.rankingsService.getWeeklyRankings();
    }
    return this.rankingsService.getTotalRankings();
  }
}
