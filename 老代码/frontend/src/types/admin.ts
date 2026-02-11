import type { User } from './user';

export interface DashboardStats {
  userCount: number;
}

export interface ResetRequest {
  id: number;
  student_id: string;
  phone: string;
  reason: string;
  status: number; // 0: 待审核, 1: 通过, 2: 拒绝
  admin_remark?: string;
  created_at: string;
}

export interface SystemLog {
  id: number;
  level: 'info' | 'warn' | 'error';
  type: 'user' | 'admin' | 'system';
  action: string;
  details?: string;
  user_id?: number;
  ip?: string;
  created_at: string;
  user?: User;
}

export interface ResetRequestQueryParams {
  status?: string | number;
}

export interface LogQueryParams {
  type?: string;
  level?: string;
  startDate?: string;
  endDate?: string;
}
