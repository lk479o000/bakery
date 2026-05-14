Component({
  properties: {
    // 空状态类型
    type: {
      type: String,
      value: 'order' // order / coupon / address / cart / network
    },
    // 自定义提示文字
    message: {
      type: String,
      value: ''
    },
    // 按钮文字
    buttonText: {
      type: String,
      value: ''
    }
  },

  data: {
    defaultMessages: {
      order: '您暂时还没有订单哦~',
      coupon: '暂无可用优惠券',
      address: '暂无收货地址',
      cart: '购物车是空的',
      network: '网络连接失败'
    },
    defaultIcons: {
      order: '📋',
      coupon: '🎫',
      address: '📍',
      cart: '🛒',
      network: '📡'
    }
  },

  methods: {
    onButtonClick() {
      this.triggerEvent('buttonclick');
    }
  }
});
