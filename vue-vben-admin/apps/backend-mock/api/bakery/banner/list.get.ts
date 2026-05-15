import { defineEventHandler, getQuery } from 'h3';

const banners = [
  { id: 'b001', title: '春季新品', image: '', link: '/bakery/product', sort: 1, status: 1 },
  { id: 'b002', title: '会员专享', image: '', link: '/bakery/coupon', sort: 2, status: 1 },
  { id: 'b003', title: '充值优惠', image: '', link: '/bakery/recharge', sort: 3, status: 0 },
];

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { status, page = 1, pageSize = 10 } = query;
  let filtered = [...banners];
  if (status !== undefined) filtered = filtered.filter(b => b.status === Number(status));
  const total = filtered.length;
  const list = filtered.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize));
  return { code: 0, message: 'success', data: { list, total } };
});