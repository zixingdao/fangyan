import { createZodDto } from 'nestjs-zod';
import { LoginSchema, RegisterSchema } from '@changsha/shared';

export class LoginDto extends createZodDto(LoginSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}
