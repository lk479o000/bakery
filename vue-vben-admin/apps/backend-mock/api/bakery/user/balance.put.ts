import { defineEventHandler, readBody } from 'h3';

const users = [
  { id: 'u001', nickname: '张三', phone: '13800138001', points: 1200, balance: 268.00, memberLevel: 2, avatar: '', createdAt: '2024-01-10 10:00:00' },
  { id: 'u002', nickname: '李四', phone: '13800138002', points: 500, balance: 80.00, memberLevel: 1, avatar: '', createdAt: '2024-02-15 14:00:00' },
  { id: 'u003', nickname: '王五', phone: '13800138003', points: 3000, balance: 520.00, memberLevel: 3, avatar: '', createdAt: '2024-01-05 09:00:00' },
  { id: 'u004', nickname: '赵六', phone: '13800138004', points: 800, balance: 0.00, memberLevel: 1, avatar: '', createdAt: '2024-03-01 16:00:00' },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = users.find(u => u.id === body.userId);
  if (user) {
    user.balance += Number(body.amount);
    return { code: 0, message: 'success', data: user };
  }
  return { code: 404, message: '用户不存在', data: null };
});