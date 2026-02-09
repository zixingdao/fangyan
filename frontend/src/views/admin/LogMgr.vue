<template>
  <div class="log-mgr-container">
    <el-card>
      <div class="filter-bar">
        <el-select v-model="filter.type" placeholder="日志类型" clearable style="width: 150px">
          <el-option label="用户" value="user" />
          <el-option label="管理员" value="admin" />
          <el-option label="系统" value="system" />
        </el-select>
        
        <el-input 
          v-model="filter.keyword" 
          placeholder="搜索操作/详情" 
          style="width: 200px" 
          clearable 
          @keyup.enter="fetchLogs"
        />
        
        <el-date-picker
          v-model="filter.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />

        <el-button type="primary" @click="fetchLogs">查询</el-button>
        <el-button type="success" @click="exportLogs">导出</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="created_at" label="时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="80">
          <template #default="scope">
            <el-tag :type="getLevelTag(scope.row.level)" effect="plain">{{ scope.row.level.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户" width="150">
          <template #default="scope">
            <span v-if="scope.row.user">{{ scope.row.user.name }} ({{ scope.row.user.student_id }})</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="180" />
        <el-table-column prop="details" label="详情" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP" width="140" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getSystemLogs } from '../../api/admin';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const tableData = ref([]);
const filter = reactive({
  type: '',
  keyword: '',
  dateRange: [] as string[]
});

const fetchLogs = async () => {
  loading.value = true;
  try {
    const params: any = {
      type: filter.type || 'all',
      keyword: filter.keyword
    };
    if (filter.dateRange && filter.dateRange.length === 2) {
      params.startDate = filter.dateRange[0];
      params.endDate = filter.dateRange[1];
    }
    const res: any = await getSystemLogs(params);
    tableData.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getTypeTag = (type: string) => {
  const map: Record<string, string> = { user: '', admin: 'warning', system: 'info' };
  return map[type] || '';
};

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = { user: '用户', admin: '管理员', system: '系统' };
  return map[type] || type;
};

const getLevelTag = (level: string) => {
  const map: Record<string, string> = { info: 'info', warn: 'warning', error: 'danger' };
  return map[level] || 'info';
};

const exportLogs = () => {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出');
    return;
  }
  
  const headers = ['时间', '类型', '级别', '用户', '操作', '详情', 'IP'];
  const rows = tableData.value.map((row: any) => [
    new Date(row.created_at).toLocaleString(),
    row.type,
    row.level,
    row.user ? `${row.user.name}(${row.user.student_id})` : '-',
    row.action,
    row.details || '',
    row.ip || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(c => `"${c}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `system_logs_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
};

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.log-mgr-container {
  padding: 20px;
}
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>
