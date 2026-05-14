"use strict";
/**
 * 订单相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.payOrder = payOrder;
exports.getOrderList = getOrderList;
exports.getOrderDetail = getOrderDetail;
exports.cancelOrder = cancelOrder;
const request_1 = require("../utils/request");
/**
 * 创建订单
 * @param params 订单参数
 * @returns Promise<CreateOrderResponse>
 */
function createOrder(params) {
    return (0, request_1.post)('/api/order/create', params);
}
/**
 * 支付订单
 * @param orderId 订单ID
 * @param payType 支付方式：wechat-微信支付，balance-余额支付
 * @returns Promise<{ payParams?: PayParams }>
 */
function payOrder(orderId, payType) {
    return (0, request_1.post)('/api/order/pay', {
        orderId,
        payType
    });
}
/**
 * 获取订单列表
 * @param params 查询参数
 * @returns Promise<OrderListResponse>
 */
function getOrderList(params) {
    return (0, request_1.get)('/api/order/list', params);
}
/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns Promise<OrderDetail>
 */
function getOrderDetail(orderId) {
    return (0, request_1.get)('/api/order/detail', { orderId });
}
/**
 * 取消订单
 * @param orderId 订单ID
 * @returns Promise<void>
 */
function cancelOrder(orderId) {
    return (0, request_1.put)('/api/order/cancel', { orderId });
}
