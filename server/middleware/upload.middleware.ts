/**
 * 文件上传 Multer 中间件
 * 先保存到本地磁盘，后续由上传服务决定是否需要上传到 OSS
 */
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import uploadConfig from '../config/upload.config';

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const date = new Date();
    const dir = path.join(
      uploadConfig.localDir,
      date.getFullYear().toString(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0')
    );
    // 确保目录存在
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname);
    // 使用时间戳 + 随机数生成唯一文件名
    const uniqueName = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    cb(null, uniqueName + ext);
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (uploadConfig.allowTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: uploadConfig.maxSize }
});
