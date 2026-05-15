import { defineEventHandler, readBody } from 'h3';

const products = [
  { id: 'p001', categoryId: 'c001', categoryName: '面包', name: '法式可颂', description: '酥脆可口，黄油香浓', price: 12.00, originalPrice: 15.00, image: '', stock: 100, status: 1, sort: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 'p002', categoryId: 'c001', categoryName: '面包', name: '全麦吐司', description: '健康营养，全麦制作', price: 8.00, originalPrice: 10.00, image: '', stock: 50, status: 1, sort: 2, createdAt: '2024-01-02 10:00:00' },
  { id: 'p003', categoryId: 'c002', categoryName: '蛋糕', name: '提拉米苏', description: '意大利经典甜品', price: 28.00, originalPrice: 35.00, image: '', stock: 30, status: 1, sort: 1, createdAt: '2024-01-03 10:00:00' },
  { id: 'p004', categoryId: 'c002', categoryName: '蛋糕', name: '芝士蛋糕', description: '浓郁芝士，口感细腻', price: 32.00, originalPrice: 40.00, image: '', stock: 25, status: 1, sort: 2, createdAt: '2024-01-04 10:00:00' },
  { id: 'p005', categoryId: 'c003', categoryName: '甜点', name: '马卡龙', description: '法式精致甜点', price: 15.00, originalPrice: 18.00, image: '', stock: 100, status: 1, sort: 1, createdAt: '2024-01-05 10:00:00' },
  { id: 'p006', categoryId: 'c003', categoryName: '甜点', name: '泡芙', description: '酥脆外皮，奶油内馅', price: 6.00, originalPrice: 8.00, image: '', stock: 80, status: 0, sort: 2, createdAt: '2024-01-06 10:00:00' },
];

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...body };
    return { code: 0, message: 'success', data: products[index] };
  }
  return { code: 404, message: '商品不存在', data: null };
});