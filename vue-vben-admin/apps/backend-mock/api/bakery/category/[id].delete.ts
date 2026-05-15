import { defineEventHandler } from 'h3';

const categories = [
  { id: 'c001', name: '面包', icon: '', sort: 1, status: 1 },
  { id: 'c002', name: '蛋糕', icon: '', sort: 2, status: 1 },
  { id: 'c003', name: '甜点', icon: '', sort: 3, status: 1 },
  { id: 'c004', name: '饮品', icon: '', sort: 4, status: 0 },
];

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories.splice(index, 1);
    return { code: 0, message: 'success', data: null };
  }
  return { code: 404, message: '分类不存在', data: null };
});