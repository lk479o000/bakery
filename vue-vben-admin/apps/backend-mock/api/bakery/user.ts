import { defineMock } from 'vite-plugin-mock';

const users = [
  { id: 'u001', openid: 'openid001', nickname: '张三', avatar: '', phone: '13800138001', points: 100, balance: 150.00, memberLevel: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 'u002', openid: 'openid002', nickname: '李四', avatar: '', phone: '13800138002', points: 200, balance: 50.00, memberLevel: 2, createdAt: '2024-01-02 10:00:00' },
  { id: 'u003', openid: 'openid003', nickname: '王五', avatar: '', phone: '13800138003', points: 500, balance: 500.00, memberLevel: 3, createdAt: '2024-01-03 10:00:00' },
  { id: 'u004', openid: 'openid004', nickname: '赵六', avatar: '', phone: '', points: 50, balance: 0.00, memberLevel: 1, createdAt: '2024-01-04 10:00:00' },
];

export default defineMock({
  api: '/api/user/list',
  method: 'get',
  response: ({ query }) => {
    const { nickname, phone, page = 1, pageSize = 10 } = query;
    let filtered = [...users];
    if (nickname) filtered = filtered.filter(u => u.nickname.includes(nickname));
    if (phone) filtered = filtered.filter(u => u.phone.includes(phone));
    const total = filtered.length;
    const list = filtered.slice((page - 1) * pageSize, page * pageSize);
    return { code: 0, message: 'success', data: { list, total } };
  },
});

export const userDetail = defineMock({
  api: '/api/user/detail/:id',
  method: 'get',
  response: ({ params }) => {
    const user = users.find(u => u.id === params.id);
    if (user) {
      return { code: 0, message: 'success', data: user };
    }
    return { code: 404, message: '用户不存在', data: null };
  },
});

export const updateUserBalance = defineMock({
  api: '/api/user/balance',
  method: 'put',
  response: ({ body }) => {
    const user = users.find(u => u.id === body.id);
    if (user) {
      user.balance += body.amount;
      return { code: 0, message: 'success', data: user };
    }
    return { code: 404, message: '用户不存在', data: null };
  },
});