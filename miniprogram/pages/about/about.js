"use strict";
Page({
    data: {
        brandInfo: {
            name: '面包店品牌',
            logo: '/assets/logo.png',
            description: '我们是一家专注于高品质面包和甜点的烘焙店，致力于为顾客提供新鲜、美味的产品。',
            history: '我们的品牌创立于2010年，从一家小小的面包店开始，逐渐发展成为当地知名的烘焙品牌。',
            mission: '我们的使命是通过优质的产品和服务，为顾客带来愉悦的烘焙体验。',
            vision: '成为顾客最信赖的烘焙品牌，引领行业创新。',
            values: ['品质', '创新', '服务', '诚信']
        },
        storeList: [
            {
                id: '1',
                name: '旗舰店',
                address: '北京市朝阳区建国路88号',
                phone: '010-12345678',
                hours: '周一至周日 8:00-22:00',
                latitude: 39.908722,
                longitude: 116.397496,
                image: '/assets/store1.jpg'
            },
            {
                id: '2',
                name: '望京店',
                address: '北京市朝阳区望京SOHO T3',
                phone: '010-87654321',
                hours: '周一至周日 9:00-21:00',
                latitude: 39.994733,
                longitude: 116.475399,
                image: '/assets/store2.jpg'
            }
        ],
        loading: false,
        activeTab: 'brand',
        showMap: false,
        selectedStore: null
    },
    onLoad() {
        // 页面初始化，设置默认数据
        this.setData({
            loading: false
        });
    },
    // 切换标签
    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        this.setData({
            activeTab: tab
        });
    },
    // 拨打电话
    callStore(e) {
        const phone = e.currentTarget.dataset.phone;
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone
            });
        }
    },
    // 打开地图
    openMap(e) {
        const store = e.currentTarget.dataset.store;
        if (store) {
            wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                    wx.openLocation({
                        latitude: store.latitude,
                        longitude: store.longitude,
                        name: store.name,
                        address: store.address,
                        scale: 18
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '请开启位置权限',
                        icon: 'none'
                    });
                }
            });
        }
    }
});
