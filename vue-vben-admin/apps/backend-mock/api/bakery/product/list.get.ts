import { defineEventHandler, getQuery } from 'h3';

const products = [
  { id: 'p001', categoryId: 'c001', categoryName: '面包', name: '法式可颂', description: '酥脆可口，黄油香浓', price: 12.00, originalPrice: 15.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=french%20croissant%20pastry%20golden%20flaky&image_size=square', stock: 100, status: 1, sort: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 'p002', categoryId: 'c001', categoryName: '面包', name: '全麦吐司', description: '健康营养，全麦制作', price: 8.00, originalPrice: 10.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=whole%20wheat%20toast%20bread%20slices&image_size=square', stock: 50, status: 1, sort: 2, createdAt: '2024-01-02 10:00:00' },
  { id: 'p003', categoryId: 'c002', categoryName: '蛋糕', name: '提拉米苏', description: '意大利经典甜品', price: 28.00, originalPrice: 35.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tiramisu%20dessert%20elegant%20presentation&image_size=square', stock: 30, status: 1, sort: 1, createdAt: '2024-01-03 10:00:00' },
  { id: 'p004', categoryId: 'c002', categoryName: '蛋糕', name: '芝士蛋糕', description: '浓郁芝士，口感细腻', price: 32.00, originalPrice: 40.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheesecake%20creamy%20slice%20dessert&image_size=square', stock: 25, status: 1, sort: 2, createdAt: '2024-01-04 10:00:00' },
  { id: 'p005', categoryId: 'c003', categoryName: '甜点', name: '马卡龙', description: '法式精致甜点', price: 15.00, originalPrice: 18.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colorful%20french%20macarons%20pastry&image_size=square', stock: 100, status: 1, sort: 1, createdAt: '2024-01-05 10:00:00' },
  { id: 'p006', categoryId: 'c003', categoryName: '甜点', name: '泡芙', description: '酥脆外皮，奶油内馅', price: 6.00, originalPrice: 8.00, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cream%20puff%20pastry%20dessert&image_size=square', stock: 80, status: 0, sort: 2, createdAt: '2024-01-06 10:00:00' },
];

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { categoryId, name, page = 1, pageSize = 10 } = query;
  let filtered = [...products];
  if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId);
  if (name) filtered = filtered.filter(p => p.name.includes(name as string));
  const total = filtered.length;
  const list = filtered.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize));
  return { code: 0, message: 'success', data: { list, total } };
});