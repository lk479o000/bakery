import { defineEventHandler, readBody } from 'h3';

const banners = [
  { id: 'b001', title: '春季新品', image: '', link: '/bakery/product', sort: 1, status: 1 },
  { id: 'b002', title: '会员专享', image: '', link: '/bakery/coupon', sort: 2, status: 1 },
  { id: 'b003', title: '充值优惠', image: '', link: '/bakery/recharge', sort: 3, status: 0 },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newBanner = {
    ...body,
    id: `b${Date.now()}`,
  };
  banners.push(newBanner);
  return { code: 0, message: 'success', data: newBanner };
});