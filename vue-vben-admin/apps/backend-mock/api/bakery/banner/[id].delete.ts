import { defineEventHandler } from 'h3';

const banners = [
  { id: 'b001', title: '春季新品', image: '', link: '/bakery/product', sort: 1, status: 1 },
  { id: 'b002', title: '会员专享', image: '', link: '/bakery/coupon', sort: 2, status: 1 },
  { id: 'b003', title: '充值优惠', image: '', link: '/bakery/recharge', sort: 3, status: 0 },
];

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const index = banners.findIndex(b => b.id === id);
  if (index !== -1) {
    banners.splice(index, 1);
    return { code: 0, message: 'success', data: null };
  }
  return { code: 404, message: '轮播图不存在', data: null };
});