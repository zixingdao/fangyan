import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';

@Controller()
export class ViewController {
  @Get('admin/*')
  serveAdmin(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
  }

  // 排除 /api 开头的请求，避免拦截 API 404
  @Get('*')
  serveClient(@Req() req: Request, @Res() res: Response) {
    if (req.path.startsWith('/api')) {
      res.status(404).json({
        code: 404,
        msg: 'Not Found',
      });
      return;
    }
    res.sendFile(join(__dirname, '..', 'public', 'user', 'index.html'));
  }
}
