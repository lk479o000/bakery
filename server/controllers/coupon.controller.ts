import { Request, Response } from 'express';
import couponService from '../services/coupon.service';

class CouponController {
  /**
   * 获取可用优惠券列表
   * @param req 请求
   * @param res 响应
   */
  async getAvailableCoupons(req: Request, res: Response) {
    try {
      const result = await couponService.getAvailableCoupons();

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取优惠券详情
   * @param req 请求
   * @param res 响应
   */
  async getCouponDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await couponService.getCouponDetail(id);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 检查优惠券是否可用
   * @param req 请求
   * @param res 响应
   */
  async checkCoupon(req: Request, res: Response) {
    try {
      const { coupon_id, amount } = req.body;

      if (!coupon_id) {
        res.status(400).json({ code: 400, message: '优惠券ID不能为空', data: null });
        return;
      }

      if (!amount || amount <= 0) {
        res.status(400).json({ code: 400, message: '金额必须大于0', data: null });
        return;
      }

      const result = await couponService.checkCoupon(coupon_id, amount);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 计算优惠券折扣金额
   * @param req 请求
   * @param res 响应
   */
  async calculateDiscount(req: Request, res: Response) {
    try {
      const { coupon_id, amount } = req.body;

      if (!coupon_id) {
        res.status(400).json({ code: 400, message: '优惠券ID不能为空', data: null });
        return;
      }

      if (!amount || amount <= 0) {
        res.status(400).json({ code: 400, message: '金额必须大于0', data: null });
        return;
      }

      const result = await couponService.calculateDiscount(coupon_id, amount);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new CouponController();