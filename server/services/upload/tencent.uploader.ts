/**
 * 腾讯云 COS 上传器
 * 使用 cos-nodejs-sdk-v5 将文件上传到腾讯云 COS
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
  
  const COS = require('cos-nodejs-sdk-v5');
  
  client = new COS({
    SecretId: process.env.OSS_TENCENT_SECRET_ID!,
    SecretKey: process.env.OSS_TENCENT_SECRET_KEY!
  });
  
  return client;
};

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  const cos = getClient();
  
  const date = new Date();
  const datePath = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const key = `images/${datePath}/${file.filename}`;
  
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: process.env.OSS_TENCENT_BUCKET!,
        Region: process.env.OSS_TENCENT_REGION || 'ap-guangzhou',
        Key: key,
        Body: fs.createReadStream(file.path)
      },
      (err: any, data: any) => {
        // 删除本地临时文件
        fs.unlink(file.path, () => {});
        
        if (err) {
          reject(err);
          return;
        }
        
        const cdnDomain = process.env.OSS_TENCENT_CDN_DOMAIN;
        const url = cdnDomain
          ? `${cdnDomain}/${key}`
          : `https://${data.Location}`;
        
        resolve({
          url,
          filename: file.filename,
          size: file.size,
          mimeType: file.mimetype
        });
      }
    );
  });
};

export const tencentUploader = { upload };
