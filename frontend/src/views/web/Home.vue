<template>
  <div class="home">
    <!-- Hero Banner -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">阿里公益 × 邵阳学院</div>
        <h1 class="main-title">守护湘音，留住乡愁</h1>
        <p class="sub-title">加入长沙方言语音采集计划，为人工智能注入湖湘文化基因</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">2,300+</span>
            <span class="stat-label">参与人数</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">500h+</span>
            <span class="stat-label">采集时长</span>
          </div>
        </div>
        <div class="cta-group">
          <el-button size="large" class="learn-btn" @click="$router.push('/guide')">
            查看录制指南
          </el-button>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="section features-section">
      <div class="container">
        <h2 class="section-title">参与方式</h2>
        <el-row :gutter="30">
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="card-icon">🎙️</div>
              <h3>单人朗读</h3>
              <p>朗读指定文章或自由讲述长沙故事，适合所有方言使用者。</p>
              <div class="card-tag">推荐</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="card-icon">🗣️</div>
              <h3>多人对话</h3>
              <p>邀请亲友进行自然对话，还原最真实的家庭、生活交流场景。</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-card">
              <div class="card-icon">🎁</div>
              <h3>丰厚奖励</h3>
              <p>根据录制有效时长发放奖金，优秀者颁发官方荣誉证书。</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- Cultural Section -->
    <div class="section culture-section">
      <div class="container">
        <el-row align="middle" :gutter="50">
          <el-col :xs="24" :md="12">
            <div class="culture-img">
              <img :src="cultureFoodImg" alt="Changsha Food" />
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="culture-text">
              <h2>策一下长沙话</h2>
              <p>长沙话，属于湘方言长益片，是湖湘文化的活化石。它霸得蛮，耐得烦，在此次采集中，我们希望记录下最地道的发音。</p>
              <p>“恰饭哒冒？”、“搞醉哒”、“在这方言里，听见回家的路。”</p>
              <el-button type="primary" plain class="culture-btn" @click="$router.push('/topics')">查看热门话题</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cultureFoodImg from '@/assets/images/culture-food.jpg';
</script>

<style scoped>
.home {
  width: 100%;
}

.hero-section {
  position: relative;
  height: 600px;
  background-image: url('@/assets/images/home-bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background-color: rgba(211, 47, 47, 0.9);
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  color: #fff;
}

.sub-title {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 32px;
  font-weight: bold;
  color: #FFCDD2;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.start-btn {
  padding: 25px 40px;
  font-size: 18px;
  border-radius: 50px;
  background-color: var(--cs-red);
  border: none;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
  transition: transform 0.2s;
}

.start-btn:hover {
  transform: translateY(-2px);
  background-color: var(--cs-red-dark);
}

.learn-btn {
  padding: 25px 40px;
  font-size: 18px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
}

.learn-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 50px;
  color: #333;
}

.feature-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  margin-bottom: 20px;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 22px;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.card-tag {
  position: absolute;
  top: 20px;
  right: -30px;
  background-color: var(--cs-red);
  color: #fff;
  padding: 5px 30px;
  transform: rotate(45deg);
  font-size: 12px;
}

.culture-section {
  background-color: #fff;
}

.culture-img img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.culture-text h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.culture-text p {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 20px;
}

.culture-btn {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  .hero-stats {
    gap: 20px;
  }
  .culture-text {
    margin-top: 30px;
  }
}
</style>
