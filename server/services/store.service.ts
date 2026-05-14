import Store from '../models/store.model';
import { Op } from 'sequelize';

class StoreService {
  async getStoreList(params: {
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { keyword, page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const where: any = { status: 1 };
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }

    const { rows: stores, count: total } = await Store.findAndCountAll({
      where,
      order: [['sort', 'ASC'], ['created_at', 'DESC']],
      limit: pageSize,
      offset
    });

    return {
      list: stores.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        phone: store.phone,
        business_hours: store.business_hours,
        latitude: store.latitude,
        longitude: store.longitude,
        is_open: store.is_open,
        can_delivery: store.can_delivery,
        can_pickup: store.can_pickup,
        can_express: store.can_express,
        sort: store.sort
      })),
      total,
      page,
      pageSize
    };
  }

  async getStoreDetail(storeId: string) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error('门店不存在');
    }

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      phone: store.phone,
      business_hours: store.business_hours,
      latitude: store.latitude,
      longitude: store.longitude,
      is_open: store.is_open,
      can_delivery: store.can_delivery,
      can_pickup: store.can_pickup,
      can_express: store.can_express
    };
  }

  async getNearbyStores(params: {
    latitude: number;
    longitude: number;
    radius?: number;
  }) {
    const { latitude, longitude, radius = 5000 } = params;

    const stores = await Store.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    });

    const result = stores.map(store => {
      const distance = this.calculateDistance(latitude, longitude, store.latitude, store.longitude);
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        phone: store.phone,
        business_hours: store.business_hours,
        latitude: store.latitude,
        longitude: store.longitude,
        is_open: store.is_open,
        can_delivery: store.can_delivery,
        can_pickup: store.can_pickup,
        distance: distance.toFixed(2)
      };
    }).filter(store => parseFloat(store.distance) <= radius / 1000)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return result;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default new StoreService();