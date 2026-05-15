import Cart from '../models/cart.model';
import Product from '../models/product.model';
import { parseOrderType } from '../utils/order-type';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class CartService {
  /**
   * 获取购物车列表
   * @param userId 用户ID
   * @returns 购物车列表
   */
  async getCartList(userId: string) {
    const cartItems = await Cart.findAll({ where: { user_id: userId } });

    // 获取商品信息
    const productIds = cartItems.map(item => item.product_id);
    const products = await Product.findAll({ where: { id: productIds } });
    const productMap = new Map(products.map(p => [p.id, p]));

    return cartItems.map(item => {
      const product = productMap.get(item.product_id);
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        selected: item.selected,
        created_at: item.created_at,
        product: product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.original_price,
          image: product.image,
          stock: product.stock
        } : null
      };
    });
  }

  /**
   * 添加商品到购物车
   * @param userId 用户ID
   * @param productId 商品ID
   * @param quantity 数量
   * @returns 购物车项
   */
  async addToCart(userId: string, productId: string, quantity: number, order_type_raw?: unknown) {
    // 检查商品是否存在
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    const order_type = parseOrderType(order_type_raw);
    if (order_type) {
      const flags = {
        pickup: product.can_pickup,
        delivery: product.can_delivery,
        express: product.can_express
      };
      if (Number(flags[order_type]) !== 1) {
        throw new Error('该商品不支持当前下单方式');
      }
    }

    if (product.status !== 1) {
      throw new Error('商品已下架');
    }

    if (product.stock < quantity) {
      throw new Error('库存不足');
    }

    // 查找购物车中是否已有该商品
    let cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

    if (cartItem) {
      // 更新数量
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error('库存不足');
      }
      await cartItem.update({ quantity: newQuantity });
    } else {
      // 创建新购物车项
      cartItem = await Cart.create({
        id: generateId(),
        user_id: userId,
        product_id: productId,
        quantity,
        selected: 1
      });
    }

    return {
      id: cartItem.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      selected: cartItem.selected,
      created_at: cartItem.created_at
    };
  }

  /**
   * 更新购物车商品数量
   * @param userId 用户ID
   * @param cartId 购物车项ID
   * @param quantity 数量
   * @returns 更新后的购物车项
   */
  async updateCartItem(userId: string, cartId: string, quantity: number) {
    const cartItem = await Cart.findOne({ where: { id: cartId, user_id: userId } });
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }

    // 检查商品库存
    const product = await Product.findByPk(cartItem.product_id);
    if (!product) {
      throw new Error('商品不存在');
    }

    if (quantity > product.stock) {
      throw new Error('库存不足');
    }

    await cartItem.update({ quantity });

    return {
      id: cartItem.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      selected: cartItem.selected
    };
  }

  /**
   * 更新购物车商品选中状态
   * @param userId 用户ID
   * @param cartId 购物车项ID
   * @param selected 是否选中
   * @returns 更新后的购物车项
   */
  async updateCartItemSelected(userId: string, cartId: string, selected: number) {
    const cartItem = await Cart.findOne({ where: { id: cartId, user_id: userId } });
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }

    await cartItem.update({ selected });

    return {
      id: cartItem.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      selected: cartItem.selected
    };
  }

  /**
   * 批量更新购物车商品选中状态
   * @param userId 用户ID
   * @param selected 是否选中
   * @returns 更新结果
   */
  async updateAllCartItemsSelected(userId: string, selected: number) {
    await Cart.update({ selected }, { where: { user_id: userId } });

    return { success: true };
  }

  /**
   * 删除购物车商品
   * @param userId 用户ID
   * @param cartId 购物车项ID
   * @returns 删除结果
   */
  async deleteCartItem(userId: string, cartId: string) {
    const cartItem = await Cart.findOne({ where: { id: cartId, user_id: userId } });
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }

    await cartItem.destroy();

    return { success: true };
  }

  /**
   * 清空购物车
   * @param userId 用户ID
   * @returns 清空结果
   */
  async clearCart(userId: string) {
    await Cart.destroy({ where: { user_id: userId } });

    return { success: true };
  }

  /**
   * 获取购物车选中商品
   * @param userId 用户ID
   * @returns 选中的商品列表
   */
  async getSelectedCartItems(userId: string) {
    const cartItems = await Cart.findAll({ where: { user_id: userId, selected: 1 } });

    // 获取商品信息
    const productIds = cartItems.map(item => item.product_id);
    const products = await Product.findAll({ where: { id: productIds } });
    const productMap = new Map(products.map(p => [p.id, p]));

    return cartItems.map(item => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new Error(`商品 ${item.product_id} 不存在`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`商品 ${product.name} 库存不足`);
      }

      return {
        cart_id: item.id,
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
        quantity: item.quantity,
        total_price: product.price * item.quantity
      };
    });
  }
}

export default new CartService();