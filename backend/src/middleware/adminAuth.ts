import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: '未认证' });
  }

  if (user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '无权限访问' });
  }
};
