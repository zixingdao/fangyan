import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadRecording, getMyRecordings } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 使用绝对路径，确保在任何目录启动都能找到 uploads
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// 上传录音接口 (需要认证)
router.post('/', authenticateToken, upload.single('audio'), uploadRecording);

// 获取我的录音记录
router.get('/my', authenticateToken, getMyRecordings);

export default router;
