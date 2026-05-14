Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        iconPath: '/icons/home.png',
        selectedIconPath: '/icons/home-active.png'
      },
      {
        pagePath: '/pages/order/order',
        text: '点单',
        iconPath: '/icons/order.png',
        selectedIconPath: '/icons/order-active.png'
      },
      {
        pagePath: '/pages/scan/scan',
        text: '扫码',
        iconPath: '',
        selectedIconPath: '',
        isSpecial: true
      },
      {
        pagePath: '/pages/order-list/order-list',
        text: '订单',
        iconPath: '/icons/order-list.png',
        selectedIconPath: '/icons/order-list-active.png'
      },
      {
        pagePath: '/pages/user/user',
        text: '我的',
        iconPath: '/icons/user.png',
        selectedIconPath: '/icons/user-active.png'
      }
    ]
  },

  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const index = e.currentTarget.dataset.index as number;
      const item = this.data.list[index];

      if (item.isSpecial) {
        // 扫码按钮 - 调用微信扫码
        wx.scanCode({
          scanType: ['qrCode', 'barCode'],
          success: (res) => {
            console.log('扫码结果：', res);
            // 可根据扫码结果进行业务处理
            wx.showToast({ title: '扫码成功', icon: 'success' });
          },
          fail: (err) => {
            console.error('扫码失败：', err);
          }
        });
        return;
      }

      this.setData({ selected: index });
      wx.switchTab({ url: item.pagePath });
    }
  }
});
