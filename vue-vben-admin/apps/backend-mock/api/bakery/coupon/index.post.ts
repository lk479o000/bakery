import { defineEventHandler, readBody } from 'h3';

const coupons = [
  { id: 'cp001', name: '新用户专享券', type: 'fixed', value: 10.00, minAmount: 50.00, totalCount: 100, usedCount: 35, status: 1, sort: 1, startTime: '2024-03-01 00:00:00', endTime: '2024-04-30 23:59:59' },
  { id: 'cp002', name: '满减优惠', type: 'fixed', value: 20.00, minAmount: 100.00, totalCount: 50, usedCount: 20, status: 1, sort: 2, startTime: '2024-03-15 00:00:00', endTime: '2024-03-31 23:59:59' },
  { id: 'cp003', name: '会员9折券', type: 'percent', value: 10, minAmount: 0, totalCount: 200, usedCount: 88, status: 1, sort: 3, startTime: '2024-03-01 00:00:00', endTime: '2024-05-31 23:59:59' },
  { id: 'cp004', name: '节日特惠', type: 'fixed', value: 15.00, minAmount: 80.00, totalCount: 30, usedCount: 30, status: 0, sort: 4, startTime: '2024-02-01 00:00:00', endTime: '2024-02-29 23:59:59' },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newCoupon = {
    ...body,
    id: `cp${Date.now()}`,
    usedCount: 0,
  };
  coupons.push(newCoupon);
  return { code: 0, message: 'success', data: newCoupon };
});