/**
 * 七牛云 Kodo 上传器
 * 使用 qiniu SDK 将文件上传到七牛云 Kodo
 */
import fs from 'fs';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

let mac: any = null;
let uploadConfig: any = null;

const getUploader = (): { putFile: any; uploadToken: string; domain: string } => {
  const qiniu = require('qiniu');
  
  if (!mac) {
    mac = new qiniu.auth.digest.Mac(
      process.env.OSS_QINIU_ACCESS_KEY!,
      process.env.OSS_QINIU_SECRET_KEY!
    );
  }
  
  const bucket = process.env.OSS_QINIU_BUCKET!;
  const domain = process.env.OSS_QINIU_DOMAIN || `http://${bucket}.qiniu.com`;
  
  const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
  const uploadToken = putPolicy.uploadToken(mac);
  
  const cfg = new qiniu.conf.Config();
  const zone = process.env.OSS_QINIU_ZONE;
  if (zone) {
    cfg.zone = qiniu.zone[zone];
  }
  
  const formUploader = new qiniu.form_up.FormUploader(cfg);
  const putExtra = new qiniu.form_up.PutExtra();
  
  return {
    putFile: (key: string, filePath: string) => {
      return new Promise<{ key: string }>((resolve, reject) => {
        formUploader.putFile(uploadToken, key, filePath, putExtra, (err: any, body: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(body);
        });
      });
    },
    uploadToken,
    domain
  };
};

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  const { putFile, domain } = getUploader();
  
  const date = new Date();
  const datePath = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const key = `images/${datePath}/${file.filename}`;
  
  await putFile(key, file.path);
  
  // 删除本地临时文件
  fs.unlink(file.path, () => {});
  
  const url = `${domain}/${key}`;
  
  return {
    url,
    filename: file.filename,
    size: file.size,
    mimeType: file.mimetype
  };
};

export const qiniuUploader = { upload };
