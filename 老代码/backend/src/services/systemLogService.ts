import { SystemLog } from '../models';

export const logAction = async (
  level: 'info' | 'warn' | 'error',
  type: 'user' | 'admin' | 'system',
  action: string,
  details?: string,
  userId?: number,
  ip?: string
) => {
  try {
    await SystemLog.create({
      level,
      type,
      action,
      details,
      user_id: userId,
      ip
    });
  } catch (error) {
    console.error('Failed to write log:', error);
  }
};
