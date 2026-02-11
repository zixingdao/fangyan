import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitorService } from './modules/monitor/monitor.service';

@Injectable()
export class RequestCounterMiddleware implements NestMiddleware {
  constructor(private readonly monitorService: MonitorService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.url.startsWith('/api/system/monitor')) { // 排除监控接口自身
      this.monitorService.incrementRequestCount();
      
      res.on('finish', () => {
        if (res.statusCode >= 400) {
          this.monitorService.incrementErrorCount();
        }
      });
    }
    next();
  }
}