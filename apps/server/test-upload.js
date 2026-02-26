// 测试云存储上传 - 使用不同的认证方式
const envId = 'cloud1-8gl0blge9ea5f0ca';

// 尝试不同的认证方式
async function testWithDifferentAuth() {
  console.log('=== 测试不同认证方式 ===\n');
  
  // 创建测试图片 (1x1 像素 PNG)
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  const timestamp = Date.now();
  const cloudPath = `方言采集数据/test-image-${timestamp}.png`;

  console.log('环境 ID:', envId);
  console.log('云路径:', cloudPath, '\n');

  // 方式1: 使用环境变量中的 API Key (TENCENT_CLOUD_TOKEN)
  const apiKeyFromEnv = process.env.TENCENT_CLOUD_TOKEN;
  
  // 方式2: 使用硬编码的 API Key
  const apiKeyHardcoded = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMWRjMzFlLWI0ZDAtNDQ4Yi1hNzZmLWIwY2M2M2Q4MTQ5OCJ9.eyJhdWQiOiJjbG91ZDEtOGdsMGJsZ2U5ZWE1ZjBjYSIsImV4cCI6MjUzNDAyMzAwNzk5LCJpYXQiOjE3NzIxMDA5NjYsImF0X2hhc2giOiJWRk5IQXdhWFNKNmVrWFYwU2JFVkVBIiwicHJvamVjdF9pZCI6ImNsb3VkMS04Z2wwYmxnZTllYTVmMGNhIiwibWV0YSI6eyJwbGF0Zm9ybSI6IkFwaUtleSJ9LCJhZG1pbmlzdHJhdG9yX2lkIjoiMTk0MzIwMTg0MTgxMTkwNjU2MiIsInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3NlcnZlciIsImlzX3N5c3RlbV9hZG1pbiI6dHJ1ZX0.WrBBynWmBIvnvXzSPxUGGMsjoXgQKKcsdzIB6NDHXM2LrANoP4xe4brpIeyNgYN-3pqyxcJkOqzmijB7ZcY6Bg8ZnvHXc8nz-cn0NXOhnYS8Vcu4htKXGsiwHhA89FbFhWusjcTCpXvKKbrMxmdmGRVmDCV7wvpVDLwzjcBOfLh5ivSXamYSumgtEp95B49rV-LYNja01m1JjKxrRhTfGx8LJHx-mexYcbxyjLU53-49Zv6ATc2vGR_uRFDKzZWCV-L9w-TAmME_HxfzTAbqY6diqC20ElXJeCGQFHdUlXzgX-_3fFq_BbNB_A9G0r0D3ZPWiE_uRegPVU6I45QBmw';

  const apiKey = apiKeyFromEnv || apiKeyHardcoded;

  // 测试不同的认证头部格式
  const authMethods = [
    {
      name: 'ApiKey 头部',
      headers: { 'Authorization': `ApiKey ${apiKey}` }
    },
    {
      name: 'Bearer Token',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    {
      name: 'X-API-Key 头部',
      headers: { 'X-API-Key': apiKey }
    },
    {
      name: '直接作为 Token',
      headers: { 'Authorization': apiKey }
    }
  ];

  const gatewayUrl = `https://${envId}.api.tcloudbasegateway.com/v1/env/upload-file`;

  for (const method of authMethods) {
    console.log(`\n测试: ${method.name}`);
    console.log('头部:', JSON.stringify(method.headers).substring(0, 80) + '...');
    
    try {
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...method.headers,
        },
        body: JSON.stringify({ path: cloudPath }),
      });

      console.log('状态码:', response.status);
      
      const result = await response.text();
      console.log('响应:', result.substring(0, 200));

      if (response.ok) {
        console.log('✅ 认证成功!');
        break;
      }
    } catch (error) {
      console.error('❌ 请求失败:', error.message);
    }
  }
}

testWithDifferentAuth();
