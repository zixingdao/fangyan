import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateUserSchema, UserRole, UserStatus } from '@changsha/shared';

const AdminCreateUserSchema = CreateUserSchema.extend({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export class AdminCreateUserDto extends createZodDto(AdminCreateUserSchema) {}
