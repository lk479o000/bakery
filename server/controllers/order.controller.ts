import { Request, Response } from 'express';
import orderService from '../services/order.service';

class OrderController {
  /**
   * 创建订单
   * @param req 请求
   * @param res 响应
   */
  async createOrder(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { type, items, total_amount, discount_amount, pay_amount, remark } = req.body;

      if (!type) {
        res.status(400).json({ code: 400, message: '订单类型不能为空', data: null });
        return;
      }

      if (!total_amount || !pay_amount) {
        res.status(400).json({ code: 400, message: '金额参数不能为空', data: null });
        return;
      }

      const result = await orderService.createOrder(userId!, {
        type,
        items,
        total_amount,
        discount_amount,
        pay_amount,
        remark
      });

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 支付订单
   * @param req 请求
   * @param res 响应
   */
  async payOrder(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { order_id, pay_type } = req.body;

      if (!order_id) {
        res.status(400).json({ code: 400, message: '订单ID不能为空', data: null });
        return;
      }

      if (!pay_type) {
        res.status(400).json({ code: 400, message: '支付方式不能为空', data: null });
        return;
      }

      const result = await orderService.payOrder(userId!, order_id, pay_type);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取订单列表
   * @param req 请求
   * @param res 响应
   */
  async getOrderList(req: Request, res: Response) {
    try {
      const { status, page, pageSize, type, orderNo } = req.query;

      const parsed = {
        status: status !== undefined && status !== '' ? parseInt(status as string, 10) : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
        type: type as string | undefined,
        orderNo: orderNo as string | undefined,
      };

      if (req.adminId) {
        const result = await orderService.listOrdersForAdmin(parsed);
        res.json({ code: 200, message: 'ok', data: result });
        return;
      }

      if (req.userId) {
        const result = await orderService.getOrderList(req.userId, {
          status: parsed.status,
          page: parsed.page,
          pageSize: parsed.pageSize,
        });
        res.json({ code: 200, message: 'ok', data: result });
        return;
      }

      res.status(401).json({ code: 401, message: '未登录或登录已过期', data: null });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取订单详情
   * @param req 请求
   * @param res 响应
   */
  async getOrderDetail(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const result = await orderService.getOrderDetail(userId!, id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 取消订单
   * @param req 请求
   * @param res 响应
   */
  async cancelOrder(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { order_id } = req.body;

      if (!order_id) {
        res.status(400).json({ code: 400, message: '订单ID不能为空', data: null });
        return;
      }

      const result = await orderService.cancelOrder(userId!, order_id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new OrderController();