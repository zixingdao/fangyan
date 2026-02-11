<template>
  <div class="immersive-guide">
    <!-- 左侧导航区 -->
    <div class="sidebar">
      <div class="mode-switch">
        <div 
          class="mode-item" 
          :class="{ active: currentMode === 'single' }"
          @click="currentMode = 'single'"
        >
          <span class="icon">👤</span>
          <span>单人录制</span>
        </div>
        <div 
          class="mode-item" 
          :class="{ active: currentMode === 'multi' }"
          @click="currentMode = 'multi'"
        >
          <span class="icon">👥</span>
          <span>多人对话</span>
        </div>
      </div>

      <div class="topic-list">
        <div class="list-title">话题列表</div>
        <div 
          v-for="(item, index) in currentScenarios" 
          :key="index"
          class="topic-item"
          :class="{ active: currentTopicIndex === index }"
          @click="currentTopicIndex = index"
        >
          <span class="index">{{ index + 1 }}</span>
          <span class="text">{{ item.title }}</span>
        </div>
      </div>

      <div class="tips-box">
        <div class="tips-title">💡 录制小贴士</div>
        <ul class="tips-content">
          <li v-for="(tip, index) in currentTips" :key="index">{{ tip }}</li>
        </ul>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <div class="content-wrapper" v-if="currentScenario">
        <div class="scenario-header">
          <h2 class="scenario-title">{{ currentScenario.title }}</h2>
          <p class="scenario-desc" v-if="currentScenario.description">{{ currentScenario.description }}</p>
          
          <div class="angles-box" v-if="currentScenario.angles && currentScenario.angles.length > 0">
            <div class="angles-title">👉 推荐叙述角度</div>
            <div class="angles-list">
              <div v-for="(angle, idx) in currentScenario.angles" :key="idx" class="angle-item">
                <span class="angle-point"></span>
                {{ angle }}
              </div>
            </div>
          </div>
        </div>

        <div class="prompter-area">
          <!-- 单人模式的问题列表 -->
          <template v-if="currentMode === 'single'">
            <div 
              v-for="(q, qIndex) in currentScenario.questions" 
              :key="qIndex" 
              class="prompter-line"
            >
              {{ q }}
            </div>
          </template>

          <!-- 多人模式的话题标签 -->
          <template v-else>
            <div class="topic-tags-container">
              <div 
                v-for="(topic, tIndex) in currentScenario.topics" 
                :key="tIndex" 
                class="prompter-tag"
              >
                {{ topic }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import guideData from '../../assets/data/guide.json';

const currentMode = ref<'single' | 'multi'>('single');
const currentTopicIndex = ref(0);

// 监听模式切换，重置话题索引
watch(currentMode, () => {
  currentTopicIndex.value = 0;
});

const currentData = computed(() => {
  return guideData[currentMode.value];
});

const currentScenarios = computed(() => {
  return currentData.value.scenarios;
});

const currentTips = computed(() => {
  return currentData.value.tips;
});

const currentScenario = computed(() => {
  return currentScenarios.value[currentTopicIndex.value];
});
</script>

<style scoped>
.immersive-guide {
  display: flex;
  flex: 1;
  min-height: 0;
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 20px;
}

/* 左侧侧边栏 */
.sidebar {
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-shrink: 0;
  overflow-y: hidden;
}

.mode-switch {
  display: flex;
  background-color: #f0f2f5;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.mode-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mode-item.active {
  background-color: #fff;
  color: var(--cs-red);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-weight: bold;
}

.list-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
  font-weight: 600;
  padding-left: 10px;
}

.topic-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.topic-item {
  display: flex;
  align-items: center;
  padding: 15px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.topic-item:hover {
  background-color: #f5f7fa;
}

.topic-item.active {
  background-color: var(--cs-red-light);
  color: var(--cs-red-dark);
}

.topic-item .index {
  width: 24px;
  height: 24px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  color: #666;
}

.topic-item.active .index {
  background-color: var(--cs-red);
  color: #fff;
}

.topic-item .text {
  font-weight: 500;
}

.tips-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff8e6;
  border-radius: 8px;
  border: 1px solid #ffe8b6;
  flex-shrink: 0;
}

.tips-title {
  font-size: 14px;
  font-weight: bold;
  color: #e6a23c;
  margin-bottom: 10px;
}

.tips-content {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #8c6d3f;
}

.tips-content li {
  margin-bottom: 4px;
}

/* 右侧主内容区 */
.main-content {
  flex: 1;
  background-color: #fff;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  min-height: 0;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.scenario-header {
  margin-bottom: 50px;
}

.scenario-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
  font-weight: 800;
}

.scenario-desc {
  font-size: 18px;
  color: #666;
  font-weight: 300;
  margin-bottom: 25px;
}

.angles-box {
  background-color: #ecf5ff;
  border-radius: 12px;
  padding: 15px 25px;
  display: inline-block;
  text-align: left;
  border: 1px solid #d9ecff;
}

.angles-title {
  font-size: 14px;
  color: #409eff;
  font-weight: bold;
  margin-bottom: 10px;
}

.angles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.angle-item {
  font-size: 15px;
  color: #555;
  display: flex;
  align-items: center;
}

.angle-point {
  width: 6px;
  height: 6px;
  background-color: #409eff;
  border-radius: 50%;
  margin-right: 10px;
}

.prompter-area {
  background-color: #fafafa;
  border-radius: 20px;
  padding: 40px;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
}

.prompter-line {
  font-size: 28px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 500;
}

.prompter-line:last-child {
  margin-bottom: 0;
}

.topic-tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.prompter-tag {
  font-size: 24px;
  padding: 15px 30px;
  background-color: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  color: #555;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .immersive-guide {
    flex-direction: column;
    height: auto;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .main-content {
    padding: 30px 20px;
  }

  .prompter-line {
    font-size: 20px;
  }
  
  .scenario-title {
    font-size: 24px;
  }
}
</style>
