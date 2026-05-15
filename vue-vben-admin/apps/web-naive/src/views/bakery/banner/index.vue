<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage, NTag } from 'naive-ui';

import { getBannerListApi, createBannerApi, updateBannerApi, deleteBannerApi, type BannerApi } from '#/api/bakery/banner';

const message = useMessage();

const [table, tableAction] = useVbenTable({
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
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.open() }, children: '新增轮播图' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.open({ data: row }) },
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

const [Modal, modalApi] = useVbenModal({
  title: '轮播图管理',
  bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleSubmit: async (values) => {
    const data = values as BannerApi.CreateBannerParams;
    if (modalApi.getCurrentData()?.id) {
      await updateBannerApi({ ...data, id: modalApi.getCurrentData().id });
      message.success('更新成功');
    } else {
      await createBannerApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Input', fieldName: 'image', label: '图片URL', rules: 'required' },
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

modalApi?.onOpen?.((data) => {
  if (data?.id) {
    formApi.setValues(data);
  } else {
    formApi.reset();
  }
});
</script>

<template>
  <Page title="轮播图管理" description="管理轮播图信息">
    <NCard>
      <table />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>