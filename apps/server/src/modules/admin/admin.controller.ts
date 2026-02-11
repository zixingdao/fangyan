import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { UserStatus, RecordStatus } from '@changsha/shared';
import { ImportTrialDto, ImportRecordingDto } from './dto/import.dto';
import { AdminCreateUserDto } from './dto/create-user.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Put('users/:id/audit')
  auditUser(@Param('id') id: string, @Body() body: { status?: UserStatus; total_duration?: number; annotation_duration?: number }) {
    return this.adminService.updateUser(+id, body);
  }

  @Post('users')
  createUser(@Body() dto: AdminCreateUserDto, @Request() req) {
    return this.adminService.createUser(dto, req.user.id);
  }

  @Post('users/import-trial')
  importTrialResults(@Body() dto: ImportTrialDto) {
    return this.adminService.importTrialResults(dto);
  }

  @Put('recordings/:id/audit')
  auditRecording(
    @Param('id') id: string, 
    @Body('status') status: RecordStatus,
    @Body('remark') remark?: string
  ) {
    return this.adminService.auditRecording(+id, status, remark);
  }

  @Post('recordings/import')
  importRecordings(@Body() dto: ImportRecordingDto) {
    return this.adminService.importRecordings(dto);
  }
}
