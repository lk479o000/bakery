"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_1 = require("../../miniprogram/services/coupon");
Page({
    data: {
        couponList: [],
        loading: false,
        empty: false,
        receiving: false,
        isLoggedIn: false
    },
    // 页面加载
    onLoad() {
        this.checkLoginStatus();
    },
    // 页面显示
    onShow() {
        if (this.data.isLoggedIn) {
            this.loadCouponList();
        }
        else {
            this.checkLoginStatus();
        }
    },
    // 检查登录状态
    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        const isLoggedIn = !!token;
        this.setData({ isLoggedIn });
        if (isLoggedIn) {
            this.loadCouponList();
        }
    },
    // 加载优惠券列表
    loadCouponList() {
        this.setData({ loading: true, empty: false });
        (0, coupon_1.getCouponList)()
            .then(res => {
            this.setData({
                couponList: res,
                loading: false,
                empty: res.length === 0
            });
        })
            .catch(err => {
            this.setData({ loading: false });
            wx.showToast({ title: '加载失败，请重试', icon: 'none' });
        });
    },
    // 领取优惠券
    receiveCoupon(e) {
        const couponId = e.currentTarget.dataset.id;
        if (!this.data.isLoggedIn) {
            wx.navigateTo({ url: '/pages/login/login' });
            return;
        }
        if (this.data.receiving)
            return;
        const coupon = this.data.couponList.find(c => c.id === couponId);
        if (coupon === null || coupon === void 0 ? void 0 : coupon.received) {
            wx.showToast({ title: '已领取该优惠券', icon: 'none' });
            return;
        }
        this.setData({ receiving: true });
        (0, coupon_1.receiveCoupon)(couponId)
            .then(() => {
            wx.showToast({ title: '领取成功', icon: 'success' });
            // 更新优惠券状态
            const updatedList = this.data.couponList.map(c => c.id === couponId ? Object.assign(Object.assign({}, c), { received: true }) : c);
            this.setData({ couponList: updatedList });
        })
            .catch(err => {
            wx.showToast({ title: '领取失败，请重试', icon: 'none' });
        })
            .finally(() => {
            this.setData({ receiving: false });
        });
    },
    // 去登录
    goLogin() {
        wx.navigateTo({ url: '/pages/login/login' });
    },
    // 去逛逛
    goShopping() {
        wx.switchTab({ url: '/pages/index/index' });
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.loadCouponList();
        wx.stopPullDownRefresh();
    }
});
