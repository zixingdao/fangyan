import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import * as fs from 'fs';
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
import { PageConfig } from './modules/page-configs/page-config.entity';
import { PageConfigsModule } from './modules/page-configs/page-configs.module';
import { UploadModule } from './modules/upload/upload.module';
import { RequestCounterMiddleware } from './request-counter.middleware';

// 动态获取 public 目录路径
const getPublicPath = (subPath: string) => {
  // 尝试多个可能的路径
  const possiblePaths = [
    join(process.cwd(), 'public', subPath),
    join(__dirname, '..', 'public', subPath),
    join(__dirname, '..', '..', 'public', subPath),
    resolve('public', subPath),
  ];
  
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      console.log(`Found public path: ${path}`);
      return path;
    }
  }
  
  // 默认返回第一个路径
  console.log(`Using default public path: ${possiblePaths[0]}`);
  return possiblePaths[0];
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot(
      // 1. 微信验证文件 - 优先匹配，不进行 SPA 回退
      {
        rootPath: getPublicPath('verify'),
        serveRoot: '/',
        serveStaticOptions: {
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'no-cache');
          },
        },
      },
      // 2. 优先托管静态资源目录 (static)，不进行 SPA 回退
      {
        rootPath: getPublicPath(join('user', 'static')),
        serveRoot: '/static',
        serveStaticOptions: {
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          },
        },
      },
      // 3. Admin 端的静态资源
      {
        rootPath: getPublicPath(join('admin', 'static')),
        serveRoot: '/admin/static',
        serveStaticOptions: {
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          },
        },
      },
      // 4. Admin 端页面入口 (SPA)
      {
        rootPath: getPublicPath('admin'),
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
      // 5. Client 端页面入口 (SPA) - 放在最后作为兜底
      {
        rootPath: getPublicPath('user'),
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
        entities: [User, Recording, Ranking, Topic, Log, SystemConfig, PageConfig], // 注册所有实体
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1分钟
        limit: 15,   // 每IP每端点15次请求
      },
      {
        name: 'long',
        ttl: 3600000, // 1小时
        limit: 200,   // 每IP每小时200次请求
      },
    ]),
    UsersModule,
    AuthModule,
    RecordingsModule,
    RankingsModule,
    TopicsModule,
    AdminModule,
    LogsModule,
    SystemModule,
    MonitorModule,
    PageConfigsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestCounterMiddleware)
      .forRoutes('*');
  }
}
