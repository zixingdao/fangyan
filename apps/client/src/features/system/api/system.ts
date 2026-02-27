import { api } from '@/lib/axios';

export interface SystemStats {
  totalUsers: number;
  totalDurationHours: number;
  totalRewards: string | number; // 支持范围字符串
  rewardRateRange?: string;
  // 首页统计信息配置
  statsConfig?: {
    singleLimit: string;      // 单人录制上限
    multiLimit: string;       // 多人对话上限
    participantsLabel: string; // 已参与人数标签
    durationLabel: string;    // 已采集时长标签
  };
  rankingRewards?: {
    duration: {
      rank1: number;
      rank23: number;
      rank410: number;
    };
    quality: {
      rank1: number;
      rank23: number;
      rank410: number;
    };
  };
}

export const getSystemStats = async (): Promise<SystemStats> => {
  return api.get('/system/stats');
};
