<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getCouponListApi, createCouponApi, updateCouponApi, deleteCouponApi, type CouponApi } from '#/api/bakery/coupon';

const message = useMessage();

const typeOptions = [
  { value: 'full_reduction', label: '满减券' },
  { value: 'discount', label: '折扣券' },
];

const [table, tableAction] = useVbenTable({
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
    { field: 'startTime', title: '开始时间', width: 160 },
    { field: 'endTime', title: '结束时间', width: 160 },
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
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.open() }, children: '新增优惠券' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.open({ data: row }) },
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

const [Modal, modalApi] = useVbenModal({
  title: '优惠券管理',
  bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: async (values) => {
    const data = values as CouponApi.CreateCouponParams;
    if (modalApi.getCurrentData()?.id) {
      await updateCouponApi({ ...data, id: modalApi.getCurrentData().id });
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

modalApi?.onOpen?.((data) => {
  if (data?.id) {
    formApi.setValues(data);
  } else {
    formApi.reset();
  }
});
</script>

<template>
  <Page title="优惠券管理" description="管理优惠券信息">
    <NCard>
      <table />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>