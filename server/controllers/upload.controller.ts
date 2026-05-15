/**
 * 文件上传控制器
 */
import { Request, Response, NextFunction } from 'express';
import uploadService from '../services/upload/upload.service';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ code: 400, message: '请选择要上传的文件', data: null });
      return;
    }

    const result = await uploadService.upload(req.file);
    
    res.json({
      code: 200,
      message: '上传成功',
      data: result
    });
  } catch (error: any) {
    if (error.message === '不支持的文件类型') {
      res.status(400).json({ code: 400, message: '仅支持 jpeg、png、gif、webp、svg 格式的图片', data: null });
      return;
    }
    next(error);
  }
};
