import { BadRequestException, Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/user.entity';
import { Recording } from '../recordings/recording.entity';
import { UserRole, UserStatus, RecordStatus, RecordType, LogType, LogLevel } from '@changsha/shared';
import { ImportTrialDto, ImportRecordingDto } from './dto/import.dto';
import { LogsService } from '../logs/logs.service';
import * as bcrypt from 'bcryptjs';
import { AdminCreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Recording)
    private recordingsRepository: Repository<Recording>,
    private logsService: LogsService,
  ) {}

  // 获取仪表盘统计数据
  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    const totalRecordings = await this.recordingsRepository.count();
    const pendingAudits = await this.usersRepository.count({
      where: { status: UserStatus.PENDING },
    });
    const pendingAnnotations = await this.recordingsRepository.count({
      where: { status: RecordStatus.PENDING_ANNOTATION },
    });
    const trialPassedUsers = await this.usersRepository.count({
        // @ts-ignore - TRIAL_PASSED might be missing in shared package build
        where: { status: UserStatus.TRIAL_PASSED },
    });

    return {
      totalUsers,
      totalRecordings,
      pendingAudits,
      pendingAnnotations,
      trialPassedUsers,
    };
  }

  // 审核/更新用户
  async updateUser(userId: number, data: { status?: UserStatus; total_duration?: number; annotation_duration?: number; solo_duration?: number; dialogue_duration?: number }, adminId?: number) {
    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.total_duration !== undefined) updateData.total_duration = data.total_duration;
    if (data.annotation_duration !== undefined) updateData.annotation_duration = data.annotation_duration;
    if (data.solo_duration !== undefined) updateData.solo_duration = data.solo_duration;
    if (data.dialogue_duration !== undefined) updateData.dialogue_duration = data.dialogue_duration;
    
    await this.usersRepository.update(userId, updateData);

    // 记录用户更新日志
    await this.logsService.create(
      adminId || null,
      '更新用户',
      LogType.SYSTEM,
      LogLevel.INFO,
      JSON.stringify({ userId, updates: updateData })
    );

    return { success: true };
  }

  async createUser(dto: AdminCreateUserDto, adminId: number) {
    console.log('Creating user with DTO:', JSON.stringify(dto, null, 2));
    
    try {
      const whereConditions: any[] = [];
      if (dto.student_id) whereConditions.push({ student_id: dto.student_id });
      if (dto.phone) whereConditions.push({ phone: dto.phone });

      if (whereConditions.length > 0) {
        const existed = await this.usersRepository.findOne({ 
          where: whereConditions
        });
        
        if (existed) {
          if (dto.student_id && existed.student_id === dto.student_id) {
            console.warn(`Create user failed: student_id ${dto.student_id} already exists`);
            throw new BadRequestException('学号已存在');
          }
          if (dto.phone && existed.phone === dto.phone) {
            console.warn(`Create user failed: phone ${dto.phone} already exists`);
            throw new BadRequestException('手机号已存在');
          }
          // Fallback if matched but neither matches exactly (should not happen with OR query logic above)
          console.warn(`Create user failed: User conflict found but details unclear. Existed: ${existed.student_id}, Input: ${dto.student_id}`);
          throw new BadRequestException('用户已存在（学号或手机号重复）');
        }
      }

      // 检查权限：只有 SUPER_ADMIN 可以创建 ADMIN 或 SUPER_ADMIN
      if (dto.role === UserRole.ADMIN || dto.role === UserRole.SUPER_ADMIN) {
        const currentAdmin = await this.usersRepository.findOne({ where: { id: adminId } });
        if (!currentAdmin || currentAdmin.role !== UserRole.SUPER_ADMIN) {
          console.warn(`Create user failed: Admin ${adminId} tried to create admin/super_admin but is not super_admin`);
          throw new BadRequestException('只有超级管理员可以创建管理员账号');
        }
      }
  
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.usersRepository.create({
        student_id: dto.student_id,
        phone: dto.phone,
        name: dto.name,
        password: hashedPassword,
        school: dto.school,
        hometown: dto.hometown,
        role: dto.role ?? UserRole.USER,
        status: dto.status ?? UserStatus.PENDING,
      });
      const saved = await this.usersRepository.save(user);
  
      await this.logsService.create(
        adminId || null,
        '创建用户',
        LogType.SYSTEM,
        LogLevel.INFO,
        JSON.stringify({ userId: saved.id, student_id: saved.student_id, role: saved.role, status: saved.status }),
      );
  
      const { password, ...safe } = saved as any;
      return safe;
    } catch (error) {
      console.error('Error in createUser:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  // 兼容旧接口
  async auditUser(userId: number, status: UserStatus, adminId?: number) {
    return this.updateUser(userId, { status }, adminId);
  }

  // 批量导入试音结果
  async importTrialResults(dto: ImportTrialDto) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of dto.items) {
      try {
        const user = await this.usersRepository.findOne({ where: { student_id: item.studentId } });
        if (!user) {
          results.failed++;
          results.errors.push(`学号 ${item.studentId} 不存在`);
          continue;
        }

        if (item.passed) {
          // @ts-ignore
          await this.usersRepository.update(user.id, { status: UserStatus.TRIAL_PASSED });
        } else {
           // 如果不通过，可能不需要变动，或者设为 REJECTED，视业务而定。这里暂不处理或设为 REJECTED
           // await this.usersRepository.update(user.id, { status: UserStatus.REJECTED });
        }
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`学号 ${item.studentId} 处理失败: ${error.message}`);
      }
    }

    return results;
  }

  // 封禁用户
  async banUser(userId: number, adminId?: number) {
    await this.usersRepository.update(userId, { status: UserStatus.REJECTED });
    
    // 记录封禁日志
    await this.logsService.create(
      adminId || null,
      '封禁用户',
      LogType.SYSTEM,
      LogLevel.WARN,
      JSON.stringify({ userId })
    );

    return { success: true };
  }

  // 删除用户 (仅超级管理员)
  async deleteUser(userId: number, adminId: number) {
    // 检查操作者权限
    const admin = await this.usersRepository.findOne({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('只有超级管理员可以删除用户');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    // 防止删除自己
    if (user.id === adminId) {
      throw new BadRequestException('不能删除自己');
    }

    // 级联删除相关数据（录音、日志等通常由数据库外键处理，或者这里手动处理）
    // 这里采用软删除或物理删除？根据需求“直接删除”，假设是物理删除。
    // 为了安全，先删除录音记录
    await this.recordingsRepository.delete({ user_id: userId });
    await this.usersRepository.delete(userId);

    await this.logsService.create(
      adminId,
      '删除用户',
      LogType.SYSTEM,
      LogLevel.WARN,
      JSON.stringify({ deletedUserId: userId, student_id: user.student_id, name: user.name })
    );

    return { success: true };
  }

  // 重置用户密码 (仅超级管理员)
  async resetUserPassword(userId: number, newPassword: string, adminId: number) {
    // 检查操作者权限
    const admin = await this.usersRepository.findOne({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('只有超级管理员可以重置密码');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });

    await this.logsService.create(
      adminId,
      '重置密码',
      LogType.SYSTEM,
      LogLevel.WARN,
      JSON.stringify({ userId })
    );

    return { success: true };
  }

  // 审核录音
  async auditRecording(recordingId: number, status: RecordStatus, remark?: string, adminId?: number) {
    const recording = await this.recordingsRepository.findOne({ where: { id: recordingId }, relations: ['user'] });
    if (!recording) throw new NotFoundException('录音不存在');

    await this.recordingsRepository.update(recordingId, { 
      status, 
      remark,
    });

    // 记录录音审核日志
    await this.logsService.create(
      adminId || null,
      '审核录音',
      LogType.SYSTEM,
      LogLevel.INFO,
      JSON.stringify({ recordingId, status, remark })
    );

    // 如果审核通过，更新用户总时长
    if (status === RecordStatus.APPROVED) {
       // 重新计算该用户所有通过的时长
       const totalDuration = await this.recordingsRepository.sum('duration', {
         user_id: recording.user_id,
         status: RecordStatus.APPROVED
       });
       
       const soloDuration = await this.recordingsRepository.sum('duration', {
         user_id: recording.user_id,
         status: RecordStatus.APPROVED,
         record_type: RecordType.SOLO
       });

       const dialogueDuration = await this.recordingsRepository.sum('duration', {
         user_id: recording.user_id,
         status: RecordStatus.APPROVED,
         record_type: RecordType.DIALOGUE
       });

       await this.usersRepository.update(recording.user_id, { 
         total_duration: totalDuration || 0,
         solo_duration: soloDuration || 0,
         dialogue_duration: dialogueDuration || 0,
       });
    }

    return { success: true };
  }

  // 批量导入录音记录
  async importRecordings(dto: ImportRecordingDto) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of dto.items) {
      try {
        const user = await this.usersRepository.findOne({ where: { student_id: item.studentId } });
        if (!user) {
          results.failed++;
          results.errors.push(`学号 ${item.studentId} 不存在`);
          continue;
        }

        const recording = this.recordingsRepository.create({
          user_id: user.id,
          duration: item.duration,
          file_url: item.filename || 'imported_record', // 或者是外部链接
          record_type: item.recordType || RecordType.SOLO,
          status: RecordStatus.APPROVED, // 导入的通常默认为已通过或待标注，这里假设导入即有效
          // 如果导入的是原始数据，可能是 PENDING_ANNOTATION
        });

        await this.recordingsRepository.save(recording);
        
        // 更新用户时长
        await this.usersRepository.increment({ id: user.id }, 'total_duration', item.duration);
        if (recording.record_type === RecordType.DIALOGUE) {
          await this.usersRepository.increment({ id: user.id }, 'dialogue_duration', item.duration);
        } else {
          await this.usersRepository.increment({ id: user.id }, 'solo_duration', item.duration);
        }

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`学号 ${item.studentId} 导入录音失败: ${error.message}`);
      }
    }

    return results;
  }
}
