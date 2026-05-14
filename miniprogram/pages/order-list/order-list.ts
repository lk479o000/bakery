/**
 * 订单列表页面逻辑
 */

import { getOrderList } from '../../services/order';
import { Order, OrderListResponse } from '../../types/api';

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
    orderList: [] as Order[],
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

  onShow() {
    // 设置自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
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
    } else {
      // 已登录，加载订单数据
      this.loadOrders();
    }
  },

  /**
   * 加载订单数据
   */
  async loadOrders() {
    // 检查加载状态和是否还有更多数据
    if (this.data.loading || !this.data.hasMore) {
      return;
    }

    try {
      // 设置加载状态
      this.setData({ loading: true });

      // 调用订单列表接口
      const response: OrderListResponse = await getOrderList({
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
    } catch (error) {
      console.error('加载订单失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 切换 Tab
   */
  switchTab(e: any) {
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
  async onPullDownRefresh() {
    // 设置刷新状态
    this.setData({
      refreshing: true,
      orderList: [],
      page: 1,
      hasMore: true
    });

    // 重新加载数据
    try {
      await this.loadOrders();
    } finally {
      // 停止下拉刷新
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    }
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
  goToDetail(e: any) {
    const orderId = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?orderId=${orderId}`
    });
  },

  /**
   * 跳转到下单页
   */
  goToOrder() {
    wx.switchTab({
      url: '/pages/order/order'
    });
  }
});