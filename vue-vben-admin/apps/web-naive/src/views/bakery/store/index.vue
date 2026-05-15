<script lang="ts" setup>
import { nextTick } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getStoreListApi, createStoreApi, updateStoreApi, deleteStoreApi, type StoreApi } from '#/api/bakery/store';

const message = useMessage();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  showDefaultActions: false,
  handleSubmit: async (values) => {
    const data = values as StoreApi.CreateStoreParams;
    const current = modalApi.getData<StoreApi.Store>();
    if (current?.id) {
      await updateStoreApi({ ...data, id: current.id });
      message.success('更新成功');
    } else {
      await createStoreApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Input', fieldName: 'name', label: '门店名称', rules: 'required' },
    { component: 'Input', fieldName: 'address', label: '地址', rules: 'required', componentProps: { type: 'textarea' } },
    { component: 'Input', fieldName: 'phone', label: '联系电话' },
    { component: 'Input', fieldName: 'businessHours', label: '营业时间' },
    { component: 'InputNumber', fieldName: 'latitude', label: '纬度', rules: 'required', componentProps: { step: 0.000001 } },
    { component: 'InputNumber', fieldName: 'longitude', label: '经度', rules: 'required', componentProps: { step: 0.000001 } },
    {
      component: 'RadioGroup',
      fieldName: 'isOpen',
      label: '营业状态',
      rules: 'selectRequired',
      componentProps: { options: [{ value: 1, label: '营业中' }, { value: 0, label: '休息中' }] },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'services',
      label: '服务类型',
      componentProps: {
        options: [
          { value: 'delivery', label: '可外送' },
          { value: 'pickup', label: '可自取' },
          { value: 'express', label: '可快递' },
        ],
      },
    },
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
  title: '门店管理',
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
    const data = modalApi.getData<StoreApi.Store>();
    await formApi.resetForm();
    if (data?.id) {
      await nextTick();
      const services = [];
      if (data.canDelivery) services.push('delivery');
      if (data.canPickup) services.push('pickup');
      if (data.canExpress) services.push('express');
      formApi.setValues({ ...data, services });
    }
  },
});

const [Grid, tableAction] = useVbenTable({
  api: getStoreListApi,
  columns: [
    { field: 'name', title: '门店名称', width: 150 },
    { field: 'address', title: '地址', width: 200 },
    { field: 'phone', title: '联系电话', width: 120 },
    { field: 'businessHours', title: '营业时间', width: 120 },
    {
      field: 'isOpen',
      title: '营业状态',
      width: 100,
      formatter: (val: number) => {
        return val === 1 ? '<span class="px-2 py-1 rounded text-sm bg-green-100 text-green-800">营业中</span>' : '<span class="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">休息中</span>';
      },
    },
    {
      field: 'canDelivery',
      title: '外送',
      width: 80,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      field: 'canPickup',
      title: '自取',
      width: 80,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      field: 'canExpress',
      title: '快递',
      width: 80,
      formatter: (val: number) => (val === 1 ? '是' : '否'),
    },
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
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.setData({}).open() }, children: '新增门店' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.setData(row).open() },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: StoreApi.Store) {
  if (await tableAction.confirm(`确定删除门店「${row.name}」吗？`)) {
    await deleteStoreApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}
</script>

<template>
  <Page title="门店管理" description="管理门店信息">
    <NCard>
      <Grid />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
