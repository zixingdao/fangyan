import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recording } from './recording.entity';
import { CreateRecordingDto, RecordStatus, RecordType, LogType, LogLevel } from '@changsha/shared';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class RecordingsService {
  constructor(
    @InjectRepository(Recording)
    private recordingsRepository: Repository<Recording>,
    private usersService: UsersService,
    private logsService: LogsService,
  ) {}

  // 创建录音记录
  async create(userId: number, fileUrl: string, createRecordingDto: any): Promise<Recording> {
    const recording = this.recordingsRepository.create({
      user_id: userId,
      file_url: fileUrl,
      duration: createRecordingDto.duration,
      record_type: createRecordingDto.record_type || RecordType.SOLO, // 修正为 SOLO
      status: RecordStatus.PENDING_ANNOTATION,
    });
    
    const savedRecording = await this.recordingsRepository.save(recording);
    
    // Side effect: Update user total duration
    if (createRecordingDto.duration > 0) {
      const type = createRecordingDto.record_type === RecordType.DIALOGUE ? 'dialogue' : 'solo';
      await this.usersService.incrementDuration(userId, createRecordingDto.duration, type);
    }

    // 记录上传日志
    await this.logsService.create(
      userId,
      '上传录音',
      LogType.USER_ACTION,
      LogLevel.INFO,
      JSON.stringify({ recordingId: savedRecording.id, type: recording.record_type, duration: recording.duration })
    );

    return savedRecording;
  }

  // 获取用户的所有录音
  async findAllByUserId(userId: number): Promise<Recording[]> {
    return this.recordingsRepository.find({
      where: { user_id: userId },
      order: { upload_time: 'DESC' },
    });
  }

  // 获取单个录音详情
  async findOne(id: number): Promise<Recording> {
    const recording = await this.recordingsRepository.findOne({ where: { id } });
    if (!recording) {
      throw new NotFoundException(`Recording with ID ${id} not found`);
    }
    return recording;
  }

  // 获取待标注的录音（管理员或标注员用，这里简化为获取所有待标注的）
  async findPendingAnnotations(): Promise<Recording[]> {
    return this.recordingsRepository.find({
      where: { status: RecordStatus.PENDING_ANNOTATION },
      order: { upload_time: 'ASC' },
    });
  }

  // 更新录音状态或标注信息
  async update(id: number, updateData: Partial<Recording>): Promise<Recording> {
    await this.recordingsRepository.update(id, updateData);
    return this.findOne(id);
  }
}
