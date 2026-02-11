import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Recording } from '../recordings/recording.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recording])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
