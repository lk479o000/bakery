import { getCategoryList, getProductList } from '../../services/product';
import { getCartList, addToCart, updateCartItem, deleteCartItem, clearCart } from '../../services/cart';
import { login, getPhoneNumber } from '../../services/auth';
import { Category, Product, CartItem } from '../../types/api';

// 扩展商品类型，添加购物车数量
interface ProductWithCart extends Product {
  cartQuantity: number;
}

Page({
  data: {
    // 分类相关
    categoryList: [] as Category[],
    currentCategoryId: '',
    
    // 商品相关
    productList: [] as ProductWithCart[],
    loading: false,
    refreshing: false,
    
    // 购物车相关
    cartList: [] as CartItem[],
    cartTotal: {
      count: 0,
      amount: 0
    },
    cartPanelVisible: false,
    
    // 订单类型
    orderType: 'pickup' as 'pickup' | 'delivery' | 'express',
    storeDistance: '9.67km',
    
    // 登录弹窗
    loginModalVisible: false,
    loginLoading: false,
    agreementChecked: true,
    pendingAction: null as (() => void) | null
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    // 页面显示时刷新购物车
    this.loadCartList();
    // 设置自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  /**
   * 初始化页面
   */
  async initPage() {
    try {
      // 读取保存的订单类型
      const savedType = wx.getStorageSync('orderType') || 'pickup';
      this.setData({ orderType: savedType as 'pickup' | 'delivery' | 'express' });

      // 并行加载分类和购物车
      const [categoryList] = await Promise.all([
        this.loadCategoryList(),
        this.loadCartList()
      ]);

      // 默认选中第一个分类
      if (categoryList.length > 0) {
        this.setData({ currentCategoryId: categoryList[0].id });
        this.loadProductList(categoryList[0].id);
      }
    } catch (error) {
      console.error('初始化页面失败:', error);
    }
  },

  /**
   * 加载分类列表
   */
  async loadCategoryList() {
    try {
      const categoryList = await getCategoryList({ orderType: this.data.orderType });
      this.setData({ categoryList });
      return categoryList;
    } catch (error) {
      console.error('加载分类失败:', error);
      return [];
    }
  },

  /**
   * 加载商品列表
   */
  async loadProductList(categoryId: string) {
    try {
      this.setData({ loading: true });
      const { list } = await getProductList({
        categoryId,
        page: 1,
        pageSize: 20,
        orderType: this.data.orderType,
      });
      
      // 合并购物车数量
      const productList = this.mergeCartQuantity(list);
      this.setData({ productList, loading: false });
    } catch (error) {
      console.error('加载商品失败:', error);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败，请重试', icon: 'none' });
    }
  },

  /**
   * 加载购物车列表
   */
  async loadCartList() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        this.setData({ cartList: [], cartTotal: { count: 0, amount: 0 } });
        return;
      }

      const cartList = await getCartList();
      this.setData({ cartList });
      this.updateCartBar();
      this.updateProductCartQuantity();
    } catch (error) {
      console.error('加载购物车失败:', error);
    }
  },

  /**
   * 合并购物车数量到商品列表
   */
  mergeCartQuantity(products: Product[]): ProductWithCart[] {
    const { cartList } = this.data;
    return products.map(product => {
      const cartItem = cartList.find(item => item.productId === product.id);
      return {
        ...product,
        cartQuantity: cartItem ? cartItem.quantity : 0
      };
    });
  },

  /**
   * 更新商品列表中的购物车数量
   */
  updateProductCartQuantity() {
    const { productList, cartList } = this.data;
    const updatedProducts = productList.map(product => {
      const cartItem = cartList.find(item => item.productId === product.id);
      return {
        ...product,
        cartQuantity: cartItem ? cartItem.quantity : 0
      };
    });
    this.setData({ productList: updatedProducts });
  },

  /**
   * 更新购物车栏
   */
  updateCartBar() {
    const { cartList } = this.data;
    const count = cartList.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cartList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    this.setData({
      cartTotal: { count, amount: parseFloat(amount.toFixed(2)) }
    });
  },

  /**
   * 分类切换
   */
  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const categoryId = e.currentTarget.dataset.id as string;
    if (categoryId === this.data.currentCategoryId) return;
    
    this.setData({ currentCategoryId: categoryId });
    this.loadProductList(categoryId);
  },

  /**
   * 选择门店
   */
  onSelectStoreTap() {
    wx.navigateTo({
      url: '/pages/store-list/store-list'
    });
  },

  /**
   * 订单类型切换
   */
  async onOrderTypeChange(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as 'pickup' | 'delivery' | 'express';
    this.setData({ orderType: type });
    wx.setStorageSync('orderType', type);

    const categoryList = await this.loadCategoryList();
    if (categoryList.length === 0) {
      this.setData({ currentCategoryId: '', productList: [] });
      return;
    }
    let nextId = this.data.currentCategoryId;
    if (!categoryList.some((c) => c.id === nextId)) {
      nextId = categoryList[0].id;
      this.setData({ currentCategoryId: nextId });
    }
    await this.loadProductList(nextId);
  },

  /**
   * 加入购物车
   */
  async onAddTap(e: WechatMiniprogram.TouchEvent) {
    const productId = e.currentTarget.dataset.productid as string;
    const stock = e.currentTarget.dataset.stock as number;

    // 检查登录状态
    if (!this.checkLogin()) return;

    // 检查库存
    if (stock === 0) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }

    try {
      const { cartList } = this.data;
      const existingItem = cartList.find(item => item.productId === productId);

      if (existingItem) {
        // 已存在，更新数量
        await updateCartItem(existingItem.id, existingItem.quantity + 1);
      } else {
        // 不存在，添加
        await addToCart(productId, 1, this.data.orderType);
      }

      // 刷新购物车
      await this.loadCartList();
      wx.showToast({ title: '已加入购物车' });
    } catch (error) {
      console.error('加入购物车失败:', error);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  /**
   * 减少购物车数量
   */
  async onMinusTap(e: WechatMiniprogram.TouchEvent) {
    const productId = e.currentTarget.dataset.productid as string;

    // 检查登录状态
    if (!this.checkLogin()) return;

    try {
      const { cartList } = this.data;
      const existingItem = cartList.find(item => item.productId === productId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          // 减少数量
          await updateCartItem(existingItem.id, existingItem.quantity - 1);
        } else {
          // 数量为1，删除
          await deleteCartItem(existingItem.id);
        }

        // 刷新购物车
        await this.loadCartList();
      }
    } catch (error) {
      console.error('减少购物车失败:', error);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  /**
   * 购物车栏点击
   */
  onCartBarTap() {
    this.setData({ cartPanelVisible: true });
  },

  /**
   * 遮罩点击
   */
  onMaskTap() {
    this.setData({ cartPanelVisible: false });
  },

  /**
   * 购物车面板减少数量
   */
  async onCartMinusTap(e: WechatMiniprogram.TouchEvent) {
    const cartId = e.currentTarget.dataset.cartid as string;
    const quantity = e.currentTarget.dataset.quantity as number;

    try {
      if (quantity > 1) {
        // 减少数量
        await updateCartItem(cartId, quantity - 1);
      } else {
        // 数量为1，删除
        await deleteCartItem(cartId);
      }

      // 刷新购物车
      await this.loadCartList();
    } catch (error) {
      console.error('更新购物车失败:', error);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  /**
   * 购物车面板增加数量
   */
  async onCartPlusTap(e: WechatMiniprogram.TouchEvent) {
    const cartId = e.currentTarget.dataset.cartid as string;
    const quantity = e.currentTarget.dataset.quantity as number;
    const stock = e.currentTarget.dataset.stock as number;

    // 检查库存
    if (quantity >= stock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }

    try {
      await updateCartItem(cartId, quantity + 1);
      // 刷新购物车
      await this.loadCartList();
    } catch (error) {
      console.error('更新购物车失败:', error);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  /**
   * 清空购物车
   */
  async onClearCartTap() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await clearCart();
            await this.loadCartList();
            this.setData({ cartPanelVisible: false });
            wx.showToast({ title: '购物车已清空' });
          } catch (error) {
            console.error('清空购物车失败:', error);
            wx.showToast({ title: '操作失败，请重试', icon: 'none' });
          }
        }
      }
    });
  },

  /**
   * 去结算
   */
  onCheckoutTap() {
    const { cartTotal, orderType } = this.data;

    if (cartTotal.count === 0) {
      wx.showToast({ title: '请先选择商品', icon: 'none' });
      return;
    }

    // 检查登录状态
    if (!this.checkLogin()) return;

    // 这里可以跳转到订单确认页
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?step=confirm'
    });
  },

  /**
   * 下拉刷新
   */
  async onRefresh() {
    try {
      this.setData({ refreshing: true });
      
      // 重新加载商品和购物车
      await Promise.all([
        this.loadProductList(this.data.currentCategoryId),
        this.loadCartList()
      ]);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      this.setData({ refreshing: false });
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin(): boolean {
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ loginModalVisible: true });
      return false;
    }
    return true;
  },

  /**
   * 关闭登录弹窗
   */
  onLoginModalClose() {
    this.setData({ loginModalVisible: false });
  },

  /**
   * 获取手机号登录
   */
  async handleGetPhoneNumber(e: any) {
    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    try {
      this.setData({ loginLoading: true });

      const code = await new Promise<string>((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) resolve(res.code);
            else reject(new Error('获取登录凭证失败'));
          },
          fail: (err) => reject(err)
        });
      });

      const { encryptedData, iv } = e.detail;
      if (!encryptedData || !iv) {
        throw new Error('获取手机号失败，请重试');
      }

      const phoneResponse = await getPhoneNumber(code, encryptedData, iv);
      const response = await login(code);

      wx.setStorageSync('token', response.token);
      wx.setStorageSync('userInfo', response.userInfo);

      this.setData({
        loginModalVisible: false,
        loginLoading: false
      });

      wx.showToast({ title: '登录成功' });

      // 执行待处理的操作
      if (this.data.pendingAction) {
        this.data.pendingAction();
        this.setData({ pendingAction: null });
      }
    } catch (error) {
      console.error('登录失败:', error);
      this.setData({ loginLoading: false });
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  },

  /**
   * 切换用户协议勾选
   */
  onAgreementToggle() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  /**
   * 查看用户协议
   */
  onViewAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    });
  },

  /**
   * 阻止遮罩层滚动
   */
  preventTouchMove() {
    // 阻止事件冒泡
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '吉世面包 - 新鲜烘焙，美味传递',
      path: '/pages/order/order'
    };
  }
});
