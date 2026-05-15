import { defineMock } from 'vite-plugin-mock';

const coupons = [
  { id: 'c001', name: '满30减5元', type: 'full_reduction', typeText: '满减券', value: 5.00, minAmount: 30.00, startTime: '2024-03-01 00:00:00', endTime: '2024-03-31 23:59:59', totalCount: 100, receivedCount: 35, status: 1 },
  { id: 'c002', name: '满50减10元', type: 'full_reduction', typeText: '满减券', value: 10.00, minAmount: 50.00, startTime: '2024-03-01 00:00:00', endTime: '2024-03-31 23:59:59', totalCount: 50, receivedCount: 20, status: 1 },
  { id: 'c003', name: '8折优惠', type: 'discount', typeText: '折扣券', value: 0.8, minAmount: 20.00, startTime: '2024-03-15 00:00:00', endTime: '2024-03-20 23:59:59', totalCount: 100, receivedCount: 88, status: 0 },
];

export default defineMock({
  api: '/api/coupon/list',
  method: 'get',
  response: () => {
    return { code: 0, message: 'success', data: coupons };
  },
});

export const createCoupon = defineMock({
  api: '/api/coupon/create',
  method: 'post',
  response: ({ body }) => {
    const newCoupon = {
      ...body,
      id: `c${Date.now()}`,
      receivedCount: 0,
      typeText: body.type === 'full_reduction' ? '满减券' : '折扣券',
    };
    coupons.push(newCoupon);
    return { code: 0, message: 'success', data: newCoupon };
  },
});

export const updateCoupon = defineMock({
  api: '/api/coupon/update',
  method: 'put',
  response: ({ body }) => {
    const index = coupons.findIndex(c => c.id === body.id);
    if (index !== -1) {
      coupons[index] = { ...coupons[index], ...body };
      coupons[index].typeText = coupons[index].type === 'full_reduction' ? '满减券' : '折扣券';
      return { code: 0, message: 'success', data: coupons[index] };
    }
    return { code: 404, message: '优惠券不存在', data: null };
  },
});

export const deleteCoupon = defineMock({
  api: '/api/coupon/delete/:id',
  method: 'delete',
  response: ({ params }) => {
    const index = coupons.findIndex(c => c.id === params.id);
    if (index !== -1) {
      coupons.splice(index, 1);
      return { code: 0, message: 'success', data: null };
    }
    return { code: 404, message: '优惠券不存在', data: null };
  },
});