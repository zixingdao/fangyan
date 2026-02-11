import { z } from 'zod';
import { UserRole, UserStatus } from '../enums';

export const UserSchema = z.object({
  id: z.number().optional(),
  student_id: z.string().min(1, "学号不能为空").max(50),
  phone: z.string().min(11, "手机号格式不正确").max(20),
  name: z.string().min(1, "姓名不能为空").max(50),
  password: z.string().min(6, "密码至少6位").max(255), // 在传输给前端时通常会被忽略或脱敏
  school: z.string().default('邵阳学院'),
  hometown: z.string().optional(),
  status: z.nativeEnum(UserStatus).default(UserStatus.PENDING),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  total_duration: z.number().default(0),
  solo_duration: z.number().default(0),
  dialogue_duration: z.number().default(0),
  annotation_duration: z.number().default(0),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  status: true, 
  role: true, 
  total_duration: true, 
  solo_duration: true,
  dialogue_duration: true,
  annotation_duration: true,
  created_at: true, 
  updated_at: true 
});

export const UpdateUserSchema = UserSchema.partial().omit({ 
  student_id: true, // 学号通常不可改
  created_at: true, 
  updated_at: true 
});
