import { z } from 'zod';
import { RankType } from '../enums';

export const RankingSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  rank_type: z.nativeEnum(RankType),
  rank_number: z.number(),
  duration: z.number(),
  period_start: z.string().optional(), // DateOnly usually transmitted as string YYYY-MM-DD
  period_end: z.string().optional(),
});
