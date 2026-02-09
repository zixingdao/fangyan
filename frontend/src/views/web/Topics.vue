<template>
  <div class="topics-container">
    <div class="page-header">
      <h1>🗣️ 话题场景</h1>
      <p>不知道说什么？选个话题开始聊吧！</p>
    </div>

    <el-tabs v-model="activeType" class="topic-tabs" @tab-change="fetchTopics">
      <el-tab-pane label="单人话题" :name="1"></el-tab-pane>
      <el-tab-pane label="多人场景" :name="2"></el-tab-pane>
    </el-tabs>

    <div class="topics-list" v-loading="loading">
      <el-empty v-if="topics.length === 0" description="暂无话题数据" />
      
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="topic in topics" :key="topic.id">
          <el-card class="topic-card" shadow="hover">
            <h3>{{ topic.title }}</h3>
            <p class="topic-content">{{ topic.content }}</p>
            <div class="card-footer">
              <el-button type="primary" plain size="small" @click="useTopic(topic)">
                使用此话题
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '../../utils/request';

const router = useRouter();
const activeType = ref(1); // 1: 单人, 2: 多人
const loading = ref(false);
const topics = ref<any[]>([]);

const fetchTopics = async () => {
  loading.value = true;
  try {
    const res: any = await request.get('/content/topics', {
      params: { type: activeType.value }
    });
    topics.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const useTopic = (topic: any) => {
  // 可以将话题内容传递给录制页面，这里简单跳转
  router.push({
    path: '/record',
    query: { 
      type: activeType.value,
      topic: topic.title 
    }
  });
};

onMounted(() => {
  fetchTopics();
});
</script>

<style scoped>
.topics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 18px;
}

.topic-tabs {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.topic-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  transition: all 0.3s;
  border-radius: 12px;
}

.topic-card:hover {
  transform: translateY(-5px);
}

.topic-card h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.topic-content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 20px;
  min-height: 60px;
}

.card-footer {
  text-align: right;
}
</style>
