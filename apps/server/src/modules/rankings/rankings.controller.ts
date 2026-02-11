import { Controller, Get, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankType } from '@changsha/shared';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRankings(
    @Query('type') type: RankType = RankType.TOTAL,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Math.max(1, Math.min(200, Number.parseInt(limit, 10) || 50)) : 50;
    if (type === RankType.WEEK) {
      return this.rankingsService.getWeeklyRankings();
    }
    return this.rankingsService.getTotalRankings(parsedLimit);
  }
}
