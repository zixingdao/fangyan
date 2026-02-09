<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>
      
      <div class="user-info">
        <el-descriptions title="基本信息" border>
          <el-descriptions-item label="姓名">{{ userStore.user?.name }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ userStore.user?.student_id }}</el-descriptions-item>
          <el-descriptions-item label="录制总时长">
            <el-tag size="small">{{ formatDuration(totalDuration) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="recordings-list">
        <h3>我的录音记录</h3>
        <el-table :data="recordings" style="width: 100%" v-loading="loading">
          <el-table-column prop="upload_time" label="上传时间" width="180">
            <template #default="scope">
              {{ new Date(scope.row.upload_time).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="时长" width="120">
            <template #default="scope">
              {{ formatDuration(scope.row.duration) }}
            </template>
          </el-table-column>
          <el-table-column label="试听">
             <template #default="scope">
                <audio :src="scope.row.file_url" controls class="mini-player"></audio>
             </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/user';
import request from '../../utils/request';

const userStore = useUserStore();
const recordings = ref<any[]>([]);
const loading = ref(false);

const totalDuration = computed(() => {
  return recordings.value.reduce((sum, item) => sum + (item.duration || 0), 0);
});

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s}秒`;
};

const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'danger'
  };
  return map[status] || 'info';
};

const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  };
  return map[status] || '未知';
};

onMounted(async () => {
  loading.value = true;
  try {
    const res: any = await request.get('/upload/my');
    recordings.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 20px auto;
}
.user-info {
  margin-bottom: 40px;
}
.mini-player {
  height: 30px;
  width: 200px;
}
</style>
