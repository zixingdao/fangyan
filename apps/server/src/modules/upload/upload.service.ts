import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 动态导入 cloudbase，避免 TypeScript 编译错误
const cloudbase = require('@cloudbase/node-sdk');

@Injectable()
export class UploadService {
  private readonly envId = 'cloud1-8gl0blge9ea5f0ca';
  private readonly secretId: string;
  private readonly secretKey: string;
  private app: any;

  constructor(private configService: ConfigService) {
    // 从环境变量读取腾讯云 API 密钥
    // 支持两种变量名：SecretId/SecretKey 或 TENCENT_SECRET_ID/TENCENT_SECRET_KEY
    this.secretId = this.configService.get<string>('SecretId') || 
                    this.configService.get<string>('TENCENT_SECRET_ID') || '';
    this.secretKey = this.configService.get<string>('SecretKey') || 
                     this.configService.get<string>('TENCENT_SECRET_KEY') || '';

    // 初始化云开发
    if (this.secretId && this.secretKey) {
      this.app = cloudbase.init({
        env: this.envId,
        secretId: this.secretId,
        secretKey: this.secretKey,
      });
    }
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

    // 如果没有配置密钥，报错提示
    if (!this.secretId || !this.secretKey || !this.app) {
      throw new HttpException(
        '未配置腾讯云云存储密钥，请在环境变量中设置 TENCENT_SECRET_ID 和 TENCENT_SECRET_KEY',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      // 生成文件名 - 上传到方言采集数据文件夹
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.originalname.split('.').pop() || 'png';
      const cloudPath = `方言采集数据/page-images/${timestamp}-${randomStr}.${ext}`;

      console.log('开始上传到云存储...');
      console.log('云路径:', cloudPath);

      // 使用云开发 SDK 上传文件
      const result = await this.app.uploadFile({
        cloudPath: cloudPath,
        fileContent: file.buffer,
      });

      console.log('上传成功:', result);

      // 返回文件访问 URL
      return `https://636c-cloud1-8gl0blge9ea5f0ca-1333174272.tcb.qcloud.la/${cloudPath}`;
    } catch (error) {
      console.error('上传到云存储失败:', error);
      throw new HttpException(
        `上传到云存储失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
