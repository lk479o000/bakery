import { Address } from '../../types/api';
import { getAddressList, setDefaultAddress as setDefaultAddressApi, deleteAddress as deleteAddressApi } from '../../services/address';

Page({
  data: {
    addresses: [] as Address[],
    isLoggedIn: false,
    loading: false
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    // 每次页面显示时重新加载地址列表，确保数据最新
    if (this.data.isLoggedIn) {
      this.loadAddressList();
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const isLoggedIn = !!token;
    this.setData({ isLoggedIn });
    
    if (isLoggedIn) {
      this.loadAddressList();
    }
  },

  // 加载地址列表
  async loadAddressList() {
    this.setData({ loading: true });
    try {
      const addresses = await getAddressList();
      this.setData({ addresses, loading: false });
    } catch (error) {
      console.error('加载地址列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载地址失败',
        icon: 'none'
      });
    }
  },

  // 去登录
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 新增地址
  addAddress() {
    wx.navigateTo({
      url: '/pages/address/add'
    });
  },

  // 编辑地址
  editAddress(e: any) {
    const addressId = e.currentTarget.dataset.id;
    const address = this.data.addresses.find(item => item.id === addressId);
    if (address) {
      wx.navigateTo({
        url: `/pages/address/edit?addressId=${addressId}`
      });
    }
  },

  // 设置默认地址
  async setDefaultAddress(e: any) {
    const addressId = e.currentTarget.dataset.id;
    this.setData({ loading: true });
    try {
      await setDefaultAddressApi(addressId);
      wx.showToast({
        title: '设置成功',
        icon: 'success'
      });
      // 重新加载地址列表
      this.loadAddressList();
    } catch (error) {
      console.error('设置默认地址失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '设置失败',
        icon: 'none'
      });
    }
  },

  // 删除地址
  deleteAddress(e: any) {
    const addressId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ loading: true });
          try {
            await deleteAddressApi(addressId);
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            // 重新加载地址列表
            this.loadAddressList();
          } catch (error) {
            console.error('删除地址失败:', error);
            this.setData({ loading: false });
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});