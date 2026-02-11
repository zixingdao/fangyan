<template>
  <el-header :class="{ 'header-scrolled': isScrolled }">
    <div class="header-inner">
      <div class="logo" @click="$router.push('/')">
        <span class="logo-icon">🌶️</span>
        <span class="logo-text">湘音传承</span>
      </div>
      
      <div class="header-right">
        <el-menu mode="horizontal" router :default-active="$route.path" class="custom-menu" :ellipsis="false">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/guide">录制指南</el-menu-item>
          <el-menu-item index="/ranking">排行榜</el-menu-item>
          <el-menu-item index="/honor">荣誉墙</el-menu-item>
          
          <template v-if="!userStore.token">
            <div class="auth-buttons">
              <el-button text @click="$router.push('/login')">登录</el-button>
              <el-button type="primary" round @click="$router.push('/register')">加入守护</el-button>
            </div>
          </template>
          
          <template v-else>
            <el-sub-menu index="user" popper-class="user-dropdown">
              <template #title>
                <div class="user-profile-trigger">
                  <el-avatar :size="32" class="user-avatar" :src="userAvatar">{{ userStore.user?.name?.charAt(0) }}</el-avatar>
                  <span class="username">{{ userStore.user?.name }}</span>
                </div>
              </template>
              <el-menu-item index="/profile">个人中心</el-menu-item>
              <el-menu-item @click="handleLogout">退出登录</el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();
const isScrolled = ref(false);

const userAvatar = computed(() => {
  return ''; // 可以在这里返回随机头像或用户上传的头像
});

const handleLogout = () => {
  userStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.el-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
  z-index: 100;
  padding: 0;
}

.header-scrolled {
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  background-color: #ffffff;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: var(--cs-red);
  letter-spacing: 2px;
  font-family: 'Ma Shan Zheng', 'KaiTi', 'STKaiti', 'SimKai', serif;
}

.custom-menu {
  border-bottom: none !important;
  background: transparent;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
}

.user-profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background-color: var(--cs-red-light);
  color: var(--cs-red);
  font-weight: bold;
}
</style>
