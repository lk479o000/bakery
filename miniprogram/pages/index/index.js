"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../services/product");
Page({
    data: {
        bannerList: [],
        isLoggedIn: false
    },
    onLoad() {
        this.checkLoginStatus();
        this.loadBannerList();
    },
    onShow() {
        // 每次显示页面时检查登录状态
        this.checkLoginStatus();
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        this.setData({
            isLoggedIn: !!token
        });
    },
    /**
     * 加载轮播图列表
     */
    loadBannerList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerList = yield (0, product_1.getBannerList)();
                this.setData({ bannerList });
            }
            catch (error) {
                console.error('加载轮播图失败:', error);
            }
        });
    },
    /**
     * 轮播图点击
     */
    onBannerTap(e) {
        const link = e.currentTarget.dataset.link;
        if (link) {
            wx.navigateTo({
                url: link
            });
        }
    },
    /**
     * 登录按钮点击
     */
    onLoginTap() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    /**
     * 到店自提点击
     */
    onPickupTap() {
        wx.switchTab({
            url: '/pages/order/order'
        });
    },
    /**
     * 外卖配送点击
     */
    onDeliveryTap() {
        wx.switchTab({
            url: '/pages/order/order'
        });
    },
    /**
     * 领券中心点击
     */
    onCouponTap() {
        wx.navigateTo({
            url: '/pages/coupon/coupon'
        });
    },
    /**
     * 会员充值点击
     */
    onRechargeTap() {
        wx.navigateTo({
            url: '/pages/recharge/recharge'
        });
    },
    /**
     * 我的订单点击
     */
    onOrderTap() {
        wx.switchTab({
            url: '/pages/order-list/order-list'
        });
    },
    /**
     * 会员码点击
     */
    onMemberTap() {
        wx.navigateTo({
            url: '/pages/member-code/member-code'
        });
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadBannerList();
            wx.stopPullDownRefresh();
        });
    },
    /**
     * 分享
     */
    onShareAppMessage() {
        return {
            title: '吉世面包 - 用心烘焙每一份温暖',
            path: '/pages/index/index'
        };
    }
});
