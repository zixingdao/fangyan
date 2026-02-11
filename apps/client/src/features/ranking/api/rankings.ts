import { api } from '@/lib/axios';
import { RankType } from '@changsha/shared';

export interface RankingItem {
  id: number;
  rank: number;
  duration: number; // in seconds
  user: {
    name: string;
    school: string;
    avatar?: string;
  };
}

export const getRankings = async (type: RankType, limit: number = 50): Promise<RankingItem[]> => {
  return api.get(`/rankings?type=${type}&limit=${limit}`);
};
