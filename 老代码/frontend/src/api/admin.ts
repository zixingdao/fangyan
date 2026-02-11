import request from '../utils/request';
import type { 
  DashboardStats, 
  ResetRequest, 
  SystemLog, 
  ResetRequestQueryParams,
  LogQueryParams 
} from '../types/admin';
import type { User } from '../types/user';

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  return request.get<any, DashboardStats>('/admin/stats');
};

// 获取用户列表
export const getUsers = () => {
  return request.get<any, User[]>('/admin/users');
};

// 封禁用户
export const banUser = (id: number) => {
  return request.put<any, { message: string }>(`/admin/users/${id}/ban`);
};

// 获取密码重置申请
export const getResetRequests = (params?: ResetRequestQueryParams) => {
  return request.get<any, ResetRequest[]>('/admin/reset-requests', { params });
};


// 审核密码重置申请
export const auditResetRequest = (id: number, status: number, admin_remark?: string) => {
  return request.post<any, { message: string }>(`/admin/reset-requests/${id}/audit`, { status, admin_remark });
};

// 获取系统日志
export const getSystemLogs = (params?: LogQueryParams) => {
  return request.get<any, SystemLog[]>('/admin/logs', { params });
};
