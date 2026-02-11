import { Controller, Get, Res, Req, Next } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { join } from 'path';

@Controller()
export class ViewController {
  @Get('admin/*')
  serveAdmin(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
  }

  // 排除 /api 开头的请求，避免拦截 API 404
  @Get('*')
  serveClient(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    // 如果请求是以 /api 开头，且没有匹配到之前的 API 路由，说明是 404
    if (req.path.startsWith('/api')) {
      res.status(404).json({
        code: 404,
        msg: 'Not Found',
      });
      return;
    }
    // 否则返回前端页面
    res.sendFile(join(__dirname, '..', 'public', 'user', 'index.html'));
  }
}
