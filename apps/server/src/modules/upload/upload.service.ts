import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly envId = 'cloud1-8gl0blge9ea5f0ca';
  private readonly region = 'ap-shanghai';
  private readonly cloudToken: string;

  constructor(private configService: ConfigService) {
    // 从环境变量读取云存储访问令牌
    this.cloudToken = this.configService.get<string>('TENCENT_CLOUD_TOKEN') || '';
  }

  /**
   * 上传图片到腾讯云云存储
   * @param file 上传的文件
   * @returns 图片访问URL
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new HttpException('请选择要上传的文件', HttpStatus.BAD_REQUEST);
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpException('只支持 JPG、PNG、GIF、WEBP 格式的图片', HttpStatus.BAD_REQUEST);
    }

    // 验证文件大小 (最大 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new HttpException('图片大小不能超过 2MB', HttpStatus.BAD_REQUEST);
    }

    // 如果没有配置 Token，使用 Base64 存储
    if (!this.cloudToken) {
      console.log('未配置云存储 Token，使用 Base64 存储');
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      return `data:${mimeType};base64,${base64}`;
    }

    try {
      // 生成文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.originalname.split('.').pop() || 'png';
      const cloudPath = `page-images/${timestamp}-${randomStr}.${ext}`;

      // 调用云开发 HTTP API 上传
      const url = await this.uploadToCloudStorage(file, cloudPath);

      // 返回图片访问URL
      return url;
    } catch (error) {
      console.error('上传到云存储失败:', error);
      // 如果云存储上传失败，回退到 Base64
      console.log('回退到 Base64 存储');
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      return `data:${mimeType};base64,${base64}`;
    }
  }

  /**
   * 上传到腾讯云云存储
   */
  private async uploadToCloudStorage(
    file: Express.Multer.File,
    cloudPath: string,
  ): Promise<string> {
    // 使用云存储直传方式
    // 1. 获取上传凭证
    const uploadMetadataUrl = `https://${this.envId}.api.tcloudbasegateway.com/v1/env/upload-file`;
    
    const metadataResponse = await fetch(uploadMetadataUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cloudToken}`,
      },
      body: JSON.stringify({
        path: cloudPath,
      }),
    });

    if (!metadataResponse.ok) {
      throw new Error('获取上传凭证失败');
    }

    const metadata = await metadataResponse.json();
    
    if (metadata.code !== 'SUCCESS') {
      throw new Error(metadata.message || '获取上传凭证失败');
    }

    const { url, authorization, token, cosFileId } = metadata.data;

    // 2. 上传到 COS
    const formData = new FormData();
    formData.append('key', cloudPath);
    formData.append('Signature', authorization);
    formData.append('x-cos-security-token', token);
    formData.append('x-cos-meta-fileid', cosFileId);
    
    // 将 Buffer 转换为 Uint8Array 再转为 Blob
    const uint8Array = new Uint8Array(file.buffer);
    const blob = new Blob([uint8Array], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`上传失败: ${uploadResponse.statusText}`);
    }

    // 3. 返回访问 URL
    return `https://${this.envId}.tcb.qcloud.la/${cloudPath}`;
  }
}
