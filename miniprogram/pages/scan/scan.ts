// 扫码页
Page({
  data: {
    scanning: false
  },

  onShow() {
    // 设置自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  /**
   * 点击扫码
   */
  onScanTap() {
    if (this.data.scanning) return;
    this.setData({ scanning: true });

    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('扫码结果:', res);
        // 解析二维码内容，跳转到点单页
        const result = res.result;
        if (result) {
          // 尝试从二维码中提取门店信息
          wx.switchTab({
            url: '/pages/order/order'
          });
          wx.showToast({
            title: '扫码成功',
            icon: 'success'
          });
        }
      },
      fail: (err) => {
        console.error('扫码失败:', err);
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '扫码失败，请重试',
            icon: 'none'
          });
        }
      },
      complete: () => {
        this.setData({ scanning: false });
      }
    });
  }
});
