import Order from '../models/order.model';
import OrderItem from '../models/orderItem.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import BalanceRecord from '../models/balance.model';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 生成订单编号
function generateOrderNo(): string {
  return 'ORD' + Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

class OrderService {
  /**
   * 创建订单
   * @param userId 用户ID
   * @param orderData 订单数据
   * @returns 订单信息
   */
  async createOrder(userId: string, orderData: {
    type: 'store' | 'recharge' | 'payment' | 'coupon';
    items?: Array<{
      product_id: string;
      quantity: number;
    }>;
    total_amount: number;
    discount_amount: number;
    pay_amount: number;
    remark?: string;
  }) {
    // 开始事务
    const transaction = await Order.sequelize!.transaction();

    try {
      // 创建订单
      const order = await Order.create(
        {
          id: generateId(),
          user_id: userId,
          order_no: generateOrderNo(),
          type: orderData.type,
          status: 0, // 待支付
          total_amount: orderData.total_amount,
          discount_amount: orderData.discount_amount,
          pay_amount: orderData.pay_amount,
          remark: orderData.remark
        },
        { transaction }
      );

      // 如果是门店订单，创建订单商品
      if (orderData.items && orderData.items.length > 0) {
        for (const item of orderData.items) {
          // 获取商品信息
          const product = await Product.findByPk(item.product_id, { transaction });
          if (!product) {
            throw new Error(`商品 ${item.product_id} 不存在`);
          }

          // 检查库存
          if (product.stock < item.quantity) {
            throw new Error(`商品 ${product.name} 库存不足`);
          }

          // 扣减库存
          await product.update({ stock: product.stock - item.quantity }, { transaction });

          // 创建订单商品
          await OrderItem.create(
            {
              id: generateId(),
              order_id: order.id,
              product_id: item.product_id,
              product_name: product.name,
              product_image: product.image,
              price: product.price,
              quantity: item.quantity
            },
            { transaction }
          );
        }
      }

      // 提交事务
      await transaction.commit();

      return {
        id: order.id,
        order_no: order.order_no,
        type: order.type,
        status: order.status,
        total_amount: order.total_amount,
        discount_amount: order.discount_amount,
        pay_amount: order.pay_amount,
        remark: order.remark,
        create_time: order.create_time
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 支付订单
   * @param userId 用户ID
   * @param orderId 订单ID
   * @param payType 支付方式
   * @returns 支付结果
   */
  async payOrder(userId: string, orderId: string, payType: 'wechat' | 'balance') {
    // 开始事务
    const transaction = await Order.sequelize!.transaction();

    try {
      // 获取订单
      const order = await Order.findByPk(orderId, { transaction });
      if (!order) {
        throw new Error('订单不存在');
      }

      if (order.user_id !== userId) {
        throw new Error('无权操作此订单');
      }

      if (order.status !== 0) {
        throw new Error('订单状态不正确');
      }

      // 如果是余额支付，检查余额
      if (payType === 'balance') {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
          throw new Error('用户不存在');
        }

        if (user.balance < order.pay_amount) {
          throw new Error('余额不足');
        }

        // 扣减余额
        await user.update({ balance: user.balance - order.pay_amount }, { transaction });

        // 记录余额变动
        await BalanceRecord.create(
          {
            id: generateId(),
            user_id: userId,
            type: 'consume',
            amount: -order.pay_amount,
            balance: user.balance - order.pay_amount,
            remark: `订单支付: ${order.order_no}`
          },
          { transaction }
        );
      }

      // 更新订单状态
      await order.update(
        {
          status: 1, // 已支付
          pay_type: payType,
          pay_time: new Date()
        },
        { transaction }
      );

      // 提交事务
      await transaction.commit();

      return {
        order_id: order.id,
        order_no: order.order_no,
        status: 1,
        pay_type: payType,
        pay_time: new Date()
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取订单列表
   * @param userId 用户ID
   * @param params 查询参数
   * @returns 订单列表
   */
  async getOrderList(userId: string, params: {
    status?: number;
    page?: number;
    pageSize?: number;
  }) {
    const { status, page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const where: any = { user_id: userId };
    if (status !== undefined) {
      where.status = status;
    }

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      order: [['create_time', 'DESC']],
      limit: pageSize,
      offset
    });

    return {
      list: orders.map(order => ({
        id: order.id,
        order_no: order.order_no,
        type: order.type,
        status: order.status,
        total_amount: order.total_amount,
        discount_amount: order.discount_amount,
        pay_amount: order.pay_amount,
        pay_type: order.pay_type,
        remark: order.remark,
        create_time: order.create_time,
        pay_time: order.pay_time
      })),
      total,
      page,
      pageSize
    };
  }

  /**
   * 获取订单详情
   * @param userId 用户ID
   * @param orderId 订单ID
   * @returns 订单详情
   */
  async getOrderDetail(userId: string, orderId: string) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.user_id !== userId) {
      throw new Error('无权查看此订单');
    }

    // 获取订单商品
    const items = await OrderItem.findAll({ where: { order_id: orderId } });

    return {
      id: order.id,
      order_no: order.order_no,
      type: order.type,
      status: order.status,
      total_amount: order.total_amount,
      discount_amount: order.discount_amount,
      pay_amount: order.pay_amount,
      pay_type: order.pay_type,
      remark: order.remark,
      create_time: order.create_time,
      pay_time: order.pay_time,
      items: items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: item.quantity
      }))
    };
  }

  /**
   * 取消订单
   * @param userId 用户ID
   * @param orderId 订单ID
   * @returns 取消结果
   */
  async cancelOrder(userId: string, orderId: string) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.user_id !== userId) {
      throw new Error('无权操作此订单');
    }

    if (order.status !== 0) {
      throw new Error('订单状态不正确');
    }

    await order.update({ status: 5 }); // 已取消

    return {
      order_id: order.id,
      status: 5
    };
  }
}

export default new OrderService();