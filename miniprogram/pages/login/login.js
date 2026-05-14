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
const auth_1 = require("../../services/auth");
Page({
    data: {
        // 状态相关
        loading: false,
        errorMessage: '',
        // 登录方式
        loginType: 'wechat',
        // 手机号登录相关
        phone: '',
        code: '',
        countDown: 0,
        // 其他
        redirectUrl: ''
    },
    onLoad(options) {
        // 初始化页面数据
        this.setData({
            loading: false,
            errorMessage: '',
            loginType: 'wechat',
            phone: '',
            code: '',
            countDown: 0,
            redirectUrl: options.redirectUrl || ''
        });
        // 检查登录状态
        this.checkLoginStatus();
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
        const token = wx.getStorageSync('token');
        if (token) {
            // 跳转到目标页面
            this.redirectAfterLogin();
            return true;
        }
        return false;
    },
    /**
     * 微信登录
     */
    handleWechatLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setData({ loading: true, errorMessage: '' });
                // 获取微信登录 code
                const code = yield new Promise((resolve, reject) => {
                    wx.login({
                        success: (res) => {
                            if (res.code) {
                                resolve(res.code);
                            }
                            else {
                                reject(new Error('获取登录凭证失败'));
                            }
                        },
                        fail: (err) => reject(err)
                    });
                });
                // 调用登录接口
                const response = yield (0, auth_1.login)(code);
                // 保存登录信息
                wx.setStorageSync('token', response.token);
                wx.setStorageSync('userInfo', response.userInfo);
                // 跳转到目标页面
                this.redirectAfterLogin();
            }
            catch (error) {
                this.showError(error.message || '登录失败，请重试');
            }
        });
    },
    /**
     * 获取手机号登录
     */
    handleGetPhoneNumber(e) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setData({ loading: true, errorMessage: '' });
                // 获取微信登录 code
                const code = yield new Promise((resolve, reject) => {
                    wx.login({
                        success: (res) => {
                            if (res.code) {
                                resolve(res.code);
                            }
                            else {
                                reject(new Error('获取登录凭证失败'));
                            }
                        },
                        fail: (err) => reject(err)
                    });
                });
                // 获取手机号
                const { encryptedData, iv } = e.detail;
                if (!encryptedData || !iv) {
                    throw new Error('获取手机号失败，请重试');
                }
                const phoneResponse = yield (0, auth_1.getPhoneNumber)(encryptedData, iv);
                // 调用登录接口
                const response = yield (0, auth_1.login)(code, phoneResponse.phone);
                // 保存登录信息
                wx.setStorageSync('token', response.token);
                wx.setStorageSync('userInfo', response.userInfo);
                // 跳转到目标页面
                this.redirectAfterLogin();
            }
            catch (error) {
                this.showError(error.message || '登录失败，请重试');
            }
        });
    },
    /**
     * 登录成功后跳转
     */
    redirectAfterLogin() {
        const { redirectUrl } = this.data;
        if (redirectUrl) {
            // 跳转到指定地址
            wx.redirectTo({
                url: redirectUrl,
                success: () => {
                    wx.showToast({ title: '登录成功' });
                }
            });
        }
        else {
            // 跳转到首页或返回上一页
            wx.navigateBack({
                delta: 1,
                success: () => {
                    wx.showToast({ title: '登录成功' });
                },
                fail: () => {
                    // 如果无法返回上一页，跳转到首页
                    wx.switchTab({ url: '/pages/index/index' });
                }
            });
        }
    },
    /**
     * 显示错误信息
     */
    showError(message) {
        this.setData({
            errorMessage: message,
            loading: false
        });
        // 3秒后自动清除错误信息
        setTimeout(() => {
            this.setData({ errorMessage: '' });
        }, 3000);
    }
});
