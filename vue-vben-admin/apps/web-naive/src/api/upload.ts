import { requestClient } from '#/api/request';

export interface UploadImageResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/** 管理端图片上传（服务端按 UPLOAD_MODE 写入本地或 OSS） */
export function uploadImageApi(file: File) {
  return requestClient.upload<UploadImageResult>('/upload/image', { file });
}
