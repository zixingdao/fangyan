import { api } from '../../../lib/axios';
import { LoginDto, RegisterDto, AuthResponse, User } from '@changsha/shared';

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};

export const getProfile = async (): Promise<User> => {
  return api.get('/auth/profile');
};
