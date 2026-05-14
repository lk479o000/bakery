import { Request, Response } from 'express';
import cartService from '../services/cart.service';

class CartController {
  /**
   * 获取购物车列表
   * @param req 请求
   * @param res 响应
   */
  async getCartList(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await cartService.getCartList(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 添加商品到购物车
   * @param req 请求
   * @param res 响应
   */
  async addToCart(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { product_id, quantity } = req.body;

      if (!product_id) {
        res.status(400).json({ code: 400, message: '商品ID不能为空', data: null });
        return;
      }

      if (!quantity || quantity <= 0) {
        res.status(400).json({ code: 400, message: '数量必须大于0', data: null });
        return;
      }

      const result = await cartService.addToCart(userId!, product_id, quantity);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 更新购物车商品数量
   * @param req 请求
   * @param res 响应
   */
  async updateCartItem(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({ code: 400, message: '数量必须大于0', data: null });
        return;
      }

      const result = await cartService.updateCartItem(userId!, id, quantity);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 更新购物车商品选中状态
   * @param req 请求
   * @param res 响应
   */
  async updateCartItemSelected(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { selected } = req.body;

      const result = await cartService.updateCartItemSelected(userId!, id, selected);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 批量更新购物车商品选中状态
   * @param req 请求
   * @param res 响应
   */
  async updateAllCartItemsSelected(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { selected } = req.body;

      const result = await cartService.updateAllCartItemsSelected(userId!, selected);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 删除购物车商品
   * @param req 请求
   * @param res 响应
   */
  async deleteCartItem(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const result = await cartService.deleteCartItem(userId!, id);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 清空购物车
   * @param req 请求
   * @param res 响应
   */
  async clearCart(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await cartService.clearCart(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取购物车选中商品
   * @param req 请求
   * @param res 响应
   */
  async getSelectedCartItems(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await cartService.getSelectedCartItems(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new CartController();