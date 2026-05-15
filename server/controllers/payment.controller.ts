import { Request, Response } from 'express';
import paymentService from '../services/payment.service';

class PaymentController {
  async createPayment(req: Request, res: Response) {
    try {
      const { orderId, payType } = req.body;

      if (!orderId || !payType) {
        res.status(400).json({ code: 400, message: '缺少参数', data: null });
        return;
      }

      const result = await paymentService.createPayment(orderId, payType as 'wechat' | 'balance');
      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  async queryPayment(req: Request, res: Response) {
    try {
      const { orderId } = req.query;

      if (!orderId) {
        res.status(400).json({ code: 400, message: '缺少订单ID', data: null });
        return;
      }

      const result = await paymentService.queryPayment(orderId as string);
      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  async paymentCallback(req: Request, res: Response) {
    try {
      const { orderId, result } = req.body;

      if (!orderId || !result) {
        res.status(400).json({ code: 400, message: '缺少参数', data: null });
        return;
      }

      const response = await paymentService.paymentCallback(orderId, result);
      res.json({ code: 200, message: 'ok', data: response });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new PaymentController();