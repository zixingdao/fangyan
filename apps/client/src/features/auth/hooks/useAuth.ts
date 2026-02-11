import { useState } from 'react';
import { LoginDto, RegisterDto } from '@changsha/shared';
import { login as loginApi, register as registerApi } from '../api/auth';
import { useAuthStore } from './useAuthStore';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuth, logout } = useAuthStore();

  const handleLogin = async (data: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(data);
      setAuth(res.user, res.access_token);
      return res.user;
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterDto) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerApi(data);
      // 注册成功后通常需要跳转去登录，或者自动登录
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout,
  };
};
