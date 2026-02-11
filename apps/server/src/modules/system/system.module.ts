import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { SystemConfig } from './system-config.entity';
import { User } from '../users/user.entity';
import { Recording } from '../recordings/recording.entity';
import { Topic } from '../topics/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig, User, Recording, Topic])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
