import { getMyCouponList } from '../../services/coupon';
import { UserCoupon } from '../../types/api';

Page({
  data: {
    currentStatus: 0 as number,
    loading: false as boolean,
    empty: false as boolean,
    isLoggedIn: false as boolean,
    couponList: [] as UserCoupon[],
    statusOptions: [
      { value: 0, label: '未使用' },
      { value: 1, label: '已使用' },
      { value: 2, label: '已过期' }
    ] as Array<{ value: number; label: string }>
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const isLoggedIn = !!token;
    this.setData({ isLoggedIn });
    
    if (isLoggedIn) {
      this.loadCouponList(this.data.currentStatus);
    }
  },

  /**
   * 加载优惠券列表
   * @param status 状态：0-未使用，1-已使用，2-已过期
   */
  async loadCouponList(status: number = 0) {
    try {
      this.setData({ loading: true, empty: false });
      
      const response = await getMyCouponList(status);
      
      this.setData({
        couponList: response,
        loading: false,
        empty: response.length === 0
      });
    } catch (error) {
      console.error('加载优惠券列表失败:', error);
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 处理状态切换
   * @param e 事件对象
   */
  handleStatusChange(e: any) {
    const status = e.currentTarget.dataset.status;
    this.setData({ currentStatus: status });
    this.loadCouponList(status);
  },

  /**
   * 处理使用优惠券
   * @param e 事件对象
   */
  handleUseCoupon(e: any) {
    const couponId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/order?couponId=${couponId}`
    });
  },

  /**
   * 处理去领券
   */
  handleGoReceive() {
    wx.navigateTo({
      url: '/pages/coupon-center/coupon-center'
    });
  },

  /**
   * 处理去登录
   */
  handleGoLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});