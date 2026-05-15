<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getBannerListApi, createBannerApi, updateBannerApi, deleteBannerApi, type BannerApi } from '#/api/bakery/banner';
import { imageUrlWithUploadSchema } from '#/views/bakery/schema/image-url-with-upload';

const message = useMessage();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  handleSubmit: async (values) => {
    const data = values as BannerApi.CreateBannerParams;
    const current = modalApi.getData<BannerApi.Banner>();
    if (current?.id) {
      await updateBannerApi({ ...data, id: current.id });
      message.success('更新成功');
    } else {
      await createBannerApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    imageUrlWithUploadSchema(message, {
      fieldName: 'image',
      label: '图片',
      rules: 'required',
    }),
    { component: 'Input', fieldName: 'link', label: '跳转链接' },
    { component: 'InputNumber', fieldName: 'sort', label: '排序', componentProps: { min: 0 } },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      rules: 'selectRequired',
      componentProps: { options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  title: '轮播图管理',
  contentClass: 'max-h-[calc(100vh-200px)] overflow-auto',
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await formApi.validateAndSubmitForm();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    const data = modalApi.getData<BannerApi.Banner>();
    await formApi.resetForm();
    if (data?.id) {
      formApi.setValues({
        ...data,
        status: data.status == null ? 1 : Number(data.status),
        sort: data.sort == null ? 0 : Number(data.sort),
      });
    }
  },
});

const [Grid, tableAction] = useVbenTable({
  api: getBannerListApi,
  columns: [
    {
      field: 'image',
      title: '图片',
      width: 150,
      formatter: (val: string) => val ? `<img src="${val}" class="w-20 h-20 object-cover rounded" />` : '-',
    },
    { field: 'link', title: '跳转链接', width: 200 },
    { field: 'sort', title: '排序', width: 80 },
    {
      field: 'status',
      title: '状态',
      width: 80,
      formatter: (val: number) => val === 1 ? '启用' : '禁用',
    },
    { field: 'action', title: '操作', width: 180, fixed: 'right' },
  ],
  toolBarSchema: [
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.setData({}).open() }, children: '新增轮播图' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.setData(row).open() },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: BannerApi.Banner) {
  if (await tableAction.confirm('确定删除该轮播图吗？')) {
    await deleteBannerApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}
</script>

<template>
  <Page title="轮播图管理" description="管理轮播图信息">
    <NCard>
      <Grid />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
