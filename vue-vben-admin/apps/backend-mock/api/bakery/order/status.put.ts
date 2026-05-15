import { defineEventHandler, readBody } from 'h3';

const orders = [
  {
    id: 'o001',
    orderNo: '202403230001',
    userId: 'u001',
    userName: '张三',
    type: 'store',
    typeText: '门店订单',
    status: 1,
    statusText: '已支付',
    totalAmount: 36.00,
    discountAmount: 5.00,
    payAmount: 31.00,
    payType: 'wechat',
    remark: '请尽快送达',
    createTime: '2024-03-23 10:00:00',
    payTime: '2024-03-23 10:01:00',
    items: [],
  },
  {
    id: 'o002',
    orderNo: '202403230002',
    userId: 'u002',
    userName: '李四',
    type: 'store',
    typeText: '门店订单',
    status: 2,
    statusText: '制作中',
    totalAmount: 20.00,
    discountAmount: 0.00,
    payAmount: 20.00,
    payType: 'balance',
    remark: '',
    createTime: '2024-03-23 11:00:00',
    payTime: '2024-03-23 11:00:05',
    items: [],
  },
  {
    id: 'o003',
    orderNo: '202403230003',
    userId: 'u003',
    userName: '王五',
    type: 'recharge',
    typeText: '储值订单',
    status: 1,
    statusText: '已支付',
    totalAmount: 100.00,
    discountAmount: 10.00,
    payAmount: 100.00,
    payType: 'wechat',
    remark: '',
    createTime: '2024-03-23 12:00:00',
    payTime: '2024-03-23 12:00:10',
    items: [],
  },
  {
    id: 'o004',
    orderNo: '202403230004',
    userId: 'u001',
    userName: '张三',
    type: 'store',
    typeText: '门店订单',
    status: 0,
    statusText: '待支付',
    totalAmount: 50.00,
    discountAmount: 0.00,
    payAmount: 50.00,
    payType: '',
    remark: '',
    createTime: '2024-03-23 13:00:00',
    payTime: '',
    items: [],
  },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const order = orders.find(o => o.id === body.id);
  if (order) {
    order.status = body.status;
    const statusMap = ['待支付', '已支付', '制作中', '待取餐', '已完成', '已取消'];
    order.statusText = statusMap[body.status];
    return { code: 0, message: 'success', data: order };
  }
  return { code: 404, message: '订单不存在', data: null };
});