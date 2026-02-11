import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RecordingsModule } from './modules/recordings/recordings.module';
import { RankingsModule } from './modules/rankings/rankings.module';
import { TopicsModule } from './modules/topics/topics.module';
import { AdminModule } from './modules/admin/admin.module';
import { LogsModule } from './modules/logs/logs.module';
import { SystemModule } from './modules/system/system.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { User } from './modules/users/user.entity';
import { Recording } from './modules/recordings/recording.entity';
import { Ranking } from './modules/rankings/ranking.entity';
import { Topic } from './modules/topics/topic.entity';
import { Log } from './modules/logs/log.entity';
import { SystemConfig } from './modules/system/system-config.entity';
import { RequestCounterMiddleware } from './request-counter.middleware';
import { ViewController } from './view.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'public', 'user'),
        serveRoot: '/',
        exclude: ['/api/(.*)'],
        serveStaticOptions: {
          setHeaders: (res, path) => {
            if (path.endsWith('index.html')) {
              // HTML 不缓存，确保用户总是获取最新版本，避免 404
              res.setHeader('Cache-Control', 'no-cache');
            } else {
              // JS/CSS/图片等带有 Hash 的资源，强缓存 1 年
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
          },
        },
      },
      {
        rootPath: join(__dirname, '..', 'public', 'admin'),
        serveRoot: '/admin',
        exclude: ['/api/(.*)'],
        serveStaticOptions: {
          setHeaders: (res, path) => {
            if (path.endsWith('index.html')) {
              res.setHeader('Cache-Control', 'no-cache');
            } else {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
          },
        },
      },
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [User, Recording, Ranking, Topic, Log, SystemConfig], // 注册所有实体
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RecordingsModule,
    RankingsModule,
    TopicsModule,
    AdminModule,
    LogsModule,
    SystemModule,
    MonitorModule,
  ],
  controllers: [ViewController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestCounterMiddleware)
      .forRoutes('*');
  }
}
