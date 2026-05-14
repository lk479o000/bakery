"use strict";
// app.ts
App({
    onLaunch() {
        // 小程序启动时执行
        console.log('小程序启动');
        // 检查登录状态
        const token = wx.getStorageSync('token');
        if (token) {
            console.log('用户已登录');
        }
        else {
            console.log('用户未登录');
        }
    },
    onShow(options) {
        // 小程序显示时执行
        console.log('小程序显示', options);
    },
    onHide() {
        // 小程序隐藏时执行
        console.log('小程序隐藏');
    },
    onError(error) {
        // 小程序错误时执行
        console.error('小程序错误:', error);
    },
    globalData: {
        userInfo: null,
        token: null
    }
});
