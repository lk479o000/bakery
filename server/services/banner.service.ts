import Banner from '../models/banner.model';

class BannerService {
  async getBannerList() {
    const banners = await Banner.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    });

    return banners.map(banner => ({
      id: banner.id,
      image: banner.image,
      link: banner.link,
      sort: banner.sort
    }));
  }
}

export default new BannerService();