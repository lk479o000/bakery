<script lang="ts" setup>
import { nextTick } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getCouponListApi, createCouponApi, updateCouponApi, deleteCouponApi, type CouponApi } from '#/api/bakery/coupon';
import { formatAppDateTime } from '#/utils/format-app-datetime';

const message = useMessage();
const { locale } = useI18n();

const typeOptions = [
  { value: 'full_reduction', label: '满减券' },
  { value: 'discount', label: '折扣券' },
];

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  showDefaultActions: false,
  handleSubmit: async (values) => {
    const data = values as CouponApi.CreateCouponParams;
    const current = modalApi.getData<CouponApi.Coupon>();
    if (current?.id) {
      await updateCouponApi({ ...data, id: current.id });
      message.success('更新成功');
    } else {
      await createCouponApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Input', fieldName: 'name', label: '优惠券名称', rules: 'required' },
    {
      component: 'RadioGroup',
      fieldName: 'type',
      label: '类型',
      rules: 'selectRequired',
      componentProps: { options: typeOptions },
    },
    { component: 'InputNumber', fieldName: 'value', label: '优惠值', rules: 'required', componentProps: { min: 0 } },
    { component: 'InputNumber', fieldName: 'minAmount', label: '最低消费', componentProps: { min: 0 } },
    { component: 'DatePicker', fieldName: 'startTime', label: '开始时间', rules: 'required', componentProps: { type: 'datetime' } },
    { component: 'DatePicker', fieldName: 'endTime', label: '结束时间', rules: 'required', componentProps: { type: 'datetime' } },
    { component: 'InputNumber', fieldName: 'totalCount', label: '发放总量', componentProps: { min: 0 } },
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
  title: '优惠券管理',
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
    const data = modalApi.getData<CouponApi.Coupon>();
    await formApi.resetForm();
    if (data?.id) {
      await nextTick();
      formApi.setValues(data);
    }
  },
});

const [Grid, tableAction] = useVbenTable({
  api: getCouponListApi,
  columns: [
    { field: 'name', title: '优惠券名称', width: 150 },
    {
      field: 'type',
      title: '类型',
      width: 100,
      formatter: (val: string) => {
        const type = typeOptions.find(t => t.value === val);
        return type?.label || val;
      },
    },
    {
      field: 'value',
      title: '优惠值',
      width: 100,
      formatter: (val: number, row: CouponApi.Coupon) => {
        return row.type === 'discount' ? `${val * 10}折` : `¥${val.toFixed(2)}`;
      },
    },
    { field: 'minAmount', title: '最低消费', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    {
      field: 'startTime',
      title: '开始时间',
      width: 180,
      formatter: (val: string) => formatAppDateTime(val, locale.value),
    },
    {
      field: 'endTime',
      title: '结束时间',
      width: 180,
      formatter: (val: string) => formatAppDateTime(val, locale.value),
    },
    { field: 'totalCount', title: '发放总量', width: 100 },
    { field: 'receivedCount', title: '已领取', width: 100 },
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
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.setData({}).open() }, children: '新增优惠券' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.setData(row).open() },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: CouponApi.Coupon) {
  if (await tableAction.confirm(`确定删除优惠券「${row.name}」吗？`)) {
    await deleteCouponApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}
</script>

<template>
  <Page title="优惠券管理" description="管理优惠券信息">
    <NCard>
      <Grid />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
