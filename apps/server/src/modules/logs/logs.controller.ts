import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { LogLevel, LogType } from '@changsha/shared';

@Controller('logs')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: LogType,
    @Query('level') level?: LogLevel,
  ) {
    return this.logsService.findAll(page, limit, type, level);
  }
}
