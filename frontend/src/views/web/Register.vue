<template>
  <div class="auth-container">
    <div class="auth-overlay"></div>
    <div class="auth-content">
      <div class="auth-header-text">
        <h2>加入我们</h2>
        <p>成为方言守护者，传承湖湘文化</p>
      </div>
      <el-card class="auth-card">
        <template #header>
          <h2 class="auth-title">注册账号</h2>
        </template>
        
        <el-form :model="registerForm" ref="registerFormRef" :rules="rules" label-width="0" size="large">
          <el-form-item prop="student_id">
            <el-input v-model="registerForm.student_id" placeholder="学号" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="registerForm.name" placeholder="姓名" :prefix-icon="Postcard"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="registerForm.phone" placeholder="手机号" :prefix-icon="Iphone"></el-input>
          </el-form-item>
          <el-form-item prop="school">
            <el-input v-model="registerForm.school" placeholder="学校 (默认邵阳学院)" :prefix-icon="School"></el-input>
          </el-form-item>
          <el-form-item prop="hometown">
            <el-input v-model="registerForm.hometown" placeholder="籍贯" :prefix-icon="Location"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="设置密码" show-password :prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister" :loading="loading" class="full-width login-btn">立即注册</el-button>
          </el-form-item>
          <div class="auth-links">
            <router-link to="/login">已有账号？<span class="highlight">立即登录</span></router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { ElMessage } from 'element-plus';
import { User, Lock, Postcard, Iphone, School, Location } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const registerFormRef = ref();
const loading = ref(false);

const registerForm = reactive({
  student_id: '',
  name: '',
  phone: '',
  school: '邵阳学院',
  hometown: '',
  password: ''
});

const rules = {
  student_id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      const success = await userStore.register(registerForm);
      loading.value = false;
      
      if (success) {
        ElMessage.success('注册成功，请登录');
        router.push('/login');
      } else {
        ElMessage.error('注册失败，请重试');
      }
    }
  });
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background-image: url('@/assets/images/auth-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  margin-top: -20px;
  padding: 40px 0;
}

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.auth-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.auth-header-text {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
}

.auth-header-text h2 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.auth-header-text p {
  font-size: 16px;
  opacity: 0.9;
}

.auth-card {
  width: 100%;
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  background: rgba(255, 255, 255, 0.95);
}

.auth-title {
  text-align: center;
  margin: 0;
  color: #333;
  font-size: 20px;
}

.full-width {
  width: 100%;
}

.login-btn {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background-color: var(--cs-red);
  border-color: var(--cs-red);
  margin-top: 10px;
}

.login-btn:hover {
  background-color: var(--cs-red-dark);
  border-color: var(--cs-red-dark);
}

.auth-links {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}

.auth-links a {
  color: #666;
  text-decoration: none;
}

.highlight {
  color: var(--cs-red);
  font-weight: 600;
}
</style>
