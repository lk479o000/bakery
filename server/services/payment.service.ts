import Order from '../models/order.model';
import BalanceRecord from '../models/balance.model';
import User from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

class PaymentService {
  async createPayment(orderId: string, payType: 'wechat' | 'balance') {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 0) {
      throw new Error('订单状态不允许支付');
    }

    if (payType === 'balance') {
      const user = await User.findByPk(order.user_id);
      if (!user) {
        throw new Error('用户不存在');
      }

      if (user.balance < order.pay_amount) {
        throw new Error('余额不足');
      }

      await user.update({ balance: user.balance - order.pay_amount });

      await BalanceRecord.create({
        id: uuidv4().replace(/-/g, ''),
        user_id: order.user_id,
        type: 'consume',
        amount: -order.pay_amount,
        balance: user.balance - order.pay_amount,
        remark: `订单支付：${order.order_no}`
      });

      await order.update({ status: 1, pay_type: 'balance', pay_time: new Date() });

      return {
        success: true,
        orderId,
        orderNo: order.order_no,
        payType: 'balance',
        message: '余额支付成功'
      };
    } else {
      await order.update({ pay_type: 'wechat' });

      return {
        success: true,
        orderId,
        orderNo: order.order_no,
        payType: 'wechat',
        message: '请使用微信支付',
        payParams: {
          timeStamp: Date.now().toString(),
          nonceStr: uuidv4().replace(/-/g, '').slice(0, 32),
          package: `prepay_id=mock_prepay_id_${orderId}`,
          signType: 'MD5',
          paySign: 'mock_pay_sign'
        }
      };
    }
  }

  async queryPayment(orderId: string) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    return {
      orderId: order.id,
      orderNo: order.order_no,
      status: order.status,
      statusText: this.getStatusText(order.status),
      payType: order.pay_type,
      createTime: order.create_time,
      payTime: order.pay_time
    };
  }

  async paymentCallback(orderId: string, result: string) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    if (result === 'success') {
      await order.update({ status: 1, pay_time: new Date() });
    } else {
      await order.update({ status: 5 });
    }

    return { success: true };
  }

  private getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      0: '待支付',
      1: '已支付',
      2: '制作中',
      3: '待取餐',
      4: '已完成',
      5: '已取消'
    };
    return statusMap[status] || '未知状态';
  }
}

export default new PaymentService();