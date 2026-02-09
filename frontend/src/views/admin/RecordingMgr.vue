<template>
  <div class="recording-mgr-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>录音审核管理</span>
          <el-radio-group v-model="filterStatus" size="small" @change="fetchRecordings">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button :value="2">已标注(待审核)</el-radio-button>
            <el-radio-button :value="3">审核通过</el-radio-button>
            <el-radio-button :value="4">审核拒绝</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-table :data="recordings" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户" width="150">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="24">{{ scope.row.user?.name?.charAt(0) || 'U' }}</el-avatar>
              <span class="username">{{ scope.row.user?.name || '未知用户' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="record_type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.record_type === 1 ? 'info' : 'success'">
              {{ scope.row.record_type === 1 ? '单人' : '多人' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长(秒)" width="100" />
        <el-table-column prop="createdAt" label="上传时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="录音播放" width="300">
          <template #default="scope">
            <audio controls :src="getAudioUrl(scope.row.file_url)" class="audio-player"></audio>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <div v-if="scope.row.status === 2 || scope.row.status === 0">
              <el-button type="success" size="small" @click="auditRecording(scope.row, 3)">通过</el-button>
              <el-button type="danger" size="small" @click="auditRecording(scope.row, 4)">拒绝</el-button>
            </div>
            <span v-else class="text-gray">
              {{ scope.row.remark ? `备注: ${scope.row.remark}` : '已处理' }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchRecordings"
          @current-change="fetchRecordings"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '../../utils/request';

const loading = ref(false);
const recordings = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const filterStatus = ref<string | number>('all');

const fetchRecordings = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value
    };
    if (filterStatus.value !== 'all') {
      params.status = filterStatus.value;
    }
    
    const res: any = await request.get('/admin/recordings', { params });
    recordings.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const auditRecording = (row: any, status: number) => {
  const actionText = status === 3 ? '通过' : '拒绝';
  ElMessageBox.prompt(`请输入${actionText}备注（可选）`, '审核录音', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async ({ value }: any) => {
    try {
      await request.put(`/admin/recordings/${row.id}/audit`, {
        status,
        remark: value
      });
      ElMessage.success('操作成功');
      fetchRecordings();
    } catch (error) {
      console.error(error);
    }
  }).catch(() => {});
};

const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'info'; // 待标注
    case 1: return 'primary'; // 标注中
    case 2: return 'warning'; // 已标注(待审核)
    case 3: return 'success'; // 审核通过
    case 4: return 'danger'; // 审核拒绝
    default: return 'info';
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待标注';
    case 1: return '标注中';
    case 2: return '已标注';
    case 3: return '审核通过';
    case 4: return '审核拒绝';
    default: return '未知';
  }
};

const getAudioUrl = (url: string) => {
  if (!url) return '';
  // 如果是相对路径，添加后端基础URL
  if (url.startsWith('http')) return url;
  
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace('/api', '');
  return `${baseUrl}${url}`;
};

onMounted(() => {
  fetchRecordings();
});
</script>

<style scoped>
.recording-mgr-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.audio-player {
  height: 40px;
  width: 100%;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.text-gray {
  color: #909399;
  font-size: 12px;
}
</style>