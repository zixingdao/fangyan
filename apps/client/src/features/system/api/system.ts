import { api } from '@/lib/axios';

export interface SystemStats {
  totalUsers: number;
  totalDurationHours: number;
  totalRewards: string | number; // 支持范围字符串
  rewardRateRange?: string;
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
