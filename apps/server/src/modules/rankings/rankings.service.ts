import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './ranking.entity';
import { User } from '../users/user.entity';
import { RankType } from '@changsha/shared';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Ranking)
    private rankingsRepository: Repository<Ranking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 获取总排行榜
  async getTotalRankings(limit: number = 50): Promise<any[]> {
    // 实际逻辑应该是先统计 Users 表的 total_duration，或者直接查 Rankings 表
    // 这里为了演示，我们假设 Rankings 表已经有聚合好的数据，或者我们实时从 Users 表聚合
    
    // 方法1：直接从 Users 表查（实时）
    const users = await this.usersRepository.find({
      order: { total_duration: 'DESC' },
      take: limit,
      select: ['id', 'name', 'school', 'total_duration', 'hometown'],
    });

    return users.map((user, index) => ({
      id: user.id,
      rank: index + 1,
      duration: user.total_duration,
      user: {
        name: user.name,
        school: user.school,
        avatar: undefined,
      },
    }));
  }

  // 获取周榜（假设 Rankings 表存了历史快照，或者需要实时聚合 Recordings 表）
  // 这里简化为返回空数组，后续可根据 Recording 表聚合
  async getWeeklyRankings(): Promise<any[]> {
    return [];
  }
}
