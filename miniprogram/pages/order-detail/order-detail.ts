import { getOrderDetail, cancelOrder, payOrder } from '../../services/order';
import { OrderDetail } from '../../types/api';

Page({
  data: {
    loading: true,
    error: '',
    orderDetail: null as OrderDetail | null,
    showPayModal: false,
    showCancelModal: false,
    selectedPayType: 'wechat' as 'wechat' | 'balance',
    orderId: ''
  },

  onLoad(options: { orderId: string }) {
    const { orderId } = options;
    if (orderId) {
      this.setData({ orderId });
      this.loadOrderDetail();
    } else {
      this.setData({ error: '订单ID不存在', loading: false });
    }
  },

  async loadOrderDetail() {
    const { orderId } = this.data;
    if (!orderId) return;

    this.setData({ loading: true, error: '' });
    try {
      const orderDetail = await getOrderDetail(orderId);
      this.setData({ orderDetail, loading: false });
    } catch (error: any) {
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
  },

  // 格式化时间
  formatTime(timeStr: string) {
    if (!timeStr) return '';
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
  getPayTypeText(payType: string) {
    const payTypeMap: Record<string, string> = {
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
  selectPayType(e: { currentTarget: { dataset: { type: 'wechat' | 'balance' } } }) {
    const { type } = e.currentTarget.dataset;
    this.setData({ selectedPayType: type });
  },

  // 支付订单
  async payOrder() {
    const { orderId, selectedPayType } = this.data;
    if (!orderId) return;

    try {
      await payOrder(orderId, selectedPayType);
      wx.showToast({ title: '支付成功', icon: 'success' });
      this.hidePayModal();
      // 重新加载订单详情
      this.loadOrderDetail();
    } catch (error: any) {
      console.error('支付失败:', error);
      wx.showToast({ title: error.message || '支付失败', icon: 'none' });
    }
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
  async cancelOrder() {
    const { orderId } = this.data;
    if (!orderId) return;

    try {
      await cancelOrder(orderId);
      wx.showToast({ title: '取消订单成功', icon: 'success' });
      this.hideCancelModal();
      // 重新加载订单详情
      this.loadOrderDetail();
    } catch (error: any) {
      console.error('取消订单失败:', error);
      wx.showToast({ title: error.message || '取消订单失败', icon: 'none' });
    }
  },

  // 再来一单
  rebuy() {
    const { orderDetail } = this.data;
    if (!orderDetail) return;

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