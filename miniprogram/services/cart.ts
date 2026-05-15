/**
 * 购物车相关接口服务
 */

import { get, post, put, del } from '../utils/request';
import { CartItem } from '../types/api';
import type { OrderTypeParam } from './product';

/**
 * 获取购物车列表
 * @returns Promise<CartItem[]>
 */
export function getCartList(): Promise<CartItem[]> {
  return get<CartItem[]>('/api/cart/list');
}

/**
 * 添加商品到购物车
 * @param productId 商品ID
 * @param quantity 数量
 * @param orderType 当前下单方式，传入时后端校验商品是否支持该渠道
 */
export function addToCart(
  productId: string,
  quantity = 1,
  orderType?: OrderTypeParam
): Promise<{ id: string; productId: string; quantity: number }> {
  const body: Record<string, unknown> = { productId, quantity };
  if (orderType) {
    body.order_type = orderType;
  }
  return post<{ id: string; productId: string; quantity: number }>(
    '/api/cart/add',
    body
  );
}

/**
 * 更新购物车商品数量
 * @param cartId 购物车项ID
 * @param quantity 数量
 * @param selected 是否选中
 * @returns Promise<{ id: string; quantity: number; selected: boolean }>
 */
export function updateCartItem(
  cartId: string,
  quantity: number,
  selected?: boolean
): Promise<{ id: string; quantity: number; selected: boolean }> {
  return put<{ id: string; quantity: number; selected: boolean }>(
    '/api/cart/update',
    { cartId, quantity, selected }
  );
}

/**
 * 删除购物车商品
 * @param cartId 购物车项ID
 * @returns Promise<void>
 */
export function deleteCartItem(cartId: string): Promise<void> {
  return del<void>('/api/cart/delete', { cartId });
}

/**
 * 清空购物车
 * @returns Promise<void>
 */
export function clearCart(): Promise<void> {
  return del<void>('/api/cart/clear');
}
