<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" :xs="12">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon-wrapper user-bg">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">总用户数</div>
            <div class="stat-value">{{ stats.userCount || 0 }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon-wrapper time-bg">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">录音时长</div>
            <div class="stat-value">{{ stats.totalDuration || 0 }}h</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon-wrapper content-bg">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">方言词条</div>
            <div class="stat-value">{{ stats.contentCount || 0 }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon-wrapper log-bg">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">今日日志</div>
            <div class="stat-value">{{ stats.todayLogs || 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和快捷入口 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16" :xs="24">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>📊 数据趋势</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="user">用户</el-radio-button>
                <el-radio-button label="recording">录音</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表加载中..." />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8" :xs="24">
        <el-card shadow="hover" class="quick-card">
          <template #header>
            <div class="card-header">
              <span>🚀 快捷入口</span>
            </div>
          </template>
          <div class="quick-links">
            <div class="quick-item" @click="$router.push('/admin/users')">
              <el-icon class="quick-icon"><User /></el-icon>
              <span>用户管理</span>
            </div>
            <div class="quick-item" @click="$router.push('/admin/recordings')">
              <el-icon class="quick-icon"><Microphone /></el-icon>
              <span>录音审核</span>
            </div>
            <div class="quick-item" @click="$router.push('/admin/content')">
              <el-icon class="quick-icon"><Collection /></el-icon>
              <span>内容管理</span>
            </div>
            <div class="quick-item" @click="$router.push('/admin/logs')">
              <el-icon class="quick-icon"><Tickets /></el-icon>
              <span>查看日志</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDashboardStats } from '../../api/admin';
import { 
  User, 
  Timer, 
  Document, 
  DataLine, 
  Microphone, 
  Collection, 
  Tickets 
} from '@element-plus/icons-vue';

const loading = ref(false);
const trendType = ref('user');
const stats = ref({
  userCount: 0,
  totalDuration: 0,
  contentCount: 0,
  todayLogs: 0
});

const fetchStats = async () => {
  loading.value = true;
  try {
    const res: any = await getDashboardStats();
    stats.value = res;
  } catch (error) {
    console.error('获取统计失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.stat-card {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
}

:deep(.el-card__body) {
  display: flex;
  align-items: center;
  padding: 0;
  width: 100%;
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #fff;
  margin-right: 15px;
}

.user-bg { background: linear-gradient(135deg, #69c0ff 0%, #409eff 100%); }
.time-bg { background: linear-gradient(135deg, #95de64 0%, #5cdbd3 100%); }
.content-bg { background: linear-gradient(135deg, #ff9c6e 0%, #ffc069 100%); }
.log-bg { background: linear-gradient(135deg, #b37feb 0%, #efdbff 100%); }

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-top: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-item:hover {
  background-color: #ecf5ff;
  transform: translateY(-2px);
  color: #409eff;
}

.quick-icon {
  font-size: 24px;
  margin-bottom: 8px;
}
</style>
