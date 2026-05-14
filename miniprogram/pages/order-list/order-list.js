"use strict";
/**
 * 订单列表页面逻辑
 */
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
// 订单类型
const ORDER_TYPES = [
    { key: 'store', name: '门店订单' },
    { key: 'recharge', name: '储值订单' },
    { key: 'pay', name: '买单订单' },
    { key: 'coupon', name: '券包订单' }
];
Page({
    data: {
        // Tab 列表
        tabList: ORDER_TYPES,
        // 当前选中的 Tab
        currentTab: 'store',
        // 订单列表
        orderList: [],
        // 分页参数
        page: 1,
        pageSize: 10,
        // 是否还有更多数据
        hasMore: true,
        // 加载状态
        loading: false,
        // 刷新状态
        refreshing: false
    },
    onLoad() {
        // 页面加载时检查登录状态并加载数据
        this.checkLogin();
    },
    /**
     * 检查登录状态
     */
    checkLogin() {
        const token = wx.getStorageSync('token');
        if (!token) {
            // 未登录，跳转到登录页
            wx.navigateTo({
                url: '/pages/login/login'
            });
        }
        else {
            // 已登录，加载订单数据
            this.loadOrders();
        }
    },
    /**
     * 加载订单数据
     */
    loadOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            // 检查加载状态和是否还有更多数据
            if (this.data.loading || !this.data.hasMore) {
                return;
            }
            try {
                // 设置加载状态
                this.setData({ loading: true });
                // 调用订单列表接口
                const response = yield (0, order_1.getOrderList)({
                    type: this.data.currentTab,
                    page: this.data.page,
                    pageSize: this.data.pageSize
                });
                // 处理返回数据
                const newOrders = response.list;
                const updatedOrderList = this.data.page === 1
                    ? newOrders
                    : [...this.data.orderList, ...newOrders];
                // 更新数据
                this.setData({
                    orderList: updatedOrderList,
                    hasMore: newOrders.length >= this.data.pageSize,
                    page: this.data.page + 1,
                    loading: false
                });
            }
            catch (error) {
                console.error('加载订单失败:', error);
                wx.showToast({
                    title: '加载失败，请重试',
                    icon: 'none'
                });
                this.setData({ loading: false });
            }
        });
    },
    /**
     * 切换 Tab
     */
    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        if (tab === this.data.currentTab) {
            return;
        }
        // 重置数据并切换 Tab
        this.setData({
            currentTab: tab,
            orderList: [],
            page: 1,
            hasMore: true
        });
        // 重新加载数据
        this.loadOrders();
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            // 设置刷新状态
            this.setData({
                refreshing: true,
                orderList: [],
                page: 1,
                hasMore: true
            });
            // 重新加载数据
            try {
                yield this.loadOrders();
            }
            finally {
                // 停止下拉刷新
                this.setData({ refreshing: false });
                wx.stopPullDownRefresh();
            }
        });
    },
    /**
     * 上拉加载更多
     */
    onReachBottom() {
        // 加载下一页数据
        this.loadOrders();
    },
    /**
     * 跳转到订单详情页
     */
    goToDetail(e) {
        const orderId = e.currentTarget.dataset.orderId;
        wx.navigateTo({
            url: `/pages/order-detail/order-detail?orderId=${orderId}`
        });
    },
    /**
     * 跳转到下单页
     */
    goToOrder() {
        wx.navigateTo({
            url: '/pages/order/order'
        });
    }
});
