import { z } from 'zod';
import { UserSchema, CreateUserSchema, UpdateUserSchema } from '../schemas/user';
import { LoginSchema, RegisterSchema, ChangePasswordSchema } from '../schemas/auth';
import { RecordingSchema, CreateRecordingSchema } from '../schemas/recording';
import { RankingSchema } from '../schemas/ranking';
import { TopicSchema, CreateTopicSchema, UpdateTopicSchema } from '../schemas/topic';

export type User = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

export type Recording = z.infer<typeof RecordingSchema>;
export type CreateRecordingDto = z.infer<typeof CreateRecordingSchema>;

export type Ranking = z.infer<typeof RankingSchema>;

export type Topic = z.infer<typeof TopicSchema>;
export type CreateTopicDto = z.infer<typeof CreateTopicSchema>;
export type UpdateTopicDto = z.infer<typeof UpdateTopicSchema>;

// 新增 AuthResponse 类型
export interface AuthResponse {
  user: User;
  access_token: string;
}

export * from '../enums';
