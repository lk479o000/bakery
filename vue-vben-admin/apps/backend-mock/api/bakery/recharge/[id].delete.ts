import { defineEventHandler } from 'h3';

const packages = [
  { id: 'rp001', name: '新手礼包', amount: 50.00, giftAmount: 5.00, isRecommended: 0, description: '新用户专享', sort: 1, status: 1 },
  { id: 'rp002', name: '银卡套餐', amount: 100.00, giftAmount: 15.00, isRecommended: 1, description: '赠送15元', sort: 2, status: 1 },
  { id: 'rp003', name: '金卡套餐', amount: 200.00, giftAmount: 40.00, isRecommended: 1, description: '赠送40元', sort: 3, status: 1 },
  { id: 'rp004', name: '钻石套餐', amount: 500.00, giftAmount: 120.00, isRecommended: 0, description: '赠送120元', sort: 4, status: 0 },
];

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const index = packages.findIndex(p => p.id === id);
  if (index !== -1) {
    packages.splice(index, 1);
    return { code: 0, message: 'success', data: null };
  }
  return { code: 404, message: '充值套餐不存在', data: null };
});