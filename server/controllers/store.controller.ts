import { Request, Response } from 'express';
import storeService from '../services/store.service';

class StoreController {
  async getStoreList(req: Request, res: Response) {
    try {
      const { keyword, page, pageSize } = req.query;

      const result = await storeService.getStoreList({
        keyword: keyword as string,
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 20
      });

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  async getStoreDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await storeService.getStoreDetail(id);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  async getNearbyStores(req: Request, res: Response) {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({ code: 400, message: '缺少经纬度参数', data: null });
        return;
      }

      const result = await storeService.getNearbyStores({
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        radius: radius ? parseInt(radius as string) : 5000
      });

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new StoreController();