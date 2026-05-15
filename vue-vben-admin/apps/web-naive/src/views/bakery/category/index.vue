<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getCategoryListApi, createCategoryApi, updateCategoryApi, deleteCategoryApi, type CategoryApi } from '#/api/bakery/category';

const message = useMessage();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleSubmit: async (values) => {
    const data = values as CategoryApi.CreateCategoryParams;
    const current = modalApi.getData<CategoryApi.Category>();
    if (current?.id) {
      await updateCategoryApi({ ...data, id: current.id });
      message.success('更新成功');
    } else {
      await createCategoryApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Input', fieldName: 'name', label: '分类名称', rules: 'required' },
    { component: 'Input', fieldName: 'icon', label: '图标URL' },
    { component: 'InputNumber', fieldName: 'sort', label: '排序', componentProps: { min: 0 } },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      rules: 'selectRequired',
      componentProps: { options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
    },
    { component: 'RadioGroup', fieldName: 'canPickup', label: '自取场景', rules: 'selectRequired', componentProps: { options: [{ value: 1, label: '展示' }, { value: 0, label: '隐藏' }] } },
    { component: 'RadioGroup', fieldName: 'canDelivery', label: '外卖场景', rules: 'selectRequired', componentProps: { options: [{ value: 1, label: '展示' }, { value: 0, label: '隐藏' }] } },
    { component: 'RadioGroup', fieldName: 'canExpress', label: '快递场景', rules: 'selectRequired', componentProps: { options: [{ value: 1, label: '展示' }, { value: 0, label: '隐藏' }] } },
  ],
});

const [Modal, modalApi] = useVbenModal({
  title: '分类管理',
  contentClass: 'max-h-[calc(100vh-200px)] overflow-auto',
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    const data = modalApi.getData<CategoryApi.Category>();
    await formApi.resetForm();
    if (data?.id) {
      formApi.setValues(data);
    } else {
      formApi.setValues({
        status: 1,
        canPickup: 1,
        canDelivery: 1,
        canExpress: 1,
        sort: 0,
      });
    }
  },
});

const [Grid, tableAction] = useVbenTable({
  api: getCategoryListApi,
  columns: [
    {
      field: 'icon',
      title: '图标',
      width: 80,
      formatter: (val: string) => val ? `<img src="${val}" class="w-10 h-10 rounded" />` : '-',
    },
    { field: 'name', title: '分类名称', width: 120 },
    {
      field: 'canPickup',
      title: '自取',
      width: 70,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      field: 'canDelivery',
      title: '外卖',
      width: 70,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      field: 'canExpress',
      title: '快递',
      width: 70,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
    { field: 'sort', title: '排序', width: 80 },
    {
      field: 'status',
      title: '状态',
      width: 80,
      formatter: (val: number) => {
        return val === 1 ? '<span class="px-2 py-1 rounded text-sm bg-green-100 text-green-800">启用</span>' : '<span class="px-2 py-1 rounded text-sm bg-red-100 text-red-800">禁用</span>';
      },
    },
    { field: 'action', title: '操作', width: 180, fixed: 'right' },
  ],
  toolBarSchema: [
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.setData({}).open() }, children: '新增分类' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.setData(row).open() },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: CategoryApi.Category) {
  if (await tableAction.confirm(`确定删除分类「${row.name}」吗？`)) {
    await deleteCategoryApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}
</script>

<template>
  <Page title="商品分类管理" description="管理商品分类信息">
    <NCard>
      <Grid />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
