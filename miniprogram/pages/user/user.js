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
const user_1 = require("../../services/user");
Page({
    data: {
        // 用户信息
        userInfo: null,
        isLoggedIn: false,
        loading: false,
        // 统计信息
        balance: 0,
        couponCount: 0,
        orderCount: {
            pending: 0,
            shipping: 0,
            completed: 0
        },
        // 页面状态
        showLogoutConfirm: false
    },
    onLoad() {
        this.initPage();
    },
    onShow() {
        // 每次显示页面时检查登录状态
        this.checkLoginStatus();
    },
    /**
     * 初始化页面
     */
    initPage() {
        this.checkLoginStatus();
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        const isLoggedIn = !!token;
        this.setData({ isLoggedIn });
        if (isLoggedIn) {
            this.loadUserInfo();
        }
    },
    /**
     * 加载用户信息
     */
    loadUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setData({ loading: true });
                const userInfo = yield (0, user_1.getUserInfo)();
                this.setData({ userInfo, isLoggedIn: true });
                this.loadUserStats();
            }
            catch (error) {
                console.error('加载用户信息失败:', error);
                // 401 错误，清除 token
                if (error.statusCode === 401) {
                    wx.removeStorageSync('token');
                    this.setData({ isLoggedIn: false, userInfo: null });
                }
            }
            finally {
                this.setData({ loading: false });
            }
        });
    },
    /**
     * 加载用户统计数据
     */
    loadUserStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 并行加载统计数据
                const [balance, couponCount, orderCount] = yield Promise.all([
                    this.loadBalance(),
                    this.loadCouponCount(),
                    this.loadOrderCount()
                ]);
                this.setData({ balance, couponCount, orderCount });
            }
            catch (error) {
                console.error('加载统计数据失败:', error);
            }
        });
    },
    /**
     * 加载余额
     */
    loadBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            // 模拟数据，实际应调用 API
            return 100.50;
        });
    },
    /**
     * 加载优惠券数量
     */
    loadCouponCount() {
        return __awaiter(this, void 0, void 0, function* () {
            // 模拟数据，实际应调用 API
            return 3;
        });
    },
    /**
     * 加载订单数量
     */
    loadOrderCount() {
        return __awaiter(this, void 0, void 0, function* () {
            // 模拟数据，实际应调用 API
            return {
                pending: 2,
                shipping: 1,
                completed: 5
            };
        });
    },
    /**
     * 处理登录
     */
    handleLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    /**
     * 跳转到订单列表
     */
    navigateToOrderList() {
        if (!this.data.isLoggedIn) {
            this.handleLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/order-list/order-list'
        });
    },
    /**
     * 跳转到地址管理
     */
    navigateToAddress() {
        if (!this.data.isLoggedIn) {
            this.handleLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/address/address'
        });
    },
    /**
     * 跳转到优惠券
     */
    navigateToCoupon() {
        if (!this.data.isLoggedIn) {
            this.handleLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/coupon/coupon'
        });
    },
    /**
     * 跳转到余额明细
     */
    navigateToBalance() {
        if (!this.data.isLoggedIn) {
            this.handleLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/balance-record/balance-record'
        });
    },
    /**
     * 跳转到会员码
     */
    navigateToMemberCode() {
        if (!this.data.isLoggedIn) {
            this.handleLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/member-code/member-code'
        });
    },
    /**
     * 显示退出登录确认
     */
    showLogoutConfirm() {
        this.setData({ showLogoutConfirm: true });
    },
    /**
     * 取消退出登录
     */
    cancelLogout() {
        this.setData({ showLogoutConfirm: false });
    },
    /**
     * 确认退出登录
     */
    confirmLogout() {
        // 清除本地 token
        wx.removeStorageSync('token');
        // 重置页面数据
        this.setData({
            userInfo: null,
            isLoggedIn: false,
            balance: 0,
            couponCount: 0,
            orderCount: {
                pending: 0,
                shipping: 0,
                completed: 0
            },
            showLogoutConfirm: false
        });
        // 显示退出成功提示
        wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 1500
        });
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.isLoggedIn) {
                yield this.loadUserInfo();
            }
            wx.stopPullDownRefresh();
        });
    }
});
