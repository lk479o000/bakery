/**
 * 文件上传配置
 * 通过环境变量切换本地上传和 OSS 上传模式
 */

interface OssProviderConfig {
  provider: 'aliyun' | 'tencent' | 'qiniu' | 'aws';
}

interface UploadConfig {
  /** 上传模式：local | oss */
  mode: 'local' | 'oss';
  /** 本地上传目录（相对于 server/） */
  localDir: string;
  /** 上传文件大小限制（字节） */
  maxSize: number;
  /** 允许上传的文件 MIME 类型 */
  allowTypes: string[];
  /** OSS 配置（mode === 'oss' 时有效） */
  oss: OssProviderConfig | null;
}

const uploadConfig: UploadConfig = {
  mode: (process.env.UPLOAD_MODE as 'local' | 'oss') || 'local',
  localDir: process.env.UPLOAD_LOCAL_DIR || 'public/images',
  maxSize: (parseInt(process.env.UPLOAD_MAX_SIZE || '10', 10)) * 1024 * 1024,
  allowTypes: (process.env.UPLOAD_ALLOW_TYPES || 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml').split(','),
  oss: process.env.UPLOAD_MODE === 'oss'
    ? {
        provider: (process.env.UPLOAD_OSS_PROVIDER as 'aliyun' | 'tencent' | 'qiniu' | 'aws') || 'aliyun'
      }
    : null
};

export default uploadConfig;
