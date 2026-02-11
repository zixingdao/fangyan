import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { LogLevel, LogType } from '@changsha/shared';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async create(
    userId: number | null,
    action: string,
    type: LogType = LogType.SYSTEM,
    level: LogLevel = LogLevel.INFO,
    details?: string,
    ip?: string,
  ): Promise<Log> {
    const log = this.logsRepository.create({
      user_id: userId,
      action,
      type,
      level,
      details,
      ip,
    });
    return this.logsRepository.save(log);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    type?: LogType,
    level?: LogLevel,
  ) {
    const query = this.logsRepository.createQueryBuilder('log');

    if (type) {
      query.andWhere('log.type = :type', { type });
    }

    if (level) {
      query.andWhere('log.level = :level', { level });
    }

    query
      .orderBy('log.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
