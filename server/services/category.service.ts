import { Op } from 'sequelize';

import Category from '../models/category.model';
import Product from '../models/product.model';
import { orderTypeToChannelField, type OrderType } from '../utils/order-type';

class CategoryService {
  async getCategoryList(orderType?: OrderType) {
    const where: Record<string, unknown> = { status: 1 };

    if (orderType) {
      const field = orderTypeToChannelField(orderType);
      where[field] = 1;

      const productRows = await Product.findAll({
        attributes: ['category_id'],
        where: { status: 1, [field]: 1 },
        raw: true
      });
      const categoryIds = [
        ...new Set((productRows as { category_id: string }[]).map(r => r.category_id))
      ];
      if (categoryIds.length === 0) {
        return [];
      }
      where.id = { [Op.in]: categoryIds };
    }

    const categories = await Category.findAll({
      where,
      order: [['sort', 'ASC']]
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      sort: category.sort,
      status: category.status,
      can_pickup: category.can_pickup,
      can_delivery: category.can_delivery,
      can_express: category.can_express
    }));
  }
}

export default new CategoryService();
