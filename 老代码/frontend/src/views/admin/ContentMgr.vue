<template>
  <div class="content-mgr-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="话题管理" name="topics">
          <div class="tab-content">
            <div class="toolbar">
              <el-button type="primary" :icon="Plus" @click="showAddTopicDialog">新增话题</el-button>
            </div>
            
            <el-table :data="topics" v-loading="loading">
              <el-table-column prop="title" label="标题" width="200" />
              <el-table-column prop="content" label="内容" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" width="120">
                <template #default="scope">
                  <el-tag :type="scope.row.type === 1 ? 'info' : 'success'">
                    {{ scope.row.type === 1 ? '单人话题' : '多人场景' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" link @click="editTopic(scope.row)">编辑</el-button>
                  <el-button type="danger" link @click="deleteTopic(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="录制指南" name="guide">
          <div class="tab-content" v-loading="loading">
            <el-form label-position="top">
              <el-form-item label="单人录制引导文案">
                <el-input 
                  v-model="guideForm.single" 
                  type="textarea" 
                  :rows="6" 
                  placeholder="请输入单人录制的引导内容"
                />
              </el-form-item>
              <el-form-item label="多人对话引导文案">
                <el-input 
                  v-model="guideForm.multi" 
                  type="textarea" 
                  :rows="6" 
                  placeholder="请输入多人对话的引导内容"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveGuide">保存配置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 话题编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑话题' : '新增话题'" width="500px">
      <el-form :model="topicForm" label-width="80px">
        <el-form-item label="类型">
          <el-radio-group v-model="topicForm.type">
            <el-radio :value="1">单人话题</el-radio>
            <el-radio :value="2">多人场景</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="topicForm.title" placeholder="如：家乡的美食" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="topicForm.content" type="textarea" :rows="4" placeholder="话题的具体描述或引导问题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTopic">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '../../utils/request';
import { Plus } from '@element-plus/icons-vue';

const activeTab = ref('topics');
const loading = ref(false);
const topics = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);

const guideForm = reactive({
  single: '',
  multi: ''
});

const topicForm = reactive({
  id: 0,
  title: '',
  content: '',
  type: 1
});

// 获取话题列表
const fetchTopics = async () => {
  loading.value = true;
  try {
    const res: any = await request.get('/content/topics');
    topics.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 获取指南内容
const fetchGuide = async () => {
  try {
    const res: any = await request.get('/content/guide');
    guideForm.single = res.single;
    guideForm.multi = res.multi;
  } catch (error) {
    console.error(error);
  }
};

// 保存指南
const saveGuide = async () => {
  try {
    await request.post('/content/guide', guideForm);
    ElMessage.success('保存成功');
  } catch (error) {
    console.error(error);
  }
};

const showAddTopicDialog = () => {
  isEdit.value = false;
  topicForm.title = '';
  topicForm.content = '';
  topicForm.type = 1;
  dialogVisible.value = true;
};

const editTopic = (row: any) => {
  isEdit.value = true;
  topicForm.id = row.id;
  topicForm.title = row.title;
  topicForm.content = row.content;
  topicForm.type = row.type;
  dialogVisible.value = true;
};

const submitTopic = async () => {
  try {
    if (isEdit.value) {
      await request.put(`/content/topics/${topicForm.id}`, topicForm);
      ElMessage.success('更新成功');
    } else {
      await request.post('/content/topics', topicForm);
      ElMessage.success('创建成功');
    }
    dialogVisible.value = false;
    fetchTopics();
  } catch (error) {
    console.error(error);
  }
};

const deleteTopic = (row: any) => {
  ElMessageBox.confirm('确定要删除该话题吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/content/topics/${row.id}`);
      ElMessage.success('删除成功');
      fetchTopics();
    } catch (error) {
      console.error(error);
    }
  });
};

onMounted(() => {
  fetchTopics();
  fetchGuide();
});
</script>

<style scoped>
.content-mgr-container {
  padding: 20px;
}
.tab-content {
  padding: 20px 0;
}
.toolbar {
  margin-bottom: 20px;
}
</style>
