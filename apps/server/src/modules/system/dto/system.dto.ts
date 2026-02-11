import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateConfigSchema = z.object({
  key: z.string().min(1),
  value: z.string()
});

export class UpdateConfigDto extends createZodDto(UpdateConfigSchema) {}
