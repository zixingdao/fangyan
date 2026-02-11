<template>
  <div class="auth-container">
    <div class="auth-overlay"></div>
    <div class="auth-content">
      <div class="auth-header-text">
        <h2>欢迎回来</h2>
        <p>继续您的方言守护之旅</p>
      </div>
      <el-card class="auth-card">
        <template #header>
          <h2 class="auth-title">登录</h2>
        </template>
        
        <el-form :model="loginForm" ref="loginFormRef" :rules="rules" label-width="0" size="large">
          <el-form-item prop="student_id">
            <el-input v-model="loginForm.student_id" placeholder="请输入学号" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password :prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" class="full-width login-btn">立即登录</el-button>
          </el-form-item>
          <div class="auth-links">
            <el-button link type="primary" @click="showResetDialog = true">忘记密码？</el-button>
            <router-link to="/register">没有账号？<span class="highlight">立即注册</span></router-link>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 密码重置申请弹窗 -->
    <el-dialog v-model="showResetDialog" title="申请重置密码" width="400px">
      <el-form :model="resetForm" ref="resetFormRef" :rules="resetRules" label-width="80px">
        <el-form-item label="学号" prop="student_id">
          <el-input v-model="resetForm.student_id" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="resetForm.phone" placeholder="请输入注册手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input v-model="resetForm.reason" type="textarea" placeholder="请输入重置理由"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showResetDialog = false">取消</el-button>
        <el-button type="primary" @click="handleResetRequest" :loading="resetLoading">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import request from '../../utils/request';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const loading = ref(false);

// 密码重置相关
const showResetDialog = ref(false);
const resetFormRef = ref();
const resetLoading = ref(false);
const resetForm = reactive({
  student_id: '',
  phone: '',
  reason: ''
});

const loginForm = reactive({
  student_id: '',
  password: ''
});

const rules = {
  student_id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const resetRules = {
  student_id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入申请理由', trigger: 'blur' }]
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      const result = await userStore.login(loginForm);
      loading.value = false;
      
      if (result.success) {
        ElMessage.success('登录成功');
        router.push('/');
      } else {
        ElMessage.error(result.message || '登录失败，请检查账号密码');
      }
    }
  });
};

const handleResetRequest = async () => {
  if (!resetFormRef.value) return;

  await resetFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      resetLoading.value = true;
      try {
        await request.post('/auth/reset-request', resetForm);
        ElMessage.success('申请提交成功，请等待管理员审核。通过后密码将重置为 123456');
        showResetDialog.value = false;
        resetFormRef.value.resetFields();
      } catch (error) {
        console.error(error);
      } finally {
        resetLoading.value = false;
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
  min-height: calc(100vh - 70px); /* 减去 header 高度 */
  background-image: url('@/assets/images/auth-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  margin-top: -20px; /* 抵消 main padding */
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
  max-width: 400px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
