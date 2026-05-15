import { Request, Response } from 'express';
import addressService from '../services/address.service';

class AddressController {
  /**
   * 获取用户地址列表
   * @param req 请求
   * @param res 响应
   */
  async getAddressList(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await addressService.getAddressList(userId!);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取默认地址
   * @param req 请求
   * @param res 响应
   */
  async getDefaultAddress(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await addressService.getDefaultAddress(userId!);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取地址详情
   * @param req 请求
   * @param res 响应
   */
  async getAddressDetail(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const result = await addressService.getAddressDetail(userId!, id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 创建地址
   * @param req 请求
   * @param res 响应
   */
  async createAddress(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { name, phone, province, city, district, detail, is_default } = req.body;

      if (!name || !phone || !province || !city || !district || !detail) {
        res.status(400).json({ code: 400, message: '地址信息不能为空', data: null });
        return;
      }

      const result = await addressService.createAddress(userId!, {
        name,
        phone,
        province,
        city,
        district,
        detail,
        is_default: is_default || 0
      });

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 更新地址
   * @param req 请求
   * @param res 响应
   */
  async updateAddress(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { name, phone, province, city, district, detail, is_default } = req.body;

      const result = await addressService.updateAddress(userId!, id, {
        name,
        phone,
        province,
        city,
        district,
        detail,
        is_default
      });

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 删除地址
   * @param req 请求
   * @param res 响应
   */
  async deleteAddress(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const result = await addressService.deleteAddress(userId!, id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 设置默认地址
   * @param req 请求
   * @param res 响应
   */
  async setDefaultAddress(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ code: 400, message: '地址ID不能为空', data: null });
        return;
      }

      const result = await addressService.setDefaultAddress(userId!, id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new AddressController();