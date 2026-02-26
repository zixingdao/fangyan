import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly envId = 'cloud1-8gl0blge9ea5f0ca';
  private readonly secretId: string;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    // 从环境变量读取密钥
    this.secretId = this.configService.get<string>('TENCENT_SECRET_ID') || '';
    this.secretKey = this.configService.get<string>('TENCENT_SECRET_KEY') || '';
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

    // 如果没有配置密钥，使用 Base64 存储
    if (!this.secretId || !this.secretKey) {
      console.log('未配置云存储密钥，使用 Base64 存储');
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

      // 调用腾讯云 COS API 上传
      const url = await this.uploadToCOS(file, cloudPath);

      // 返回图片访问URL
      return url;
    } catch (error) {
      console.error('上传到云存储失败:', error);
      throw new HttpException(
        `上传到云存储失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 上传到腾讯云 COS
   */
  private async uploadToCOS(
    file: Express.Multer.File,
    cloudPath: string,
  ): Promise<string> {
    // COS 存储桶信息
    const bucket = '636c-cloud1-8gl0blge9ea5f0ca-1333174272';
    const region = 'ap-shanghai';
    const host = `${bucket}.cos.${region}.myqcloud.com`;
    const url = `https://${host}/${cloudPath}`;

    // 生成签名
    const timestamp = Math.floor(Date.now() / 1000);
    const date = new Date().toISOString().split('T')[0];
    const signTime = `${timestamp};${timestamp + 3600}`;

    // 构建签名
    const method = 'PUT';
    const pathname = `/${cloudPath}`;
    
    // 签名密钥
    const signKey = crypto
      .createHmac('sha1', this.secretKey)
      .update(date)
      .digest('hex');
    
    // 构建签名字符串
    const httpString = `${method}\n${pathname}\n\nhost=${host}\n`;
    const stringToSign = `sha1\n${signTime}\n${crypto.createHash('sha1').update(httpString).digest('hex')}\n`;
    const signature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');
    
    // 构建 Authorization
    const authorization = `q-sign-algorithm=sha1&q-ak=${this.secretId}&q-sign-time=${signTime}&q-key-time=${signTime}&q-header-list=host&q-url-param-list=&q-signature=${signature}`;

    // 上传文件
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'Host': host,
        'Content-Type': file.mimetype,
        'Content-Length': file.size.toString(),
      },
      body: file.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('上传文件失败:', errorText);
      throw new Error(`上传失败: ${response.status} - ${errorText}`);
    }

    // 返回访问 URL
    return `https://636c-cloud1-8gl0blge9ea5f0ca-1333174272.tcb.qcloud.la/${cloudPath}`;
  }
}
