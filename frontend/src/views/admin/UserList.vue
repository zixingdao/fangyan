<template>
  <div class="user-list-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="用户管理" name="users">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="student_id" label="学号" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column prop="school" label="学校" width="150" />
            <el-table-column prop="total_duration" label="总时长(分)" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusTag(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.status === 0" 
                  type="success" 
                  size="small" 
                  @click="handleApprove(scope.row)"
                >通过</el-button>
                <el-button 
                  v-if="scope.row.status !== 2" 
                  type="danger" 
                  size="small" 
                  @click="handleBan(scope.row)"
                >封禁</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="密码重置申请" name="reset-requests">
          <div class="tab-content">
            <el-radio-group v-model="resetStatus" size="small" @change="fetchResetRequests" style="margin-bottom: 20px;">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button :value="0">待审核</el-radio-button>
              <el-radio-button :value="1">已通过</el-radio-button>
              <el-radio-button :value="2">已拒绝</el-radio-button>
            </el-radio-group>

            <el-table :data="resetRequests" v-loading="loading">
              <el-table-column prop="student_id" label="学号" width="120" />
              <el-table-column prop="phone" label="手机号" width="120" />
              <el-table-column prop="reason" label="申请理由" />
              <el-table-column prop="created_at" label="申请时间" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.created_at).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getResetStatusType(scope.row.status)">
                    {{ getResetStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <div v-if="scope.row.status === 0">
                    <el-button type="success" size="small" @click="auditReset(scope.row, 1)">通过</el-button>
                    <el-button type="danger" size="small" @click="auditReset(scope.row, 2)">拒绝</el-button>
                  </div>
                  <span v-else class="text-gray">已处理 ({{ scope.row.admin_remark || '无备注' }})</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '../../utils/request';

const activeTab = ref('users');
const loading = ref(false);
const tableData = ref([]);
const resetRequests = ref([]);
const resetStatus = ref<string | number>(0);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res: any = await request.get('/admin/users');
    tableData.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleBan = (row: any) => {
  ElMessageBox.confirm(`确定要封禁用户 ${row.name} 吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await request.put(`/admin/users/${row.id}/ban`);
      ElMessage.success('用户已封禁');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  });
};

const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过用户 ${row.name} 的试音审核吗？`, '提示', {
    type: 'success'
  }).then(async () => {
    try {
      await request.put(`/admin/users/${row.id}/approve`);
      ElMessage.success('用户审核已通过');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  });
};

const getStatusTag = (status: number) => {
  if (status === 0) return 'warning';
  if (status === 1) return 'success';
  if (status === 2) return 'danger';
  return 'info';
};

const getStatusText = (status: number) => {
  if (status === 0) return '待审核';
  if (status === 1) return '正常';
  if (status === 2) return '封禁';
  return '未知';
};

const fetchResetRequests = async () => {
  loading.value = true;
  try {
    const res: any = await request.get('/admin/reset-requests', {
      params: { status: resetStatus.value }
    });
    resetRequests.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const auditReset = async (row: any, status: number) => {
  const actionText = status === 1 ? '通过' : '拒绝';
  ElMessageBox.prompt(`请输入${actionText}备注（可选）`, '审核', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async ({ value }: any) => {
    try {
      await request.post(`/admin/reset-requests/${row.id}/audit`, {
        status,
        admin_remark: value
      });
      ElMessage.success('审核完成');
      fetchResetRequests();
    } catch (error) {
      console.error(error);
    }
  }).catch(() => {});
};

const getResetStatusType = (status: number) => {
  return status === 1 ? 'success' : status === 2 ? 'danger' : 'warning';
};

const getResetStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  };
  return map[status] || '未知';
};

watch(activeTab, (val) => {
  if (val === 'users') fetchUsers();
  else if (val === 'reset-requests') fetchResetRequests();
});

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}
.text-gray {
  color: #909399;
  font-size: 12px;
}
</style>
