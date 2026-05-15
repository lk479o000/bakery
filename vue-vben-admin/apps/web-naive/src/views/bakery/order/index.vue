<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { useVbenForm } from '#/adapter/form';
import { useVbenTable } from '#/adapter/vxe-table';

import { NCard, useMessage } from 'naive-ui';

import { getOrderListApi, updateOrderStatusApi, cancelOrderApi, type OrderApi } from '#/api/bakery/order';
import { formatAppDateTime } from '#/utils/format-app-datetime';

const message = useMessage();
const { locale } = useI18n();

const orderDetail = ref<OrderApi.Order | null>(null);

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

const [DetailModal, detailModalApi] = useVbenModal({
  title: '订单详情',
  contentClass: 'max-h-[calc(100vh-200px)] overflow-auto',
  onOpenChange(isOpen) {
    if (isOpen) {
      orderDetail.value = detailModalApi.getData<OrderApi.Order>();
    } else {
      orderDetail.value = null;
    }
  },
});

const [StatusForm, statusFormApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  handleSubmit: async (values) => {
    const orderId = statusModalApi.getData<OrderApi.Order>()?.id;
    if (!orderId) return;
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

const [StatusModal, statusModalApi] = useVbenModal({
  title: '更新订单状态',
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    await statusFormApi.resetForm();
    const row = statusModalApi.getData<OrderApi.Order>();
    if (row?.id !== undefined) {
      statusFormApi.setValues({ status: row.status });
    }
  },
});

const [Grid, tableAction] = useVbenTable({
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
        return status
          ? `<span class="px-2 py-1 rounded text-sm bg-${colors[val]}-100 text-${colors[val]}-800">${status.label}</span>`
          : String(val);
      },
    },
    { field: 'totalAmount', title: '订单金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'discountAmount', title: '优惠金额', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'payAmount', title: '实付金额', width: 120, formatter: (val: number) => `¥${val.toFixed(2)}` },
    {
      field: 'createTime',
      title: '创建时间',
      width: 180,
      formatter: (val: string) => formatAppDateTime(val, locale.value),
    },
    {
      field: 'payTime',
      title: '支付时间',
      width: 180,
      formatter: (val: string | null) => formatAppDateTime(val, locale.value),
    },
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
      { text: '详情', onClick: (row) => detailModalApi.setData(row).open() },
      { text: '更新状态', onClick: (row) => statusModalApi.setData(row).open() },
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
</script>

<template>
  <Page title="订单管理" description="管理订单信息">
    <NCard>
      <Grid />
    </NCard>
    <DetailModal>
      <div v-if="orderDetail" class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <span class="font-bold text-gray-900">订单编号：{{ orderDetail.orderNo }}</span>
          <span :class="[
            'px-2 py-1 rounded text-sm',
            orderDetail.status === 0 ? 'bg-yellow-100 text-yellow-800' :
            orderDetail.status === 1 ? 'bg-green-100 text-green-800' :
            orderDetail.status === 2 ? 'bg-blue-100 text-blue-800' :
            orderDetail.status === 3 ? 'bg-blue-100 text-blue-800' :
            orderDetail.status === 4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ orderDetail.statusText }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-gray-700">
          <div><strong>用户：</strong>{{ orderDetail.userName }}</div>
          <div><strong>订单类型：</strong>{{ orderDetail.typeText }}</div>
          <div><strong>支付方式：</strong>{{ orderDetail.payType === 'wechat' ? '微信支付' : '余额支付' }}</div>
          <div><strong>订单金额：</strong>¥{{ orderDetail.totalAmount.toFixed(2) }}</div>
          <div><strong>优惠金额：</strong>¥{{ orderDetail.discountAmount.toFixed(2) }}</div>
          <div><strong>实付金额：</strong>¥{{ orderDetail.payAmount.toFixed(2) }}</div>
          <div><strong>创建时间：</strong>{{ formatAppDateTime(orderDetail.createTime, locale) }}</div>
          <div><strong>支付时间：</strong>{{ formatAppDateTime(orderDetail.payTime, locale) }}</div>
        </div>
        <div v-if="orderDetail.remark" class="p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <strong>备注：</strong>{{ orderDetail.remark }}
        </div>
        <div>
          <h4 class="font-bold mb-2">商品列表</h4>
          <div class="space-y-2">
            <div v-for="(item, index) in orderDetail.items" :key="index" class="flex items-center justify-between p-2 border-b">
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
