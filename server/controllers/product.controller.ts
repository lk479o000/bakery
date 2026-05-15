import { Request, Response } from 'express';
import productService from '../services/product.service';
import { parseOrderType } from '../utils/order-type';

class ProductController {
  /**
   * 获取商品列表
   * @param req 请求
   * @param res 响应
   */
  async getProductList(req: Request, res: Response) {
    try {
      const { category_id, categoryId, page, pageSize, order_type, orderType } = req.query;
      const cid = (category_id ?? categoryId) as string | undefined;
      const order_type_parsed = parseOrderType(order_type ?? orderType);

      const result = await productService.getProductList({
        category_id: cid,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
        order_type: order_type_parsed
      });

      res.json({ code: 200, message: 'ok', data: result });
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

      res.json({ code: 200, message: 'ok', data: result });
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

      const order_type = parseOrderType(req.body.order_type ?? req.body.orderType);
      const result = await productService.getProductsByIds(productIds, order_type);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new ProductController();