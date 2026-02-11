import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('system/monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  getStats() {
    return this.monitorService.getServerStats();
  }
}