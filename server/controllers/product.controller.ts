import { Request, Response } from 'express';
import productService from '../services/product.service';

class ProductController {
  /**
   * 获取商品列表
   * @param req 请求
   * @param res 响应
   */
  async getProductList(req: Request, res: Response) {
    try {
      const { category_id, page, pageSize } = req.query;

      const result = await productService.getProductList({
        category_id: category_id as string,
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 20
      });

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取商品详情
   * @param req 请求
   * @param res 响应
   */
  async getProductDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await productService.getProductDetail(id);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 批量获取商品信息
   * @param req 请求
   * @param res 响应
   */
  async getProductsByIds(req: Request, res: Response) {
    try {
      const { productIds } = req.body;

      if (!productIds || !Array.isArray(productIds)) {
        res.status(400).json({ code: 400, message: 'productIds 必须是数组', data: null });
        return;
      }

      const result = await productService.getProductsByIds(productIds);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new ProductController();