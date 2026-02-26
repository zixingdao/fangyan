import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PageConfigsService } from './page-configs.service';
import { PageType } from './page-config.entity';
import { CreatePageConfigDto, UpdatePageConfigDto } from './dto/page-config.dto';
import { PageConfigResponse } from './page-config.response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';

@ApiTags('页面配置')
@Controller('page-configs')
export class PageConfigsController {
  constructor(private readonly pageConfigsService: PageConfigsService) {}

  @Get()
  @ApiOperation({ summary: '获取所有页面配置' })
  async findAll(): Promise<PageConfigResponse[]> {
    const configs = await this.pageConfigsService.findAll();
    // Parse components for each config
    return configs.map(config => ({
      id: config.id,
      pageType: config.pageType,
      title: config.title,
      components: config.getComponents(),
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    }));
  }

  @Get('by-type')
  @ApiOperation({ summary: '根据页面类型获取配置（公开接口）' })
  async findByPageType(@Query('type') pageType: PageType): Promise<PageConfigResponse | null> {
    const config = await this.pageConfigsService.findByPageType(pageType);
    if (config) {
      return {
        id: config.id,
        pageType: config.pageType,
        title: config.title,
        components: config.getComponents(),
        isActive: config.isActive,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      };
    }
    return null;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个页面配置' })
  async findOne(@Param('id') id: string): Promise<PageConfigResponse> {
    const config = await this.pageConfigsService.findOne(+id);
    return {
      id: config.id,
      pageType: config.pageType,
      title: config.title,
      components: config.getComponents(),
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建或更新页面配置（仅超级管理员）' })
  async create(@Body() dto: CreatePageConfigDto): Promise<PageConfigResponse> {
    const config = await this.pageConfigsService.create(dto);
    return {
      id: config.id,
      pageType: config.pageType,
      title: config.title,
      components: config.getComponents(),
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新页面配置（仅超级管理员）' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePageConfigDto,
  ): Promise<PageConfigResponse> {
    const config = await this.pageConfigsService.update(+id, dto);
    return {
      id: config.id,
      pageType: config.pageType,
      title: config.title,
      components: config.getComponents(),
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除页面配置（仅超级管理员）' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.pageConfigsService.remove(+id);
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '初始化默认页面配置（仅超级管理员）' })
  async initialize(): Promise<{ message: string }> {
    await this.pageConfigsService.initializeDefaults();
    return { message: '默认配置初始化成功' };
  }
}
