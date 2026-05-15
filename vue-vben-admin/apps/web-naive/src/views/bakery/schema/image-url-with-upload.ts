import type { MessageApi } from 'naive-ui';
import { NButton, NUpload } from 'naive-ui';
import type { UploadCustomRequestOptions } from 'naive-ui';

import { h } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';

import { uploadImageApi } from '#/api/upload';

export function imageUrlWithUploadSchema(
  message: MessageApi,
  options: {
    /** 表单字段名，如 image、icon */
    fieldName: string;
    label: string;
    /** 未传则不附加校验规则 */
    rules?: VbenFormSchema['rules'];
    description?: string;
  },
): VbenFormSchema {
  const {
    fieldName,
    label,
    rules,
    description = '支持粘贴图片 URL；上传文件由服务端存储（本地目录或 OSS，取决于 UPLOAD_MODE）。',
  } = options;

  return {
    component: 'Input',
    fieldName,
    label,
    ...(rules !== undefined ? { rules } : {}),
    description,
    renderComponentContent: (_values, actions) => ({
      suffix: () =>
        h(
          NUpload,
          {
            showFileList: false,
            max: 1,
            customRequest: async ({
              file,
              onFinish,
              onError,
            }: UploadCustomRequestOptions) => {
              const rawFile = file.file;
              if (!rawFile) {
                onError();
                return;
              }
              try {
                const data = await uploadImageApi(rawFile);
                actions.setFieldValue(fieldName, data.url);
                message.success('上传成功');
                onFinish();
              } catch {
                onError();
              }
            },
          },
          {
            default: () =>
              h(
                NButton,
                { size: 'tiny', type: 'primary' },
                { default: () => '上传' },
              ),
          },
        ),
    }),
  };
}
