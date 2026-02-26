import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly envId = 'cloud1-8gl0blge9ea5f0ca';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    // 从环境变量读取 API Key
    this.apiKey = this.configService.get<string>('TENCENT_CLOUD_TOKEN') || '';
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

    // 如果没有配置 API Key，使用 Base64 存储
    if (!this.apiKey) {
      console.log('未配置云存储 API Key，使用 Base64 存储');
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
      const fileUrl = await this.uploadToCloudBase(file, cloudPath);

      return fileUrl;
    } catch (error) {
      console.error('上传到云存储失败:', error);
      throw new HttpException(
        `上传到云存储失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 上传到腾讯云云开发云存储
   * 使用云开发 HTTP API 上传文件
   */
  private async uploadToCloudBase(
    file: Express.Multer.File,
    cloudPath: string,
  ): Promise<string> {
    // 使用云开发的存储上传 API
    // 参考文档: https://docs.cloudbase.net/api-reference/server/node-sdk/storage.html
    
    // 1. 调用云开发 API 上传文件
    const uploadUrl = `https://api.cloud.tencent.com/tcb/database/storage/upload`;
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('env', this.envId);
    formData.append('path', cloudPath);
    
    // 将 Buffer 转为 Blob
    const uint8Array = new Uint8Array(file.buffer);
    const blob = new Blob([uint8Array], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `ApiKey ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('上传文件失败:', errorText);
      throw new Error(`上传失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('上传响应:', result);
    
    if (result.code !== 'SUCCESS' && result.code !== 0) {
      throw new Error(result.message || '上传失败');
    }

    // 返回文件访问 URL
    // fileID 格式: cloud://envId.fileId
    // 访问 URL 格式: https://envId.tcb.qcloud.la/path
    return `https://636c-cloud1-8gl0blge9ea5f0ca-1333174272.tcb.qcloud.la/${cloudPath}`;
  }
}
