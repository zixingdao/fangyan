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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot(
      // 1. 优先托管静态资源目录 (static)，不进行 SPA 回退
      {
        rootPath: join(__dirname, '..', 'public', 'user', 'static'),
        serveRoot: '/static', // 显式匹配 /static 路径
        serveStaticOptions: {
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          },
        },
      },
      // 2. Admin 端的静态资源 (如果有冲突，建议 Admin 也改名或加前缀，目前假设 Admin 的 static 在 /admin/static)
      {
        rootPath: join(__dirname, '..', 'public', 'admin', 'static'),
        serveRoot: '/admin/static',
        serveStaticOptions: {
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          },
        },
      },
      // 3. Admin 端页面入口 (SPA)
      {
        rootPath: join(__dirname, '..', 'public', 'admin'),
        serveRoot: '/admin',
        exclude: ['/api/(.*)', '/static/(.*)'],
        serveStaticOptions: {
          setHeaders: (res, path) => {
            if (path.endsWith('index.html')) {
              res.setHeader('Cache-Control', 'no-cache');
            }
          },
        },
      },
      // 4. Client 端页面入口 (SPA) - 放在最后作为兜底
      {
        rootPath: join(__dirname, '..', 'public', 'user'),
        serveRoot: '/',
        exclude: ['/api/(.*)', '/admin/(.*)', '/static/(.*)'],
        serveStaticOptions: {
          setHeaders: (res, path) => {
            if (path.endsWith('index.html')) {
              res.setHeader('Cache-Control', 'no-cache');
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
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestCounterMiddleware)
      .forRoutes('*');
  }
}
