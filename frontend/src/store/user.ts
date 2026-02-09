import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi, getUserInfo } from '../api/auth';
import type { User, LoginForm, RegisterForm } from '../types/user';
import { getToken, setToken, getUser, setUser, clearStorage } from '../utils/storage';

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '');
  const user = ref<User | null>(getUser());

  const fetchProfile = async () => {
    try {
      const res: any = await getUserInfo();
      user.value = res;
      setUser(res);
    } catch (error) {
      console.error('Fetch profile failed', error);
    }
  };

  const login = async (loginForm: LoginForm) => {
    try {
      const res = await loginApi(loginForm);
      token.value = res.token;
      user.value = res.user;
      
      setToken(res.token);
      setUser(res.user);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败，请检查网络或联系管理员' 
      };
    }
  };

  const register = async (registerForm: RegisterForm) => {
    try {
      await registerApi(registerForm);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    clearStorage();
  };

  return {
    token,
    user,
    login,
    register,
    logout,
    fetchProfile
  };
});
