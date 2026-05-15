<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NCard, useMessage } from 'naive-ui';

import { getUserListApi, updateUserBalanceApi, type UserApi } from '#/api/bakery/user';
import { formatAppDateTime } from '#/utils/format-app-datetime';

const message = useMessage();
const { locale } = useI18n();

const userDetail = ref<UserApi.User | null>(null);

const [DetailModal, detailModalApi] = useVbenModal({
  title: '用户详情',
  contentClass: 'max-h-[calc(100vh-200px)] overflow-auto',
  onOpenChange(isOpen) {
    if (isOpen) {
      userDetail.value = detailModalApi.getData<UserApi.User>();
    } else {
      userDetail.value = null;
    }
  },
});

const [BalanceForm, balanceFormApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  handleSubmit: async (values) => {
    const userId = balanceModalApi.getData<UserApi.User>()?.id;
    if (!userId) return;
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

const [BalanceModal, balanceModalApi] = useVbenModal({
  title: '余额充值',
  async onOpenChange(isOpen) {
    if (isOpen) {
      await balanceFormApi.resetForm();
    }
  },
});

const [Grid, tableAction] = useVbenTable({
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
    {
      field: 'createdAt',
      title: '注册时间',
      width: 180,
      formatter: (val: string) => formatAppDateTime(val, locale.value),
    },
    { field: 'action', title: '操作', width: 180, fixed: 'right' },
  ],
  searchSchema: [
    { component: 'Input', fieldName: 'nickname', label: '昵称' },
    { component: 'Input', fieldName: 'phone', label: '手机号' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '详情', onClick: (row) => detailModalApi.setData(row).open() },
      { text: '充值', onClick: (row) => balanceModalApi.setData(row).open() },
    ],
  },
});
</script>

<template>
  <Page title="用户管理" description="管理用户信息">
    <NCard>
      <Grid />
    </NCard>
    <DetailModal>
      <div v-if="userDetail" class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <img v-if="userDetail.avatar" :src="userDetail.avatar" class="w-20 h-20 rounded-full border-2 border-white shadow" />
          <div>
            <h3 class="font-bold text-lg text-gray-900">{{ userDetail.nickname }}</h3>
            <p class="text-gray-500">ID: {{ userDetail.id }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-gray-700">
          <div><strong>手机号：</strong>{{ userDetail.phone || '-' }}</div>
          <div><strong>会员等级：</strong>{{ ['', '普通会员', '银卡会员', '金卡会员', '钻石会员'][userDetail.memberLevel] || `等级${userDetail.memberLevel}` }}</div>
          <div><strong>积分：</strong>{{ userDetail.points }}</div>
          <div><strong>余额：</strong>¥{{ userDetail.balance.toFixed(2) }}</div>
          <div><strong>注册时间：</strong>{{ formatAppDateTime(userDetail.createdAt, locale) }}</div>
        </div>
      </div>
    </DetailModal>
    <BalanceModal>
      <BalanceForm />
    </BalanceModal>
  </Page>
</template>
