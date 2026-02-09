<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-form :model="form" label-width="150px" v-loading="loading">
        <el-divider content-position="left">标注配置</el-divider>
        <el-form-item label="标注平台链接">
          <el-input v-model="form.annotation_url" placeholder="请输入第三方标注平台的URL" />
          <div class="form-tip">用户上传录音后，将引导跳转至此链接进行标注。</div>
        </el-form-item>

        <el-divider content-position="left">试音配置</el-divider>
        <el-form-item label="试音群二维码URL">
          <el-input v-model="form.audition_qrcode" placeholder="请输入图片URL (如: /uploads/qr.png)" />
          <div class="form-tip">用于在待审核页面展示的二维码图片地址。</div>
        </el-form-item>
        <el-form-item label="试音进度查询链接">
          <el-input v-model="form.audition_query_url" placeholder="请输入查询链接" />
          <div class="form-tip">用户点击后跳转查询试音进度的外部链接。</div>
        </el-form-item>

        <el-divider content-position="left">录制限制</el-divider>
        <el-form-item label="单人录制上限(小时)">
          <el-input-number v-model="form.single_limit" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="多人录制上限(小时)">
          <el-input-number v-model="form.multi_limit" :min="1" :max="500" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '../../utils/request';

const loading = ref(false);
const form = ref({
  annotation_url: '',
  audition_qrcode: '',
  audition_query_url: '',
  single_limit: 20,
  multi_limit: 100
});

const fetchSettings = async () => {
  loading.value = true;
  try {
    // 实际应该批量获取，这里简化为逐个获取或假设有个批量接口
    // 为了兼容之前的后端实现，我们分别获取
    const res1: any = await request.get('/system/annotation_url');
    if (res1) form.value.annotation_url = res1.value;

    const res2: any = await request.get('/system/single_limit');
    if (res2) form.value.single_limit = parseInt(res2.value);

    const res3: any = await request.get('/system/multi_limit');
    if (res3) form.value.multi_limit = parseInt(res3.value);

    const res4: any = await request.get('/system/audition_qrcode');
    if (res4) form.value.audition_qrcode = res4.value;

    const res5: any = await request.get('/system/audition_query_url');
    if (res5) form.value.audition_query_url = res5.value;

  } catch (error) {
    // 忽略404
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  loading.value = true;
  try {
    await request.post('/system', {
      key: 'annotation_url',
      value: form.value.annotation_url,
      description: '第三方标注平台链接'
    });
    
    await request.post('/system', {
      key: 'single_limit',
      value: form.value.single_limit.toString(),
      description: '单人录制时长上限'
    });

    await request.post('/system', {
      key: 'multi_limit',
      value: form.value.multi_limit.toString(),
      description: '多人录制时长上限'
    });

    await request.post('/system', {
      key: 'audition_qrcode',
      value: form.value.audition_qrcode,
      description: '试音群二维码'
    });

    await request.post('/system', {
      key: 'audition_query_url',
      value: form.value.audition_query_url,
      description: '试音进度查询链接'
    });

    ElMessage.success('配置保存成功');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>

<style scoped>
.settings-container {
  padding: 20px;
}
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>
