import { Request, Response } from 'express';
import balanceService from '../services/balance.service';

class BalanceController {
  /**
   * 充值余额
   * @param req 请求
   * @param res 响应
   */
  async recharge(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { amount, remark } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ code: 400, message: '充值金额必须大于0', data: null });
        return;
      }

      const result = await balanceService.recharge(userId!, amount, remark);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 消费余额
   * @param req 请求
   * @param res 响应
   */
  async consume(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { amount, remark } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ code: 400, message: '消费金额必须大于0', data: null });
        return;
      }

      const result = await balanceService.consume(userId!, amount, remark);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 退款
   * @param req 请求
   * @param res 响应
   */
  async refund(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { amount, remark } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ code: 400, message: '退款金额必须大于0', data: null });
        return;
      }

      const result = await balanceService.refund(userId!, amount, remark);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取余额记录
   * @param req 请求
   * @param res 响应
   */
  async getBalanceRecords(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { type, page, pageSize } = req.query;

      const result = await balanceService.getBalanceRecords(userId!, {
        type: type as 'recharge' | 'consume' | 'refund',
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 20
      });

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取用户余额
   * @param req 请求
   * @param res 响应
   */
  async getBalance(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await balanceService.getBalance(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new BalanceController();