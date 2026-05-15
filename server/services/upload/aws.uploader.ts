/**
 * AWS S3 上传器（兼容 MinIO）
 * 使用 @aws-sdk/client-s3 和 @aws-sdk/lib-storage 将文件上传到 S3
 */
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
  
  const { S3Client } = require('@aws-sdk/client-s3');
  
  client = new S3Client({
    region: process.env.OSS_AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.OSS_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.OSS_AWS_SECRET_ACCESS_KEY!
    },
    endpoint: process.env.OSS_AWS_ENDPOINT,
    forcePathStyle: !!process.env.OSS_AWS_ENDPOINT // MinIO 需要 path-style
  });
  
  return client;
};

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  const s3Client = getClient();
  const { Upload } = require('@aws-sdk/lib-storage');
  
  const date = new Date();
  const datePath = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const key = `images/${datePath}/${file.filename}`;
  
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.OSS_AWS_BUCKET!,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype
    }
  });
  
  await upload.done();
  
  // 删除本地临时文件
  fs.unlink(file.path, () => {});
  
  const cdnDomain = process.env.OSS_AWS_CDN_DOMAIN;
  const region = process.env.OSS_AWS_REGION || 'us-east-1';
  const bucket = process.env.OSS_AWS_BUCKET!;
  
  const url = cdnDomain
    ? `${cdnDomain}/${key}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  
  return {
    url,
    filename: file.filename,
    size: file.size,
    mimeType: file.mimetype
  };
};

export const awsUploader = { upload };
