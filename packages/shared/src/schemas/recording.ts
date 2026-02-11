import { z } from 'zod';
import { RecordType, RecordStatus } from '../enums';

export const RecordingSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  duration: z.number().min(1, "时长必须大于0"),
  file_url: z.string().url("文件地址无效"),
  record_type: z.nativeEnum(RecordType),
  status: z.nativeEnum(RecordStatus).default(RecordStatus.PENDING_ANNOTATION),
  annotation_url: z.string().url().optional().nullable(),
  annotation_time: z.date().optional().nullable(),
  remark: z.string().optional().nullable(),
  upload_time: z.date().optional(), // 对应 createdAt
});

export const CreateRecordingSchema = RecordingSchema.omit({
  id: true,
  status: true,
  annotation_url: true,
  annotation_time: true,
  remark: true,
  upload_time: true
});
