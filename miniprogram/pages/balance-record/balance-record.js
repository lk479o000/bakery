"use strict";
// 余额明细页面
Object.defineProperty(exports, "__esModule", { value: true });
const balance_1 = require("../../services/balance");
Page({
    data: {
        // 余额明细列表
        records: [],
        // 分页参数
        page: 1,
        pageSize: 10,
        // 状态
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
        noMoreData: false,
        isEmpty: false,
        isLogin: false,
        errorMessage: '',
        total: 0
    },
    onLoad() {
        // 页面初始化
        this.checkLoginStatus();
    },
    onShow() {
        // 页面显示时检查登录状态
        this.checkLoginStatus();
    },
    onPullDownRefresh() {
        // 下拉刷新
        this.handlePullDownRefresh();
    },
    onReachBottom() {
        // 上拉加载更多
        this.handleLoadMore();
    },
    // 检查登录状态
    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        const isLogin = !!token;
        this.setData({ isLogin });
        if (isLogin) {
            // 已登录，加载余额明细
            this.loadBalanceRecords();
        }
    },
    // 加载余额明细
    loadBalanceRecords() {
        const { page, pageSize } = this.data;
        this.setData({ isLoading: true, errorMessage: '' });
        (0, balance_1.getBalanceRecords)({ page, pageSize })
            .then(res => {
            const { list, total } = res;
            this.setData({
                records: list,
                total,
                isLoading: false,
                isEmpty: list.length === 0,
                noMoreData: list.length < pageSize
            });
        })
            .catch(err => {
            this.setData({
                isLoading: false,
                errorMessage: '加载失败，请重试'
            });
            console.error('加载余额明细失败:', err);
        });
    },
    // 下拉刷新处理
    handlePullDownRefresh() {
        this.setData({
            page: 1,
            isRefreshing: true,
            noMoreData: false,
            isEmpty: false
        });
        const { page, pageSize } = this.data;
        (0, balance_1.getBalanceRecords)({ page, pageSize })
            .then(res => {
            const { list, total } = res;
            this.setData({
                records: list,
                total,
                isRefreshing: false,
                isEmpty: list.length === 0,
                noMoreData: list.length < pageSize
            });
            // 停止下拉刷新动画
            wx.stopPullDownRefresh();
        })
            .catch(err => {
            this.setData({
                isRefreshing: false,
                errorMessage: '刷新失败，请重试'
            });
            // 停止下拉刷新动画
            wx.stopPullDownRefresh();
            console.error('刷新余额明细失败:', err);
        });
    },
    // 上拉加载更多处理
    handleLoadMore() {
        const { isLoadingMore, noMoreData, isLoading, page, pageSize, records } = this.data;
        // 检查是否可以加载更多
        if (isLoadingMore || noMoreData || isLoading) {
            return;
        }
        const newPage = page + 1;
        this.setData({ isLoadingMore: true });
        (0, balance_1.getBalanceRecords)({ page: newPage, pageSize })
            .then(res => {
            const { list, total } = res;
            const newRecords = [...records, ...list];
            this.setData({
                records: newRecords,
                total,
                page: newPage,
                isLoadingMore: false,
                noMoreData: list.length < pageSize
            });
        })
            .catch(err => {
            this.setData({
                isLoadingMore: false,
                errorMessage: '加载更多失败，请重试'
            });
            console.error('加载更多余额明细失败:', err);
        });
    },
    // 重试
    retry() {
        this.setData({ errorMessage: '' });
        this.loadBalanceRecords();
    },
    // 去登录
    goToLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    // 去充值
    goToRecharge() {
        wx.navigateTo({
            url: '/pages/recharge/recharge'
        });
    }
});
