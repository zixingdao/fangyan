<template>
  <el-aside width="240px" class="aside">
    <div class="logo">
      <img src="../../assets/vue.svg" alt="Logo" class="logo-img" />
      <span class="logo-text">方言后台管理</span>
    </div>
    
    <el-menu
      router
      :default-active="$route.path"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      class="admin-menu"
      :collapse-transition="false"
    >
      <el-menu-item index="/admin/dashboard">
        <el-icon><Odometer /></el-icon>
        <span>控制台</span>
      </el-menu-item>
      
      <el-sub-menu index="1">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/admin/users">用户列表</el-menu-item>
        <el-menu-item index="/admin/rankings">排行榜管理</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/admin/content">方言词条</el-menu-item>
        <el-menu-item index="/admin/recordings">录音审核</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统维护</span>
        </template>
        <el-menu-item index="/admin/logs">系统日志</el-menu-item>
        <el-menu-item index="/admin/settings">参数配置</el-menu-item>
      </el-sub-menu>

      <el-divider class="menu-divider" />

      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <span>返回前台首页</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { 
  Odometer, 
  User, 
  Document, 
  Setting, 
  HomeFilled 
} from '@element-plus/icons-vue';
</script>

<style scoped>
.aside {
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  z-index: 10;
}

.logo {
  height: 64px;
  line-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3649;
  overflow: hidden;
  padding: 0 16px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.admin-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

/* 滚动条美化 */
.admin-menu::-webkit-scrollbar {
  width: 6px;
}
.admin-menu::-webkit-scrollbar-thumb {
  background: #4a5a74;
  border-radius: 3px;
}

.menu-divider {
  margin: 10px 0;
  border-color: #4a5a74;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}
</style>
