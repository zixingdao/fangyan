import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '@changsha/shared';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
