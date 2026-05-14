import { Request, Response } from 'express';
import categoryService from '../services/category.service';

class CategoryController {
  async getCategoryList(req: Request, res: Response) {
    try {
      const result = await categoryService.getCategoryList();
      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new CategoryController();