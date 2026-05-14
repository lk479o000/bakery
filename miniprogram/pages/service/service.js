"use strict";
Page({
    data: {
        serviceInfo: {
            phone: '',
            wechat: '',
            onlineService: true,
            serviceTime: '周一至周日 9:00-18:00'
        },
        loading: true,
        error: false,
        errorMessage: '',
        copySuccess: false
    },
    onLoad() {
        this.loadServiceInfo();
        this.checkCustomerServiceSupport();
    },
    // 加载客服信息
    loadServiceInfo() {
        this.setData({
            loading: true,
            error: false
        });
        // 模拟 API 请求，实际项目中替换为真实接口
        setTimeout(() => {
            const mockData = {
                phone: '10086',
                wechat: 'service_wechat',
                onlineService: true,
                serviceTime: '周一至周日 9:00-18:00'
            };
            this.setData({
                serviceInfo: mockData,
                loading: false
            });
        }, 1000);
    },
    // 检查客服功能支持
    checkCustomerServiceSupport() {
        try {
            const systemInfo = wx.getSystemInfoSync();
            const SDKVersion = systemInfo.SDKVersion;
            console.log('SDK Version:', SDKVersion);
            // 这里可以根据 SDK 版本判断是否支持 wx.openCustomerServiceChat
        }
        catch (error) {
            console.error('获取系统信息失败:', error);
        }
    },
    // 拨打电话
    makePhoneCall() {
        const { phone } = this.data.serviceInfo;
        if (!phone) {
            wx.showToast({
                title: '电话号码无效',
                icon: 'none'
            });
            return;
        }
        wx.makePhoneCall({
            phoneNumber: phone,
            success: function () {
                console.log('拨打电话成功');
            },
            fail: function () {
                console.log('拨打电话失败');
                wx.showToast({
                    title: '拨打电话失败，请手动拨打',
                    icon: 'none'
                });
            }
        });
    },
    // 复制微信
    copyWechat() {
        const { wechat } = this.data.serviceInfo;
        if (!wechat) {
            wx.showToast({
                title: '微信号无效',
                icon: 'none'
            });
            return;
        }
        wx.setClipboardData({
            data: wechat,
            success: () => {
                console.log('复制成功');
                this.setData({ copySuccess: true });
                setTimeout(() => {
                    this.setData({ copySuccess: false });
                }, 2000);
                wx.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
            },
            fail: () => {
                console.log('复制失败');
                wx.showToast({
                    title: '复制失败，请手动复制',
                    icon: 'none'
                });
            }
        });
    },
    // 打开客服会话
    openCustomerServiceChat() {
        if (wx.openCustomerServiceChat) {
            wx.openCustomerServiceChat({
                corpId: '', // 企业微信 corpId（可选）
                extInfo: {
                    url: '' // 客服页面 url（可选）
                },
                success: function () {
                    console.log('打开客服会话成功');
                },
                fail: function () {
                    console.log('打开客服会话失败');
                    wx.showToast({
                        title: '打开客服会话失败',
                        icon: 'none'
                    });
                }
            });
        }
        else {
            wx.showToast({
                title: '当前版本不支持此功能',
                icon: 'none'
            });
        }
    }
});
