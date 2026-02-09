<template>
  <div class="user-layout">
    <el-container>
      <AppHeader />
      
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      
      <AppFooter />
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
}

.el-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  padding: 0;
  margin-top: 70px; /* Header height */
  display: flex;
  flex-direction: column;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
