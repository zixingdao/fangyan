import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

export function useAuth() {
  const userStore = useUserStore();
  const router = useRouter();

  const user = computed(() => userStore.user);
  const isAuthenticated = computed(() => !!userStore.token);
  const isAdmin = computed(() => userStore.user?.role === 'admin');

  const login = async (form: any) => {
    const success = await userStore.login(form);
    if (success) {
      if (isAdmin.value) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
    return success;
  };

  const logout = () => {
    userStore.logout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
}
