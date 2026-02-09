import request from '../utils/request';
import type { PasswordResetForm, ProfileUpdateForm, User } from '../types/user';

export const submitPasswordReset = (data: PasswordResetForm) => {
  return request.post<any, { message: string }>('/users/password-reset-request', data);
};

export const updateProfile = (data: ProfileUpdateForm) => {
  return request.put<any, User>('/users/profile', data);
};
