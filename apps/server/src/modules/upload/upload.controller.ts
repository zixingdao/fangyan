import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new HttpException('只支持 JPG、PNG、GIF、WEBP 格式的图片', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return {
      code: 200,
      data: { url },
      msg: '上传成功',
    };
  }
}
