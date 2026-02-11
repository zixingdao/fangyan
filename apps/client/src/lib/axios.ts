import axios from 'axios';
import { useAuthStore } from '../features/auth/hooks/useAuthStore'; // 稍后创建

export const api = axios.create({
  baseURL: '/api', // 假设 Nginx 或 Vite 代理已配置 /api -> http://localhost:3000
  timeout: 10000,
});

// 请求拦截器：注入 Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理 401 和统一响应解包
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果是标准响应格式
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) {
        return res.data;
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    if (error.response?.data?.msg) {
      error.message = error.response.data.msg;
    }
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
