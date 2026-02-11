<template>
  <div class="ranking-page">
    <div class="ranking-header">
      <h1>🏆 贡献排行榜</h1>
      <p class="subtitle">感谢每一位为长沙方言保护做出贡献的志愿者</p>
    </div>

    <el-card class="ranking-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="总贡献榜" name="total"></el-tab-pane>
        <!-- 暂时隐藏其他榜单，待后端逻辑完善 -->
        <!-- <el-tab-pane label="今日榜单" name="day"></el-tab-pane> -->
        <!-- <el-tab-pane label="本周榜单" name="week"></el-tab-pane> -->
      </el-tabs>

      <el-table :data="rankingList" stripe style="width: 100%" v-loading="loading">
        <el-table-column label="排名" width="100" align="center">
          <template #default="scope">
            <div class="rank-index">
              <img v-if="scope.$index === 0" src="https://img.icons8.com/color/48/000000/gold-medal.png" alt="1" class="medal-icon"/>
              <img v-else-if="scope.$index === 1" src="https://img.icons8.com/color/48/000000/silver-medal.png" alt="2" class="medal-icon"/>
              <img v-else-if="scope.$index === 2" src="https://img.icons8.com/color/48/000000/bronze-medal.png" alt="3" class="medal-icon"/>
              <span v-else class="rank-number">{{ scope.$index + 1 }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="user.name" label="志愿者" width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="32" :src="scope.row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <span class="username">{{ scope.row.user?.name || '匿名用户' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="user.school" label="所属学校/单位" min-width="200">
           <template #default="scope">
            {{ scope.row.user?.school || '未知' }}
           </template>
        </el-table-column>

        <el-table-column prop="duration" label="累计录制时长" width="180" align="right">
          <template #default="scope">
            <span class="duration-text">{{ formatDuration(scope.row.duration) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="my-ranking" v-if="myRanking">
        <el-divider>我的排名</el-divider>
        <div class="my-rank-info">
          <span>当前排名: <strong>{{ myRanking.rank_number || '未上榜' }}</strong></span>
          <span>累计贡献: <strong>{{ formatDuration(myRanking.duration || 0) }}</strong></span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRankings, getMyRanking } from '../../api/ranking';
import { useAuth } from '../../composables/useAuth';

const { isAuthenticated } = useAuth();
const activeTab = ref('total');
const loading = ref(false);
const rankingList = ref([]);
const myRanking = ref<any>(null);

const fetchRankings = async () => {
  loading.value = true;
  try {
    const res: any = await getRankings(activeTab.value as any);
    rankingList.value = res;
    
    if (isAuthenticated.value) {
      const myRes: any = await getMyRanking();
      myRanking.value = myRes;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleTabChange = () => {
  fetchRankings();
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}小时${mins}分钟`;
};

onMounted(() => {
  fetchRankings();
});
</script>

<style scoped>
.ranking-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}
.ranking-header {
  text-align: center;
  margin-bottom: 40px;
}
.ranking-header h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 10px;
}
.subtitle {
  color: #909399;
  font-size: 1.1rem;
}
.ranking-card {
  min-height: 500px;
}
.rank-index {
  display: flex;
  justify-content: center;
  align-items: center;
}
.medal-icon {
  width: 32px;
  height: 32px;
}
.rank-number {
  font-size: 18px;
  font-weight: bold;
  color: #606266;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-color: #f0f2f5;
  border-radius: 50%;
  display: inline-block;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.username {
  font-weight: 500;
}
.duration-text {
  color: #e6a23c;
  font-weight: bold;
  font-size: 16px;
}
.my-ranking {
  margin-top: 30px;
  text-align: center;
}
.my-rank-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 16px;
  color: #606266;
}
.my-rank-info strong {
  color: #409eff;
  margin-left: 5px;
}
</style>
