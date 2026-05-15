import { Request, Response } from 'express';
import bannerService from '../services/banner.service';

class BannerController {
  async getBannerList(req: Request, res: Response) {
    try {
      const raw = req.query.includeDisabled;
      const v = Array.isArray(raw) ? raw[0] : raw;
      const includeDisabled =
        v === '1' || (typeof v === 'string' && v.toLowerCase() === 'true');
      const result = await bannerService.getBannerList({ includeDisabled });
      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new BannerController();