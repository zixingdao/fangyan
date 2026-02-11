import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UploadRecordingDto } from './dto/create-recording.dto';
import { RecordingsService } from './recordings.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recordings')
@UseGuards(AuthGuard('jwt'))
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB (录音文件可能较大)
          // new FileTypeValidator({ fileType: 'audio/*' }), // 暂时放宽类型限制以便测试
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadRecordingDto, // 使用 DTO 进行验证
    @Request() req,
  ) {
    // 这里的 file.path 是本地路径，实际生产环境可能需要上传到 OSS 并返回 URL
    // 这里简单处理，直接返回相对路径
    const fileUrl = `/uploads/${file.filename}`;
    
    return this.recordingsService.create(req.user.id, fileUrl, body);
  }

  @Get('my')
  async getMyRecordings(@Request() req) {
    return this.recordingsService.findAllByUserId(req.user.id);
  }

  @Get('pending')
  async getPendingAnnotations() {
    return this.recordingsService.findPendingAnnotations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recordingsService.findOne(+id);
  }
}
