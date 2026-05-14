// 充值中心页面
import { get as requestGet, post as requestPost } from '../../utils/request';

// 充值套餐类型定义
interface RechargePackage {
  id: string;
  amount: number;
  giftAmount: number;
  totalAmount: number;
  price: number;
  description: string;
  isRecommended: boolean;
}

Page({
  data: {
    rechargeList: [] as RechargePackage[],
    selectedPackage: null as RechargePackage | null,
    userBalance: '0.00',
    isLoggedIn: false,
    loading: false,
    error: '' as string,
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: '' as string
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.checkLoginStatus();
  },

  initPage() {
    this.checkLoginStatus();
    this.loadRechargePackages();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const isLoggedIn = !!token;
    this.setData({ isLoggedIn });
    if (isLoggedIn) {
      this.loadUserBalance();
    }
  },

  loadUserBalance() {
    requestGet('/api/balance')
      .then((res: any) => {
        const balance = res.data && res.data.balance ? res.data.balance.toFixed(2) : '0.00';
        this.setData({ userBalance: balance });
      })
      .catch((err: any) => {
        console.error('加载用户余额失败:', err);
      });
  },

  loadRechargePackages() {
    this.setData({ loading: true, error: '' });

    // 模拟数据（线上版本样式）
    const mockPackages: RechargePackage[] = [
      {
        id: '1',
        amount: 200,
        giftAmount: 20,
        totalAmount: 220,
        price: 200,
        description: '储200送20',
        isRecommended: true
      },
      {
        id: '2',
        amount: 300,
        giftAmount: 40,
        totalAmount: 340,
        price: 300,
        description: '储300送40',
        isRecommended: false
      }
    ];

    requestGet('/api/recharge-package/list')
      .then((res: any) => {
        const packages = res.data || mockPackages;
        const formattedList = packages.map((pkg: any) => ({
          ...pkg,
          totalAmount: pkg.amount + (pkg.giftAmount || 0)
        }));
        const recommended = formattedList.find((pkg: RechargePackage) => pkg.isRecommended);
        this.setData({
          rechargeList: formattedList,
          selectedPackage: recommended || null,
          loading: false
        });
      })
      .catch(() => {
        // 使用模拟数据
        this.setData({
          rechargeList: mockPackages,
          selectedPackage: mockPackages[0],
          loading: false
        });
      });
  },

  selectPackage(e: any) {
    const item = e.currentTarget.dataset.item;
    this.setData({ selectedPackage: item, paymentError: '' });
  },

  scrollToPackages() {
    wx.pageScrollTo({
      selector: '#packagesSection',
      duration: 300
    });
  },

  onLearnMore() {
    wx.showToast({ title: '详情页开发中', icon: 'none' });
  },

  confirmRecharge() {
    const { selectedPackage, isLoggedIn } = this.data;

    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }

    if (!selectedPackage) {
      wx.showToast({ title: '请选择充值套餐', icon: 'none' });
      return;
    }

    this.setData({ paymentLoading: true });

    requestPost('/api/recharge-package/recharge', {
      packageId: selectedPackage.id,
      amount: selectedPackage.amount,
      giftAmount: selectedPackage.giftAmount,
      price: selectedPackage.price
    })
      .then(() => {
        this.handlePaymentSuccess();
        this.setData({ paymentLoading: false });
      })
      .catch(() => {
        this.handlePaymentFailure();
        this.setData({ paymentLoading: false });
      });
  },

  handlePaymentSuccess() {
    wx.showToast({ title: '充值成功', icon: 'success', duration: 2000 });
    this.setData({ paymentSuccess: true, paymentError: '' });
    this.loadUserBalance();
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/balance-record/balance-record' });
    }, 2000);
  },

  handlePaymentFailure() {
    wx.showToast({ title: '支付失败，请重试', icon: 'none' });
    this.setData({ paymentError: '支付失败，请重试', paymentSuccess: false });
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  }
});
