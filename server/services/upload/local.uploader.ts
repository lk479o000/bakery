/**
 * 本地上传器
 * multer 已将文件写入 localDir，此处负责生成可访问 URL
 */
import path from 'path';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

const upload = async (file: Express.Multer.File): Promise<UploadResult> => {
  // file.path 即 multer 写入的完整磁盘路径
  const normalizedPath = file.path.replace(/\\/g, '/');
  
  // 从路径中提取 public/images/ 之后的部分
  const imagesIndex = normalizedPath.indexOf('public/images/');
  let relativePath: string;
  if (imagesIndex !== -1) {
    relativePath = normalizedPath.substring(imagesIndex + 'public/'.length);
  } else {
    // fallback：直接用文件名
    relativePath = 'images/' + file.filename;
  }

  // 拼接完整访问 URL
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8150}`;
  
  return {
    url: `${baseUrl}/${relativePath}`,
    filename: file.filename,
    size: file.size,
    mimeType: file.mimetype
  };
};

export const localUploader = { upload };
