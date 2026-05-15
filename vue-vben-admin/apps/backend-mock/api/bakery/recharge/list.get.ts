import { defineEventHandler, getQuery } from 'h3';

const packages = [
  { id: 'rp001', name: '新手礼包', amount: 50.00, giftAmount: 5.00, isRecommended: 0, description: '新用户专享', sort: 1, status: 1 },
  { id: 'rp002', name: '银卡套餐', amount: 100.00, giftAmount: 15.00, isRecommended: 1, description: '赠送15元', sort: 2, status: 1 },
  { id: 'rp003', name: '金卡套餐', amount: 200.00, giftAmount: 40.00, isRecommended: 1, description: '赠送40元', sort: 3, status: 1 },
  { id: 'rp004', name: '钻石套餐', amount: 500.00, giftAmount: 120.00, isRecommended: 0, description: '赠送120元', sort: 4, status: 0 },
];

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { status, page = 1, pageSize = 10 } = query;
  let filtered = [...packages];
  if (status !== undefined) filtered = filtered.filter(p => p.status === Number(status));
  const total = filtered.length;
  const list = filtered.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize));
  return { code: 0, message: 'success', data: { list, total } };
});