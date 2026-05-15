import { Request, Response } from 'express';
import categoryService from '../services/category.service';
import { parseOrderType } from '../utils/order-type';

class CategoryController {
  async getCategoryList(req: Request, res: Response) {
    try {
      const { order_type, orderType } = req.query;
      const order_type_parsed = parseOrderType(order_type ?? orderType);
      const result = await categoryService.getCategoryList(order_type_parsed);
      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new CategoryController();