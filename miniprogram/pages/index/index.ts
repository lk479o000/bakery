import { getBannerList } from '../../services/product';
import { login, getPhoneNumber } from '../../services/auth';
import { BRAND_INFO } from '../../utils/constants';
import { Banner } from '../../types/api';

Page({
  data: {
    bannerList: [] as Banner[],
    isLoggedIn: false,
    brandInfo: BRAND_INFO,
    loginModalVisible: false,
    loginLoading: false,
    agreementChecked: true
  },

  onLoad() {
    this.checkLoginStatus();
    this.loadBannerList();
  },

  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
    // 设置自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    this.setData({
      isLoggedIn: !!token
    });
  },

  /**
   * 加载轮播图列表
   */
  async loadBannerList() {
    try {
      const bannerList = await getBannerList();
      this.setData({ bannerList });
    } catch (error) {
      console.error('加载轮播图失败:', error);
    }
  },

  /**
   * 登录按钮点击 - 弹出登录弹窗
   */
  onLoginTap() {
    this.setData({ loginModalVisible: true });
  },

  /**
   * 关闭登录弹窗
   */
  onLoginModalClose() {
    this.setData({ loginModalVisible: false });
  },

  /**
   * 获取手机号登录
   */
  async handleGetPhoneNumber(e: any) {
    // 检查用户协议
    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    try {
      this.setData({ loginLoading: true });

      // 获取微信登录 code
      const code = await new Promise<string>((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取登录凭证失败'));
            }
          },
          fail: (err) => reject(err)
        });
      });

      // 获取手机号
      const { encryptedData, iv } = e.detail;
      if (!encryptedData || !iv) {
        throw new Error('获取手机号失败，请重试');
      }

      const phoneResponse = await getPhoneNumber(code, encryptedData, iv);

      // 调用登录接口
      const response = await login(code);

      // 保存登录信息
      wx.setStorageSync('token', response.token);
      wx.setStorageSync('userInfo', response.userInfo);

      // 关闭弹窗并更新状态
      this.setData({
        loginModalVisible: false,
        loginLoading: false,
        isLoggedIn: true
      });

      wx.showToast({ title: '登录成功' });
    } catch (error) {
      console.error('登录失败:', error);
      this.setData({ loginLoading: false });
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  },

  /**
   * 切换用户协议勾选
   */
  onAgreementToggle() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  /**
   * 查看用户协议
   */
  onViewAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    });
  },

  /**
   * 到店自提点击
   */
  onPickupTap() {
    wx.switchTab({
      url: '/pages/order/order'
    });
  },

  /**
   * 外卖配送点击
   */
  onDeliveryTap() {
    wx.switchTab({
      url: '/pages/order/order'
    });
  },

  /**
   * 领券中心点击
   */
  onCouponTap() {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    });
  },

  /**
   * 会员充值点击
   */
  onRechargeTap() {
    wx.navigateTo({
      url: '/pages/recharge/recharge'
    });
  },

  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    await this.loadBannerList();
    this.checkLoginStatus();
    wx.stopPullDownRefresh();
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '吉世面包 - 鲜活面团 每日现作',
      path: '/pages/index/index'
    };
  }
});
