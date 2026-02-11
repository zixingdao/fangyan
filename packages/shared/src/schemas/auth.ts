import { z } from 'zod';
import { CreateUserSchema } from './user';

export const LoginSchema = z.object({
  student_id: z.string().min(1, "请输入学号"),
  password: z.string().min(6, "密码至少6位"),
});

export { CreateUserSchema as RegisterSchema } from './user';
export { CreateUserSchema } from './user';

export const ChangePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, "新密码至少6位"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});
