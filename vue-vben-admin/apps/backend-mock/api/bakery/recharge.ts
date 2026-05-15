import { defineMock } from 'vite-plugin-mock';

const packages = [
  { id: 'rp001', name: '新人专享', amount: 50.00, giftAmount: 5.00, isRecommended: 0, description: '新人首次充值享额外赠送', sort: 3, status: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 'rp002', name: '超值充值', amount: 100.00, giftAmount: 15.00, isRecommended: 1, description: '推荐！充100送15', sort: 1, status: 1, createdAt: '2024-01-02 10:00:00' },
  { id: 'rp003', name: '尊享充值', amount: 200.00, giftAmount: 40.00, isRecommended: 1, description: '充200送40，更划算', sort: 2, status: 1, createdAt: '2024-01-03 10:00:00' },
  { id: 'rp004', name: '豪华充值', amount: 500.00, giftAmount: 120.00, isRecommended: 0, description: '充500送120', sort: 4, status: 0, createdAt: '2024-01-04 10:00:00' },
];

export default defineMock({
  api: '/api/recharge-package/list',
  method: 'get',
  response: () => {
    return { code: 0, message: 'success', data: packages };
  },
});

export const createRechargePackage = defineMock({
  api: '/api/recharge-package/create',
  method: 'post',
  response: ({ body }) => {
    const newPackage = {
      ...body,
      id: `rp${Date.now()}`,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    packages.push(newPackage);
    return { code: 0, message: 'success', data: newPackage };
  },
});

export const updateRechargePackage = defineMock({
  api: '/api/recharge-package/update',
  method: 'put',
  response: ({ body }) => {
    const index = packages.findIndex(p => p.id === body.id);
    if (index !== -1) {
      packages[index] = { ...packages[index], ...body };
      return { code: 0, message: 'success', data: packages[index] };
    }
    return { code: 404, message: '套餐不存在', data: null };
  },
});

export const deleteRechargePackage = defineMock({
  api: '/api/recharge-package/delete/:id',
  method: 'delete',
  response: ({ params }) => {
    const index = packages.findIndex(p => p.id === params.id);
    if (index !== -1) {
      packages.splice(index, 1);
      return { code: 0, message: 'success', data: null };
    }
    return { code: 404, message: '套餐不存在', data: null };
  },
});