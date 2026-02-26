import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageConfigsService } from './page-configs.service';
import { PageConfigsController } from './page-configs.controller';
import { PageConfig } from './page-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageConfig])],
  controllers: [PageConfigsController],
  providers: [PageConfigsService],
  exports: [PageConfigsService],
})
export class PageConfigsModule {}
