"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../../miniprogram/utils/request");
Page({
    data: {
        // 充值套餐相关
        rechargeList: [],
        selectedPackage: null,
        // 用户相关
        userBalance: 0,
        isLoggedIn: false,
        // 状态相关
        loading: false,
        error: null,
        // 支付相关
        paymentLoading: false,
        paymentSuccess: false,
        paymentError: null
    },
    onLoad() {
        // 初始化页面数据
        this.initPageData();
    },
    // 初始化页面数据
    initPageData() {
        // 检查登录状态
        this.checkLoginStatus();
        // 加载充值套餐
        this.loadRechargePackages();
    },
    // 检查登录状态
    checkLoginStatus() {
        // 这里应该调用 auth.checkLogin() 检查登录状态
        // 暂时模拟已登录
        this.setData({
            isLoggedIn: true
        });
        // 如果已登录，加载用户余额
        if (this.data.isLoggedIn) {
            this.loadUserBalance();
        }
    },
    // 加载用户余额
    loadUserBalance() {
        (0, request_1.get)('/api/balance')
            .then(res => {
            this.setData({
                userBalance: res.data.balance || 0
            });
        })
            .catch(err => {
            console.error('加载用户余额失败:', err);
            this.setData({
                error: '加载余额失败'
            });
        });
    },
    // 加载充值套餐列表
    loadRechargePackages() {
        this.setData({ loading: true, error: null });
        (0, request_1.get)('/api/recharge/packages')
            .then(res => {
            const packages = res.data || [];
            // 格式化套餐数据，计算 totalAmount
            const formattedList = packages.map((pkg) => (Object.assign(Object.assign({}, pkg), { totalAmount: pkg.amount + (pkg.giftAmount || 0) })));
            // 自动选择推荐套餐（如果有）
            const recommendedPackage = formattedList.find((pkg) => pkg.isRecommended);
            this.setData({
                rechargeList: formattedList,
                selectedPackage: recommendedPackage || null,
                loading: false
            });
        })
            .catch(err => {
            console.error('加载充值套餐失败:', err);
            this.setData({
                error: '加载充值套餐失败',
                loading: false
            });
        });
    },
    // 选择充值套餐
    selectPackage(e) {
        const selectedPackage = e.currentTarget.dataset.item;
        // 检查登录状态
        if (!this.data.isLoggedIn) {
            this.showLoginTip();
            return;
        }
        this.setData({
            selectedPackage: selectedPackage,
            paymentError: null
        });
    },
    // 显示登录提示
    showLoginTip() {
        wx.showModal({
            title: '请先登录',
            content: '登录后才能进行充值操作',
            success: (res) => {
                if (res.confirm) {
                    this.goToLogin();
                }
            }
        });
    },
    // 跳转到登录页面
    goToLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    // 确认充值
    confirmRecharge() {
        const { selectedPackage, isLoggedIn } = this.data;
        // 检查登录状态
        if (!isLoggedIn) {
            this.showLoginTip();
            return;
        }
        // 检查是否选择套餐
        if (!selectedPackage) {
            wx.showToast({
                title: '请选择充值套餐',
                icon: 'none'
            });
            return;
        }
        // 显示支付加载状态
        this.setData({ paymentLoading: true });
        // 创建充值订单
        (0, request_1.post)('/api/recharge/create', {
            packageId: selectedPackage.id,
            amount: selectedPackage.amount,
            giftAmount: selectedPackage.giftAmount,
            price: selectedPackage.price
        })
            .then(() => {
            // 调用支付接口
            return this.callPayment();
        })
            .then(() => {
            // 支付成功
            this.handlePaymentSuccess();
        })
            .catch(err => {
            // 支付失败
            this.handlePaymentFailure(err);
        })
            .finally(() => {
            this.setData({ paymentLoading: false });
        });
    },
    // 调用支付接口
    callPayment() {
        return new Promise((resolve) => {
            // 这里应该调用微信支付 API
            // 暂时模拟支付成功
            setTimeout(() => {
                resolve({});
            }, 1000);
        });
    },
    // 处理支付成功
    handlePaymentSuccess() {
        wx.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 2000
        });
        this.setData({
            paymentSuccess: true,
            paymentError: null
        });
        // 刷新用户余额
        this.loadUserBalance();
        // 3秒后自动跳转到余额明细页面
        setTimeout(() => {
            this.goToBalanceDetail();
        }, 3000);
    },
    // 处理支付失败
    handlePaymentFailure() {
        wx.showToast({
            title: '支付失败，请重试',
            icon: 'none'
        });
        this.setData({
            paymentError: '支付失败，请重试',
            paymentSuccess: false
        });
    },
    // 跳转到余额明细页面
    goToBalanceDetail() {
        wx.navigateTo({
            url: '/pages/balance-record/balance-record'
        });
    }
});
