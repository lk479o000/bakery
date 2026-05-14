// 关于我们页面

import { BRAND_INFO } from '../../utils/constants';

Page({
  data: {
    brandInfo: BRAND_INFO
  },

  /**
   * 拨打电话
   */
  onCallPhone() {
    wx.makePhoneCall({
      phoneNumber: '028-87654321'
    });
  },

  /**
   * 打开地图
   */
  onOpenMap() {
    wx.openLocation({
      latitude: 30.5728,
      longitude: 104.0668,
      name: '吉世面包',
      address: '金祥路35号',
      scale: 18
    });
  }
});