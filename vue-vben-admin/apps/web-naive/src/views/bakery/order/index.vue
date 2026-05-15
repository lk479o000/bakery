<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';

import { NCard, useMessage } from 'naive-ui';

import { getOrderListApi, updateOrderStatusApi, cancelOrderApi, type OrderApi } from '#/api/bakery/order';

const message = useMessage();

const statusOptions = [
  { value: 0, label: '待支付' },
  { value: 1, label: '已支付' },
  { value: 2, label: '制作中' },
  { value: 3, label: '待取餐' },
  { value: 4, label: '已完成' },
  { value: 5, label: '已取消' },
];

const typeOptions = [
  { value: 'store', label: '门店订单' },
  { value: 'recharge', label: '储值订单' },
  { value: 'payment', label: '买单订单' },
  { value: 'coupon', label: '券包订单' },
];

const [table, tableAction] = useVbenTable({
  api: getOrderListApi,
  columns: [
    { field: 'orderNo', title: '订单编号', width: 160 },
    { field: 'userName', title: '用户', width: 100 },
    { field: 'typeText', title: '订单类型', width: 100 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      formatter: (val: number) => {
        const colors = ['yellow', 'green', 'blue', 'blue', 'green', 'red'];
        const status = statusOptions.find(s => s.value === val);
        return status ? `<span class="px-2 py-1 rounded text-sm bg-${colors[val]}-100 text-${colors[val]}-800">${status.label}</span>` : val;
      },
    },
    { field: 'totalAmount', title: '订单金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'discountAmount', title: '优惠金额', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'payAmount', title: '实付金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'createTime', title: '创建时间', width: 160 },
    { field: 'payTime', title: '支付时间', width: 160 },
    { field: 'action', title: '操作', width: 200, fixed: 'right' },
  ],
  searchSchema: [
    { component: 'Input', fieldName: 'orderNo', label: '订单编号' },
    { component: 'Select', fieldName: 'status', label: '状态', componentProps: { options: statusOptions } },
    { component: 'Select', fieldName: 'type', label: '订单类型', componentProps: { options: typeOptions } },
  ],
  actionColumn: {
    width: 200,
    buttons: [
      { text: '详情', onClick: (row) => detailModalApi.open({ data: row }) },
      { text: '更新状态', onClick: (row) => statusModalApi.open({ data: row }) },
      { text: '取消订单', onClick: handleCancel, type: 'danger', hidden: (row) => row.status !== 0 },
    ],
  },
});

async function handleCancel(row: OrderApi.Order) {
  if (await tableAction.confirm(`确定取消订单「${row.orderNo}」吗？`)) {
    await cancelOrderApi(row.id);
    message.success('取消成功');
    tableAction.refresh();
  }
}

const [DetailModal, detailModalApi] = useVbenModal({
  title: '订单详情',
  bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
});

const [StatusModal, statusModalApi] = useVbenModal({
  title: '更新订单状态',
});

import { useVbenForm } from '#/adapter/form';

const [StatusForm, statusFormApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  handleSubmit: async (values) => {
    const orderId = statusModalApi.getCurrentData()?.id;
    await updateOrderStatusApi(orderId, values.status);
    message.success('更新成功');
    statusModalApi.close();
    tableAction.refresh();
  },
  schema: [
    {
      component: 'Select',
      fieldName: 'status',
      label: '订单状态',
      rules: 'required',
      componentProps: { options: statusOptions },
    },
  ],
});

statusModalApi?.onOpen?.(() => {
  statusFormApi.reset();
});
</script>

<template>
  <Page title="订单管理" description="管理订单信息">
    <NCard>
      <table />
    </NCard>
    <DetailModal>
      <div v-if="detailModalApi.getCurrentData()" class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded">
          <span class="font-bold">订单编号：{{ detailModalApi.getCurrentData().orderNo }}</span>
          <span :class="[
            'px-2 py-1 rounded text-sm',
            detailModalApi.getCurrentData().status === 0 ? 'bg-yellow-100 text-yellow-800' :
            detailModalApi.getCurrentData().status === 1 ? 'bg-green-100 text-green-800' :
            detailModalApi.getCurrentData().status === 2 ? 'bg-blue-100 text-blue-800' :
            detailModalApi.getCurrentData().status === 3 ? 'bg-blue-100 text-blue-800' :
            detailModalApi.getCurrentData().status === 4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ detailModalApi.getCurrentData().statusText }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><strong>用户：</strong>{{ detailModalApi.getCurrentData().userName }}</div>
          <div><strong>订单类型：</strong>{{ detailModalApi.getCurrentData().typeText }}</div>
          <div><strong>支付方式：</strong>{{ detailModalApi.getCurrentData().payType === 'wechat' ? '微信支付' : '余额支付' }}</div>
          <div><strong>订单金额：</strong>¥{{ detailModalApi.getCurrentData().totalAmount.toFixed(2) }}</div>
          <div><strong>优惠金额：</strong>¥{{ detailModalApi.getCurrentData().discountAmount.toFixed(2) }}</div>
          <div><strong>实付金额：</strong>¥{{ detailModalApi.getCurrentData().payAmount.toFixed(2) }}</div>
          <div><strong>创建时间：</strong>{{ detailModalApi.getCurrentData().createTime }}</div>
          <div><strong>支付时间：</strong>{{ detailModalApi.getCurrentData().payTime || '-' }}</div>
        </div>
        <div v-if="detailModalApi.getCurrentData().remark" class="p-4 bg-gray-50 rounded">
          <strong>备注：</strong>{{ detailModalApi.getCurrentData().remark }}
        </div>
        <div>
          <h4 class="font-bold mb-2">商品列表</h4>
          <div class="space-y-2">
            <div v-for="(item, index) in detailModalApi.getCurrentData().items" :key="index" class="flex items-center justify-between p-2 border-b">
              <div class="flex items-center gap-2">
                <img v-if="item.productImage" :src="item.productImage" class="w-10 h-10 rounded" />
                <span>{{ item.productName }}</span>
              </div>
              <div class="text-right">
                <span>¥{{ item.price.toFixed(2) }} x {{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
    <StatusModal>
      <StatusForm />
    </StatusModal>
  </Page>
</template>