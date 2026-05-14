import { Request, Response } from 'express';
import bannerService from '../services/banner.service';

class BannerController {
  async getBannerList(req: Request, res: Response) {
    try {
      const result = await bannerService.getBannerList();
      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new BannerController();