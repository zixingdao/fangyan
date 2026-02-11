import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { Ranking } from './ranking.entity';

import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking, User])],
  providers: [RankingsService],
  controllers: [RankingsController],
  exports: [RankingsService],
})
export class RankingsModule {}
