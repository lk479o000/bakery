import Coupon from '../models/coupon.model';
import { Op } from 'sequelize';
import sequelize from '../config/db';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class CouponService {
  /**
   * 获取可用优惠券列表
   * @returns 优惠券列表
   */
  async getAvailableCoupons() {
    const now = new Date();

    const coupons = await Coupon.findAll({
      where: {
        status: 1,
        start_time: { [Op.lte]: now },
        end_time: { [Op.gte]: now },
        total_count: { [Op.gt]: 0 },
        received_count: { [Op.lt]: sequelize.col('total_count') }
      },
      order: [['start_time', 'ASC']]
    });

    return coupons.map(coupon => ({
      id: coupon.id,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      min_amount: coupon.min_amount,
      start_time: coupon.start_time,
      end_time: coupon.end_time,
      total_count: coupon.total_count,
      received_count: coupon.received_count,
      status: coupon.status
    }));
  }

  /**
   * 获取优惠券详情
   * @param couponId 优惠券ID
   * @returns 优惠券详情
   */
  async getCouponDetail(couponId: string) {
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('优惠券不存在');
    }

    return {
      id: coupon.id,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      min_amount: coupon.min_amount,
      start_time: coupon.start_time,
      end_time: coupon.end_time,
      total_count: coupon.total_count,
      received_count: coupon.received_count,
      status: coupon.status
    };
  }

  /**
   * 检查优惠券是否可用
   * @param couponId 优惠券ID
   * @param amount 订单金额
   * @returns 是否可用
   */
  async checkCoupon(couponId: string, amount: number) {
    const now = new Date();

    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('优惠券不存在');
    }

    if (coupon.status !== 1) {
      throw new Error('优惠券已禁用');
    }

    if (coupon.start_time > now) {
      throw new Error('优惠券尚未生效');
    }

    if (coupon.end_time < now) {
      throw new Error('优惠券已过期');
    }

    if (coupon.total_count <= coupon.received_count) {
      throw new Error('优惠券已领完');
    }

    if (amount < coupon.min_amount) {
      throw new Error(`满 ${coupon.min_amount} 元才可使用`);
    }

    return {
      available: true,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        min_amount: coupon.min_amount
      }
    };
  }

  /**
   * 计算优惠券折扣金额
   * @param couponId 优惠券ID
   * @param amount 订单金额
   * @returns 折扣金额
   */
  async calculateDiscount(couponId: string, amount: number) {
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('优惠券不存在');
    }

    let discount = 0;

    if (coupon.type === 'full_reduction') {
      // 满减券
      if (amount >= coupon.min_amount) {
        discount = coupon.value;
      }
    } else if (coupon.type === 'discount') {
      // 折扣券
      if (amount >= coupon.min_amount) {
        discount = amount * (1 - coupon.value);
      }
    }

    // 折扣金额不能超过订单金额
    discount = Math.min(discount, amount);

    return { discount: parseFloat(discount.toFixed(2)) };
  }

  /**
   * 后台管理：优惠券分页列表（camelCase）
   */
  async listCouponsForAdmin(params: { status?: number; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (status !== undefined && !Number.isNaN(status)) {
      where.status = status;
    }

    const { rows, count: total } = await Coupon.findAndCountAll({
      where,
      order: [['start_time', 'DESC']],
      limit: pageSize,
      offset,
    });

    const fmt = (d: Date) => {
      const x = new Date(d);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())} ${pad(x.getHours())}:${pad(x.getMinutes())}:${pad(x.getSeconds())}`;
    };

    return {
      list: rows.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        value: Number(c.value),
        minAmount: Number(c.min_amount),
        startTime: fmt(c.start_time),
        endTime: fmt(c.end_time),
        totalCount: c.total_count,
        receivedCount: c.received_count,
        status: c.status,
      })),
      total,
    };
  }
}

export default new CouponService();