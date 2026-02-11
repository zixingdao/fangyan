import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';
import { Recording } from './recording.entity';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recording]),
    UsersModule, // Add UsersModule
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // 存储路径
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  providers: [RecordingsService],
  controllers: [RecordingsController],
  exports: [RecordingsService],
})
export class RecordingsModule {}
