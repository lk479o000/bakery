/**
 * 文件上传服务入口
 * 根据配置的 UPLOAD_MODE 分发到本地或 OSS 上传器
 */
import uploadConfig from '../../config/upload.config';
import { localUploader } from './local.uploader';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  const { mode, oss } = uploadConfig;

  if (mode === 'local') {
    return localUploader.upload(file);
  }

  // OSS 模式
  if (!oss) {
    throw new Error('OSS 配置未设置');
  }

  switch (oss.provider) {
    case 'aliyun': {
      const { aliyunUploader } = await import('./aliyun.uploader');
      return aliyunUploader.upload(file);
    }
    case 'tencent': {
      const { tencentUploader } = await import('./tencent.uploader');
      return tencentUploader.upload(file);
    }
    case 'qiniu': {
      const { qiniuUploader } = await import('./qiniu.uploader');
      return qiniuUploader.upload(file);
    }
    case 'aws': {
      const { awsUploader } = await import('./aws.uploader');
      return awsUploader.upload(file);
    }
    default:
      throw new Error(`不支持的 OSS 提供商: ${oss.provider}`);
  }
};

export default { upload };
