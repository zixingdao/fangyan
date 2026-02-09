import { Op } from 'sequelize';
import { User, Recording, Ranking } from '../models';

export class RankingService {
  /**
   * 刷新所有榜单
   */
  async refreshAllRankings() {
    console.log('开始刷新榜单...');
    await this.calculateTotalRanking();
    // 可以在这里扩展日榜、周榜
    console.log('榜单刷新完成');
  }

  /**
   * 计算总时长榜单 (Total Ranking)
   */
  async calculateTotalRanking() {
    // 1. 统计每个用户的有效录制时长（状态为已通过/已标注等，这里简化为已通过 status=1）
    // 注意：实际逻辑应根据文档 "审核通过" 才算
    const userDurations = await Recording.findAll({
      where: { status: 1 }, // 1=已通过
      attributes: [
        'user_id',
        [sequelize.fn('sum', sequelize.col('duration')), 'total_minutes']
      ],
      group: ['user_id'],
      order: [[sequelize.fn('sum', sequelize.col('duration')), 'DESC']],
      raw: true
    });

    // 2. 清空旧的总榜数据 (或者保留历史记录，这里简化为覆盖当前总榜)
    await Ranking.destroy({ where: { rank_type: 'total' } });

    // 3. 批量插入新排名
    const rankingData = (userDurations as any[]).map((item, index) => ({
      user_id: item.user_id,
      rank_type: 'total',
      rank_number: index + 1,
      duration: parseInt(item.total_minutes),
      period_start: new Date(), // 实际上总榜可能不需要周期
      period_end: new Date()
    }));

    if (rankingData.length > 0) {
      await Ranking.bulkCreate(rankingData);
    }
  }
}

// 导出单例
import sequelize from '../config/database';
export const rankingService = new RankingService();
