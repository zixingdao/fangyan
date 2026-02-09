import request from '../utils/request';
import type { LoginForm, RegisterForm, LoginResponse, User } from '../types/user';

export const login = (data: LoginForm) => {
  return request.post<any, LoginResponse>('/auth/login', data);
};

export const register = (data: RegisterForm) => {
  return request.post<any, { message: string; userId: number }>('/auth/register', data);
};

export const getUserInfo = () => {
  return request.get<any, User>('/users/profile');
};

export const sendResetRequest = (data: any) => {
  return request.post<any, { message: string }>('/auth/reset-request', data);
};
