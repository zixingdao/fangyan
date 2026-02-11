<template>
  <el-footer>
    <div class="footer-content">
      <div class="footer-logo">湘音传承</div>
      <div class="footer-links">
        <span>关于我们</span>
        <span>联系合作</span>
        <span>隐私政策</span>
      </div>
      <p class="copyright">© 2026 长沙方言守护计划 | 阿里公司合作项目</p>
    </div>
  </el-footer>
</template>

<style scoped>
.el-footer {
  background-color: #2c3e50;
  color: #fff;
  padding: 40px 20px;
  height: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  font-size: 14px;
  opacity: 0.7;
}

.copyright {
  font-size: 12px;
  opacity: 0.5;
}
</style>
