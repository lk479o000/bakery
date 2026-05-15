import Product from '../models/product.model';
import { orderTypeToChannelField, type OrderType } from '../utils/order-type';

function mapProduct(product: Product) {
  return {
    id: product.id,
    category_id: product.category_id,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.original_price,
    image: product.image,
    stock: product.stock,
    status: product.status,
    can_pickup: product.can_pickup,
    can_delivery: product.can_delivery,
    can_express: product.can_express,
    sort: product.sort,
    created_at: product.created_at
  };
}

class ProductService {
  /**
   * 获取商品列表
   * @param params 查询参数
   * @returns 商品列表
   */
  async getProductList(params: {
    category_id?: string;
    page?: number;
    pageSize?: number;
    order_type?: OrderType;
  }) {
    const { category_id, page = 1, pageSize = 20, order_type } = params;
    const offset = (page - 1) * pageSize;

    const where: Record<string, unknown> = { status: 1 };
    if (category_id) {
      where.category_id = category_id;
    }
    if (order_type) {
      const field = orderTypeToChannelField(order_type);
      where[field] = 1;
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      order: [['sort', 'ASC'], ['created_at', 'DESC']],
      limit: pageSize,
      offset
    });

    return {
      list: products.map(p => mapProduct(p)),
      total,
      page,
      pageSize
    };
  }

  /**
   * 获取商品详情
   * @param productId 商品ID
   * @returns 商品详情
   */
  async getProductDetail(productId: string) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    return mapProduct(product);
  }

  /**
   * 批量获取商品信息
   * @param productIds 商品ID列表
   * @returns 商品列表
   */
  async getProductsByIds(productIds: string[], order_type?: OrderType) {
    const where: Record<string, unknown> = {
      id: productIds,
      status: 1
    };
    if (order_type) {
      const field = orderTypeToChannelField(order_type);
      where[field] = 1;
    }

    const products = await Product.findAll({ where });

    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      can_pickup: product.can_pickup,
      can_delivery: product.can_delivery,
      can_express: product.can_express
    }));
  }

  /**
   * 检查商品库存
   * @param productId 商品ID
   * @param quantity 数量
   * @returns 是否有足够库存
   */
  async checkStock(productId: string, quantity: number) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    if (product.stock < quantity) {
      throw new Error('库存不足');
    }

    return true;
  }

  /**
   * 扣减商品库存
   * @param productId 商品ID
   * @param quantity 数量
   * @returns 更新后的库存
   */
  async deductStock(productId: string, quantity: number) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    if (product.stock < quantity) {
      throw new Error('库存不足');
    }

    const newStock = product.stock - quantity;
    await product.update({ stock: newStock });

    return { stock: newStock };
  }
}

export default new ProductService();
