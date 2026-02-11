import { createZodDto } from 'nestjs-zod';
import { CreateTopicSchema, UpdateTopicSchema } from '@changsha/shared';

export class CreateTopicDto extends createZodDto(CreateTopicSchema) {}
export class UpdateTopicDto extends createZodDto(UpdateTopicSchema) {}
