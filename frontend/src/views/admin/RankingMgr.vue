<template>
  <div class="ranking-mgr-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>榜单管理</span>
          <el-button type="primary" :loading="refreshing" @click="refreshRankings">
            立即刷新榜单
          </el-button>
        </div>
      </template>
      
      <div class="info-box">
        <el-alert
          title="榜单说明"
          type="info"
          description="榜单数据通常由系统定时任务自动计算。如需查看最新数据，可点击上方按钮手动触发计算。"
          show-icon
          :closable="false"
        />
      </div>

      <!-- 这里可以展示当前的榜单数据预览，或者配置榜单规则 -->
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import request from '../../utils/request';

const refreshing = ref(false);

const refreshRankings = async () => {
  refreshing.value = true;
  try {
    await request.post('/jobs/refresh');
    ElMessage.success('榜单刷新任务已开始');
  } catch (error) {
    // 错误处理
  } finally {
    refreshing.value = false;
  }
};
</script>

<style scoped>
.ranking-mgr-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-box {
  margin-bottom: 20px;
}
</style>
