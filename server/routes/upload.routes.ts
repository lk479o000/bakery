import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { uploadImage } from '../controllers/upload.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// 图片上传接口（需管理后台认证）
router.post('/image', authenticateAdmin, uploadMiddleware.single('file'), uploadImage);

export default router;
