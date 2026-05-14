import { getUserInfo } from '../../services/user';
import { login, getPhoneNumber } from '../../services/auth';
import { MORE_FUNCTIONS, RECHARGE_PACKAGES } from '../../utils/constants';
import { formatAmount } from '../../utils/util';

Page({
  data: {
    // 用户信息
    userInfo: null as any,
    isLoggedIn: false,
    loading: false,
    randomId: '',

    // 资产数据
    points: '--',
    couponCount: 0,
    balance: 0,
    balanceText: '0.00',

    // 更多功能
    moreFunctions: MORE_FUNCTIONS,

    // 充值套餐
    rechargePackages: RECHARGE_PACKAGES,

    // 页面状态
    showLogoutModal: false,

    // 登录弹窗
    loginModalVisible: false,
    loginLoading: false,
    agreementChecked: true
  },

  onLoad() {
    const randomId = Math.floor(Math.random() * 900000 + 100000);
    this.setData({ randomId: String(randomId) });
  },

  onShow() {
    this.checkLoginStatus();
    // 设置自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const isLoggedIn = !!token;
    this.setData({ isLoggedIn });

    if (isLoggedIn) {
      this.loadUserInfo();
    }
  },

  async loadUserInfo() {
    try {
      this.setData({ loading: true });
      const userInfo = await getUserInfo();
      this.setData({
        userInfo,
        isLoggedIn: true,
        balance: userInfo.balance || 0,
        balanceText: formatAmount(userInfo.balance || 0),
        points: String(userInfo.points || 0),
        couponCount: (userInfo as any).couponCount || 0
      });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  handleLogin() {
    this.setData({ loginModalVisible: true });
  },

  onLoginModalClose() {
    this.setData({ loginModalVisible: false });
  },

  async handleGetPhoneNumber(e: any) {
    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    try {
      this.setData({ loginLoading: true });

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

      const { encryptedData, iv } = e.detail;
      if (!encryptedData || !iv) {
        throw new Error('获取手机号失败，请重试');
      }

      const phoneResponse = await getPhoneNumber(code, encryptedData, iv);
      const response = await login(code);

      wx.setStorageSync('token', response.token);
      wx.setStorageSync('userInfo', response.userInfo);

      this.setData({
        loginModalVisible: false,
        loginLoading: false,
        isLoggedIn: true
      });

      await this.loadUserInfo();
      wx.showToast({ title: '登录成功' });
    } catch (error) {
      console.error('登录失败:', error);
      this.setData({ loginLoading: false });
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  },

  onAgreementToggle() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  onViewAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    });
    this.setData({ loginModalVisible: false });
  },

  // 导航方法
  navigateToOrderList() {
    wx.switchTab({ url: '/pages/order-list/order-list' });
  },

  navigateToAddress() {
    if (!this.checkAuth()) return;
    wx.navigateTo({ url: '/pages/address/address' });
  },

  navigateToService() {
    wx.navigateTo({ url: '/pages/service/service' });
  },

  navigateToAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  navigateToMyCoupon() {
    if (!this.checkAuth()) return;
    wx.navigateTo({ url: '/pages/my-coupon/my-coupon' });
  },

  navigateToBalance() {
    if (!this.checkAuth()) return;
    wx.navigateTo({ url: '/pages/balance-record/balance-record' });
  },

  navigateToPoints() {
    if (!this.checkAuth()) return;
    wx.showToast({ title: '积分功能开发中', icon: 'none' });
  },

  navigateToRecharge() {
    if (!this.checkAuth()) return;
    wx.navigateTo({ url: '/pages/recharge/recharge' });
  },

  navigateToStoreList() {
    wx.navigateTo({ url: '/pages/store-list/store-list' });
  },

  onMoreFunctionTap(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key as string;
    if (!this.checkAuth()) return;

    const routeMap: Record<string, string> = {
      recharge: '/pages/recharge/recharge',
      memberCode: '/pages/member-code/member-code',
      agreement: '/pages/agreement/agreement',
      couponPack: '/pages/coupon/coupon',
      checkin: '/pages/checkin/checkin',
      pointsShop: '/pages/points-shop/points-shop',
      collectGift: '/pages/collect-gift/collect-gift',
      shareholder: '/pages/shareholder/shareholder'
    };

    const url = routeMap[key];
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  checkAuth(): boolean {
    if (!this.data.isLoggedIn) {
      this.handleLogin();
      return false;
    }
    return true;
  },

  showLogoutConfirm() {
    this.setData({ showLogoutModal: true });
  },

  cancelLogout() {
    this.setData({ showLogoutModal: false });
  },

  confirmLogout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.setData({
      userInfo: null,
      isLoggedIn: false,
      balance: 0,
      balanceText: '0.00',
      points: '--',
      couponCount: 0,
      showLogoutModal: false
    });
    wx.showToast({ title: '退出成功', icon: 'success' });
  },

  async onPullDownRefresh() {
    if (this.data.isLoggedIn) {
      await this.loadUserInfo();
    }
    wx.stopPullDownRefresh();
  }
});
