import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SystemService } from './system.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { UpdateConfigDto } from './dto/system.dto';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('guide')
  getGuideContent() {
    return this.systemService.getGuideContent();
  }

  @Get('stats')
  getPublicStats() {
    return this.systemService.getPublicStats();
  }

  @Get('configs')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  getAllConfigs() {
    return this.systemService.findAll();
  }

  @Post('configs')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  updateConfig(@Body() body: UpdateConfigDto, @Request() req: any) {
    return this.systemService.update(body.key, body.value, req.user?.id);
  }

  @Post('benchmark')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  runBenchmark(@Body() body: { duration: number; concurrency: number }) {
    return this.systemService.runBenchmark(body.duration, body.concurrency);
  }
}
