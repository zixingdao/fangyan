import { createZodDto } from 'nestjs-zod';
import { RecordingSchema } from '@changsha/shared';
import { z } from 'zod';

// Body only contains duration and record_type, user_id and file_url are handled by controller
const UploadBodySchema = RecordingSchema.pick({
  duration: true,
  record_type: true,
}).extend({
  // Ensure types are converted from string (multipart/form-data)
  duration: z.string().transform((val) => parseInt(val, 10)),
  record_type: z.string().transform((val) => parseInt(val, 10)),
});

export class UploadRecordingDto extends createZodDto(UploadBodySchema) {}
