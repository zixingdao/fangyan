import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post('import')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  import(@Body() topics: CreateTopicDto[]) {
    return this.topicsService.import(topics);
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  export() {
    return this.topicsService.findAll(); // Export all, including inactive
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    // 前端传 active=false 时，意为"不强制过滤active状态"，即查询所有
    if (active === 'false') {
      return this.topicsService.findAll();
    }
    // 默认只返回启用的
    return this.topicsService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
