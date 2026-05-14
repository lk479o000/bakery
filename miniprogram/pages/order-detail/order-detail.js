"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../services/order");
Page({
    data: {
        loading: true,
        error: '',
        orderDetail: null,
        showPayModal: false,
        showCancelModal: false,
        selectedPayType: 'wechat',
        orderId: ''
    },
    onLoad(options) {
        const { orderId } = options;
        if (orderId) {
            this.setData({ orderId });
            this.loadOrderDetail();
        }
        else {
            this.setData({ error: '订单ID不存在', loading: false });
        }
    },
    loadOrderDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = this.data;
            if (!orderId)
                return;
            this.setData({ loading: true, error: '' });
            try {
                const orderDetail = yield (0, order_1.getOrderDetail)(orderId);
                this.setData({ orderDetail, loading: false });
            }
            catch (error) {
                console.error('加载订单详情失败:', error);
                this.setData({
                    error: error.message || '加载订单详情失败',
                    loading: false
                });
                // 检查是否未登录
                if (error.code === 401) {
                    // 跳转到登录页面
                    wx.navigateTo({
                        url: '/pages/login/login?redirect=/pages/order-detail/order-detail?orderId=' + orderId
                    });
                }
            }
        });
    },
    // 格式化时间
    formatTime(timeStr) {
        if (!timeStr)
            return '';
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 获取支付方式文本
    getPayTypeText(payType) {
        const payTypeMap = {
            'wechat': '微信支付',
            'balance': '余额支付',
            '': '未支付'
        };
        return payTypeMap[payType] || payType;
    },
    // 显示支付方式选择弹窗
    showPayModal() {
        this.setData({ showPayModal: true });
    },
    // 隐藏支付方式选择弹窗
    hidePayModal() {
        this.setData({ showPayModal: false });
    },
    // 选择支付方式
    selectPayType(e) {
        const { type } = e.currentTarget.dataset;
        this.setData({ selectedPayType: type });
    },
    // 支付订单
    payOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, selectedPayType } = this.data;
            if (!orderId)
                return;
            try {
                yield (0, order_1.payOrder)(orderId, selectedPayType);
                wx.showToast({ title: '支付成功', icon: 'success' });
                this.hidePayModal();
                // 重新加载订单详情
                this.loadOrderDetail();
            }
            catch (error) {
                console.error('支付失败:', error);
                wx.showToast({ title: error.message || '支付失败', icon: 'none' });
            }
        });
    },
    // 显示取消订单确认弹窗
    confirmCancelOrder() {
        this.setData({ showCancelModal: true });
    },
    // 隐藏取消订单确认弹窗
    hideCancelModal() {
        this.setData({ showCancelModal: false });
    },
    // 取消订单
    cancelOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = this.data;
            if (!orderId)
                return;
            try {
                yield (0, order_1.cancelOrder)(orderId);
                wx.showToast({ title: '取消订单成功', icon: 'success' });
                this.hideCancelModal();
                // 重新加载订单详情
                this.loadOrderDetail();
            }
            catch (error) {
                console.error('取消订单失败:', error);
                wx.showToast({ title: error.message || '取消订单失败', icon: 'none' });
            }
        });
    },
    // 再来一单
    rebuy() {
        const { orderDetail } = this.data;
        if (!orderDetail)
            return;
        // 将订单商品信息转换为购物车参数
        const products = orderDetail.items.map(item => ({
            productId: item.productName, // 这里简化处理，实际应该从商品信息中获取 productId
            quantity: item.quantity
        }));
        // 跳转到点单页面
        wx.navigateTo({
            url: `/pages/order/order?rebuy=true&products=${encodeURIComponent(JSON.stringify(products))}`
        });
    },
    // 返回订单列表
    navigateToOrderList() {
        wx.navigateTo({ url: '/pages/order-list/order-list' });
    }
});
