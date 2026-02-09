import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getToken, clearStorage } from './storage';

// 创建 axios 实例
const request = axios.create({
  // 使用环境变量中的 API 地址，如果未定义则回退到默认值
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || '请求失败';
    ElMessage.error(message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token 过期或无效，清除并跳转登录
      clearStorage();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default request;
