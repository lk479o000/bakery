/**
 * 阿里云 OSS 上传器
 * 使用 ali-oss SDK 将文件上传到阿里云 OSS
 */
import path from 'path';
import fs from 'fs';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

let client: any = null;

const getClient = (): any => {
  if (client) return client;
  
  // 动态导入，避免本地模式也需要安装 ali-oss
  const OSS = require('ali-oss');
  
  client = new OSS({
    region: process.env.OSS_ALIYUN_REGION || 'oss-cn-hangzhou',
    accessKeyId: process.env.OSS_ALIYUN_ACCESS_KEY_ID!,
    accessKeySecret: process.env.OSS_ALIYUN_ACCESS_KEY_SECRET!,
    bucket: process.env.OSS_ALIYUN_BUCKET!,
    endpoint: process.env.OSS_ALIYUN_ENDPOINT
  });
  
  return client;
};

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  const oss = getClient();
  
  // 构建 OSS 存储路径
  const date = new Date();
  const datePath = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const key = `images/${datePath}/${file.filename}`;
  
  const result = await oss.put(key, file.path);

  // 本地上传 OSS 成功后删除临时文件
  fs.unlink(file.path, () => {});

  const cdnDomain = process.env.OSS_ALIYUN_CDN_DOMAIN;
  const url = cdnDomain
    ? `${cdnDomain}/${key}`
    : result.url;

  return {
    url,
    filename: file.filename,
    size: file.size,
    mimeType: file.mimetype
  };
};

export const aliyunUploader = { upload };
