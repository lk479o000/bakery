/**
 * 购物车相关接口服务
 */

import { get, post, put, del } from '../utils/request';
import { CartItem } from '../types/api';

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
 * @returns Promise<{ id: string; productId: string; quantity: number }>
 */
export function addToCart(
  productId: string,
  quantity = 1
): Promise<{ id: string; productId: string; quantity: number }> {
  return post<{ id: string; productId: string; quantity: number }>(
    '/api/cart/add',
    { productId, quantity }
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
