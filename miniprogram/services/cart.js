"use strict";
/**
 * 购物车相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartList = getCartList;
exports.addToCart = addToCart;
exports.updateCartItem = updateCartItem;
exports.deleteCartItem = deleteCartItem;
exports.clearCart = clearCart;
const request_1 = require("../utils/request");
/**
 * 获取购物车列表
 * @returns Promise<CartItem[]>
 */
function getCartList() {
    return (0, request_1.get)('/api/cart/list');
}
/**
 * 添加商品到购物车
 * @param productId 商品ID
 * @param quantity 数量
 * @param orderType 当前下单方式（可选）
 */
function addToCart(productId, quantity = 1, orderType) {
    const body = { productId, quantity };
    if (orderType) {
        body.order_type = orderType;
    }
    return (0, request_1.post)('/api/cart/add', body);
}
/**
 * 更新购物车商品数量
 * @param cartId 购物车项ID
 * @param quantity 数量
 * @param selected 是否选中
 * @returns Promise<{ id: string; quantity: number; selected: boolean }>
 */
function updateCartItem(cartId, quantity, selected) {
    return (0, request_1.put)('/api/cart/update', { cartId, quantity, selected });
}
/**
 * 删除购物车商品
 * @param cartId 购物车项ID
 * @returns Promise<void>
 */
function deleteCartItem(cartId) {
    return (0, request_1.del)('/api/cart/delete', { cartId });
}
/**
 * 清空购物车
 * @returns Promise<void>
 */
function clearCart() {
    return (0, request_1.del)('/api/cart/clear');
}
