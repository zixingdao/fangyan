import { api } from '@/lib/axios';
import { RecordingSchema } from '@changsha/shared';
import { z } from 'zod';

export type Recording = z.infer<typeof RecordingSchema>;

export const getMyRecordings = async (): Promise<Recording[]> => {
  return api.get('/recordings/my');
};

export const uploadRecording = async (formData: FormData): Promise<Recording> => {
  return api.post('/recordings/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
