import request from '../utils/request';
import type { RankingItem } from '../types/ranking';

export const getRankings = (type: 'day' | 'week' | 'month' | 'total' = 'total') => {
  return request.get<any, RankingItem[]>('/rankings', { params: { type } });
};

export const getMyRanking = () => {
  return request.get<any, RankingItem>('/rankings/my');
};
