<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getUserListApi, updateUserBalanceApi, type UserApi } from '#/api/bakery/user';

const message = useMessage();

const [table, tableAction] = useVbenTable({
  api: getUserListApi,
  columns: [
    {
      field: 'avatar',
      title: '头像',
      width: 80,
      formatter: (val: string) => val ? `<img src="${val}" class="w-10 h-10 rounded-full" />` : '-',
    },
    { field: 'nickname', title: '昵称', width: 120 },
    { field: 'phone', title: '手机号', width: 120 },
    { field: 'points', title: '积分', width: 80 },
    { field: 'balance', title: '余额', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    {
      field: 'memberLevel',
      title: '会员等级',
      width: 100,
      formatter: (val: number) => {
        const levels = ['', '普通会员', '银卡会员', '金卡会员', '钻石会员'];
        return levels[val] || `等级${val}`;
      },
    },
    { field: 'createdAt', title: '注册时间', width: 160 },
    { field: 'action', title: '操作', width: 180, fixed: 'right' },
  ],
  searchSchema: [
    { component: 'Input', fieldName: 'nickname', label: '昵称' },
    { component: 'Input', fieldName: 'phone', label: '手机号' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '详情', onClick: (row) => detailModalApi.open({ data: row }) },
      { text: '充值', onClick: (row) => balanceModalApi.open({ data: row }) },
    ],
  },
});

const [DetailModal, detailModalApi] = useVbenModal({
  title: '用户详情',
  bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
});

const [BalanceModal, balanceModalApi] = useVbenModal({
  title: '余额充值',
});

const [BalanceForm, balanceFormApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  handleSubmit: async (values) => {
    const userId = balanceModalApi.getCurrentData()?.id;
    await updateUserBalanceApi(userId, values.amount, values.remark);
    message.success('充值成功');
    balanceModalApi.close();
    tableAction.refresh();
  },
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'amount',
      label: '充值金额',
      rules: 'required',
      componentProps: { min: 0.01, step: 0.01 },
    },
    { component: 'Input', fieldName: 'remark', label: '备注', componentProps: { type: 'textarea' } },
  ],
});

balanceModalApi?.onOpen?.(() => {
  balanceFormApi.reset();
});
</script>

<template>
  <Page title="用户管理" description="管理用户信息">
    <NCard>
      <table />
    </NCard>
    <DetailModal>
      <div v-if="detailModalApi.getCurrentData()" class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded">
          <img v-if="detailModalApi.getCurrentData().avatar" :src="detailModalApi.getCurrentData().avatar" class="w-20 h-20 rounded-full" />
          <div>
            <h3 class="font-bold text-lg">{{ detailModalApi.getCurrentData().nickname }}</h3>
            <p>ID: {{ detailModalApi.getCurrentData().id }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><strong>手机号：</strong>{{ detailModalApi.getCurrentData().phone || '-' }}</div>
          <div><strong>会员等级：</strong>{{ ['', '普通会员', '银卡会员', '金卡会员', '钻石会员'][detailModalApi.getCurrentData().memberLevel] || `等级${detailModalApi.getCurrentData().memberLevel}` }}</div>
          <div><strong>积分：</strong>{{ detailModalApi.getCurrentData().points }}</div>
          <div><strong>余额：</strong>¥{{ detailModalApi.getCurrentData().balance.toFixed(2) }}</div>
          <div><strong>注册时间：</strong>{{ detailModalApi.getCurrentData().createdAt }}</div>
        </div>
      </div>
    </DetailModal>
    <BalanceModal>
      <BalanceForm />
    </BalanceModal>
  </Page>
</template>