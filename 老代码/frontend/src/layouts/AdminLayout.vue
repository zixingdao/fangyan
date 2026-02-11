<template>
  <div class="admin-layout">
    <el-container class="layout-container">
      <AdminSidebar />
      
      <el-container direction="vertical">
        <AdminHeader />
        
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '../components/layout/AdminSidebar.vue';
import AdminHeader from '../components/layout/AdminHeader.vue';
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
