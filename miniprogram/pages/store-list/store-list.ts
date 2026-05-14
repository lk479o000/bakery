import { getStoreList } from '../../services/store';

interface StoreItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  distance?: string;
  isOpen: boolean;
  canDelivery: boolean;
  canPickup: boolean;
  canExpress: boolean;
}

Page({
  data: {
    // Tab
    currentTab: 'select' as 'select' | 'favorite',

    // 搜索
    searchKeyword: '',

    // 地图
    mapLatitude: 30.5728,
    mapLongitude: 104.0668,
    mapCollapsed: false,
    markers: [] as any[],

    // 门店列表
    storeList: [] as StoreItem[],
    loading: false
  },

  onLoad() {
    this.loadStoreList();
  },

  /**
   * 加载门店列表
   */
  async loadStoreList() {
    try {
      this.setData({ loading: true });

      const { list } = await getStoreList({ page: 1, pageSize: 20 });
      const storeList = list;

      const markers = storeList.map(store => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        title: store.name,
        iconPath: '/icons/marker.png',
        width: 28,
        height: 28,
        callout: {
          content: store.name,
          color: '#333',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#fff',
          padding: 6,
          display: 'ALWAYS'
        }
      }));

      this.setData({
        storeList,
        markers,
        loading: false
      });
    } catch (error) {
      console.error('加载门店失败:', error);
      this.setData({ loading: false });
      wx.showToast({ title: '加载门店失败', icon: 'none' });
    }
  },

  /**
   * 切换Tab
   */
  onTabChange(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab as 'select' | 'favorite';
    if (tab === this.data.currentTab) return;
    this.setData({ currentTab: tab });
    if (tab === 'favorite') {
      this.loadFavoriteStores();
    } else {
      this.loadStoreList();
    }
  },

  /**
   * 加载常去/收藏门店
   */
  async loadFavoriteStores() {
    this.setData({ storeList: [], loading: false });
  },

  /**
   * 搜索输入
   */
  onSearchInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ searchKeyword: e.detail.value });
  },

  /**
   * 搜索确认
   */
  async onSearch() {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      this.loadStoreList();
      return;
    }

    try {
      this.setData({ loading: true });
      const { list } = await getStoreList({ keyword, page: 1, pageSize: 20 });
      this.setData({ storeList: list, loading: false });
    } catch (error) {
      console.error('搜索门店失败:', error);
      this.setData({ loading: false });
    }
  },

  /**
   * 切换地图折叠
   */
  onToggleMap() {
    this.setData({ mapCollapsed: !this.data.mapCollapsed });
  },

  /**
   * 地图标记点击
   */
  onMarkerTap(e: WechatMiniprogram.TouchEvent) {
    const markerId = e.detail.markerId;
    const store = this.data.storeList.find(s => s.id === markerId);
    if (store) {
      this.setData({
        mapLatitude: store.latitude,
        mapLongitude: store.longitude
      });
    }
  },

  /**
   * 去下单
   */
  onGoOrder(e: WechatMiniprogram.TouchEvent) {
    const storeId = e.currentTarget.dataset.storeId;
    const storeName = e.currentTarget.dataset.storeName;
    wx.setStorageSync('selectedStoreId', storeId);
    wx.setStorageSync('selectedStoreName', storeName);
    wx.switchTab({
      url: '/pages/order/order'
    });
  },

  /**
   * 拨打电话
   */
  onCallStore(e: WechatMiniprogram.TouchEvent) {
    const phone = e.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  /**
   * 导航
   */
  onNavigate(e: WechatMiniprogram.TouchEvent) {
    const { latitude, longitude, name, address } = e.currentTarget.dataset;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 16
    });
  }
});
