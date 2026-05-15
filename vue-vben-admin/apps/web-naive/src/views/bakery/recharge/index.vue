<script lang="ts" setup>
import { nextTick } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getRechargePackageListApi, createRechargePackageApi, updateRechargePackageApi, deleteRechargePackageApi, type RechargeApi } from '#/api/bakery/recharge';

const message = useMessage();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  showDefaultActions: false,
  handleSubmit: async (values) => {
    const data = values as RechargeApi.CreateRechargePackageParams;
    const current = modalApi.getData<RechargeApi.RechargePackage>();
    if (current?.id) {
      await updateRechargePackageApi({ ...data, id: current.id });
      message.success('更新成功');
    } else {
      await createRechargePackageApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Input', fieldName: 'name', label: '套餐名称', rules: 'required' },
    { component: 'InputNumber', fieldName: 'amount', label: '充值金额', rules: 'required', componentProps: { min: 0, step: 0.01 } },
    { component: 'InputNumber', fieldName: 'giftAmount', label: '赠送金额', componentProps: { min: 0, step: 0.01 } },
    {
      component: 'RadioGroup',
      fieldName: 'isRecommended',
      label: '是否推荐',
      rules: 'selectRequired',
      componentProps: { options: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
    },
    { component: 'Input', fieldName: 'description', label: '描述', componentProps: { type: 'textarea' } },
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
  title: '充值套餐管理',
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
    const data = modalApi.getData<RechargeApi.RechargePackage>();
    await formApi.resetForm();
    if (data?.id) {
      await nextTick();
      formApi.setValues(data);
    }
  },
});

const [Grid, tableAction] = useVbenTable({
  api: getRechargePackageListApi,
  columns: [
    { field: 'name', title: '套餐名称', width: 150 },
    { field: 'amount', title: '充值金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'giftAmount', title: '赠送金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    {
      field: 'isRecommended',
      title: '推荐',
      width: 80,
      formatter: (val: number) => {
        return val === 1 ? '<span class="px-2 py-1 rounded text-sm bg-green-100 text-green-800">是</span>' : '否';
      },
    },
    { field: 'description', title: '描述', width: 200 },
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
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.setData({}).open() }, children: '新增套餐' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.setData(row).open() },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: RechargeApi.RechargePackage) {
  if (await tableAction.confirm(`确定删除充值套餐「${row.name}」吗？`)) {
    await deleteRechargePackageApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}
</script>

<template>
  <Page title="充值套餐管理" description="管理充值套餐信息">
    <NCard>
      <Grid />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
