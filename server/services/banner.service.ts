import Banner from '../models/banner.model';

class BannerService {
  /** 小程序端不传 includeDisabled，仅返回启用项；管理端传 includeDisabled=1 可查全部 */
  async getBannerList(options?: { includeDisabled?: boolean }) {
    const where = options?.includeDisabled ? {} : { status: 1 };

    const banners = await Banner.findAll({
      where,
      order: [['sort', 'ASC']],
    });

    return banners.map((banner) => ({
      id: banner.id,
      image: banner.image,
      link: banner.link,
      sort: banner.sort,
      status: banner.status,
    }));
  }
}

export default new BannerService();