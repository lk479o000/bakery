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
const cart_1 = require("../../services/cart");
Page({
    data: {
        // 分类相关
        categoryList: [],
        currentCategoryId: '',
        // 商品相关
        productList: [],
        loading: false,
        refreshing: false,
        // 购物车相关
        cartList: [],
        cartTotal: {
            count: 0,
            amount: 0
        },
        cartPanelVisible: false,
        // 订单类型
        orderType: 'pickup'
    },
    onLoad() {
        this.initPage();
    },
    onShow() {
        // 页面显示时刷新购物车
        this.loadCartList();
    },
    /**
     * 初始化页面
     */
    initPage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 读取保存的订单类型
                const savedType = wx.getStorageSync('orderType') || 'pickup';
                this.setData({ orderType: savedType });
                // 并行加载分类和购物车
                const [categoryList] = yield Promise.all([
                    this.loadCategoryList(),
                    this.loadCartList()
                ]);
                // 默认选中第一个分类
                if (categoryList.length > 0) {
                    this.setData({ currentCategoryId: categoryList[0].id });
                    this.loadProductList(categoryList[0].id);
                }
            }
            catch (error) {
                console.error('初始化页面失败:', error);
            }
        });
    },
    /**
     * 加载分类列表
     */
    loadCategoryList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryList = yield (0, product_1.getCategoryList)();
                this.setData({ categoryList });
                return categoryList;
            }
            catch (error) {
                console.error('加载分类失败:', error);
                return [];
            }
        });
    },
    /**
     * 加载商品列表
     */
    loadProductList(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setData({ loading: true });
                const { list } = yield (0, product_1.getProductList)({ categoryId, page: 1, pageSize: 20 });
                // 合并购物车数量
                const productList = this.mergeCartQuantity(list);
                this.setData({ productList, loading: false });
            }
            catch (error) {
                console.error('加载商品失败:', error);
                this.setData({ loading: false });
                wx.showToast({ title: '加载失败，请重试', icon: 'none' });
            }
        });
    },
    /**
     * 加载购物车列表
     */
    loadCartList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = wx.getStorageSync('token');
                if (!token) {
                    this.setData({ cartList: [], cartTotal: { count: 0, amount: 0 } });
                    return;
                }
                const cartList = yield (0, cart_1.getCartList)();
                this.setData({ cartList });
                this.updateCartBar();
                this.updateProductCartQuantity();
            }
            catch (error) {
                console.error('加载购物车失败:', error);
            }
        });
    },
    /**
     * 合并购物车数量到商品列表
     */
    mergeCartQuantity(products) {
        const { cartList } = this.data;
        return products.map(product => {
            const cartItem = cartList.find(item => item.productId === product.id);
            return Object.assign(Object.assign({}, product), { cartQuantity: cartItem ? cartItem.quantity : 0 });
        });
    },
    /**
     * 更新商品列表中的购物车数量
     */
    updateProductCartQuantity() {
        const { productList, cartList } = this.data;
        const updatedProducts = productList.map(product => {
            const cartItem = cartList.find(item => item.productId === product.id);
            return Object.assign(Object.assign({}, product), { cartQuantity: cartItem ? cartItem.quantity : 0 });
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
    onCategoryTap(e) {
        const categoryId = e.currentTarget.dataset.id;
        if (categoryId === this.data.currentCategoryId)
            return;
        this.setData({ currentCategoryId: categoryId });
        this.loadProductList(categoryId);
    },
    /**
     * 订单类型切换
     */
    onOrderTypeChange(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({ orderType: type });
        wx.setStorageSync('orderType', type);
    },
    /**
     * 加入购物车
     */
    onAddTap(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = e.currentTarget.dataset.productid;
            const stock = e.currentTarget.dataset.stock;
            // 检查登录状态
            if (!this.checkLogin())
                return;
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
                    yield (0, cart_1.updateCartItem)(existingItem.id, existingItem.quantity + 1);
                }
                else {
                    // 不存在，添加
                    yield (0, cart_1.addToCart)(productId, 1);
                }
                // 刷新购物车
                yield this.loadCartList();
                wx.showToast({ title: '已加入购物车' });
            }
            catch (error) {
                console.error('加入购物车失败:', error);
                wx.showToast({ title: '操作失败，请重试', icon: 'none' });
            }
        });
    },
    /**
     * 减少购物车数量
     */
    onMinusTap(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = e.currentTarget.dataset.productid;
            // 检查登录状态
            if (!this.checkLogin())
                return;
            try {
                const { cartList } = this.data;
                const existingItem = cartList.find(item => item.productId === productId);
                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        // 减少数量
                        yield (0, cart_1.updateCartItem)(existingItem.id, existingItem.quantity - 1);
                    }
                    else {
                        // 数量为1，删除
                        yield (0, cart_1.deleteCartItem)(existingItem.id);
                    }
                    // 刷新购物车
                    yield this.loadCartList();
                }
            }
            catch (error) {
                console.error('减少购物车失败:', error);
                wx.showToast({ title: '操作失败，请重试', icon: 'none' });
            }
        });
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
    onCartMinusTap(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartId = e.currentTarget.dataset.cartid;
            const quantity = e.currentTarget.dataset.quantity;
            try {
                if (quantity > 1) {
                    // 减少数量
                    yield (0, cart_1.updateCartItem)(cartId, quantity - 1);
                }
                else {
                    // 数量为1，删除
                    yield (0, cart_1.deleteCartItem)(cartId);
                }
                // 刷新购物车
                yield this.loadCartList();
            }
            catch (error) {
                console.error('更新购物车失败:', error);
                wx.showToast({ title: '操作失败，请重试', icon: 'none' });
            }
        });
    },
    /**
     * 购物车面板增加数量
     */
    onCartPlusTap(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartId = e.currentTarget.dataset.cartid;
            const quantity = e.currentTarget.dataset.quantity;
            const stock = e.currentTarget.dataset.stock;
            // 检查库存
            if (quantity >= stock) {
                wx.showToast({ title: '库存不足', icon: 'none' });
                return;
            }
            try {
                yield (0, cart_1.updateCartItem)(cartId, quantity + 1);
                // 刷新购物车
                yield this.loadCartList();
            }
            catch (error) {
                console.error('更新购物车失败:', error);
                wx.showToast({ title: '操作失败，请重试', icon: 'none' });
            }
        });
    },
    /**
     * 清空购物车
     */
    onClearCartTap() {
        return __awaiter(this, void 0, void 0, function* () {
            wx.showModal({
                title: '确认清空',
                content: '确定要清空购物车吗？',
                success: (res) => __awaiter(this, void 0, void 0, function* () {
                    if (res.confirm) {
                        try {
                            yield (0, cart_1.clearCart)();
                            yield this.loadCartList();
                            this.setData({ cartPanelVisible: false });
                            wx.showToast({ title: '购物车已清空' });
                        }
                        catch (error) {
                            console.error('清空购物车失败:', error);
                            wx.showToast({ title: '操作失败，请重试', icon: 'none' });
                        }
                    }
                })
            });
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
        if (!this.checkLogin())
            return;
        // 这里可以跳转到订单确认页
        wx.navigateTo({
            url: '/pages/order-detail/order-detail?step=confirm'
        });
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setData({ refreshing: true });
                // 重新加载商品和购物车
                yield Promise.all([
                    this.loadProductList(this.data.currentCategoryId),
                    this.loadCartList()
                ]);
            }
            catch (error) {
                console.error('刷新失败:', error);
            }
            finally {
                this.setData({ refreshing: false });
            }
        });
    },
    /**
     * 检查登录状态
     */
    checkLogin() {
        const token = wx.getStorageSync('token');
        if (!token) {
            wx.navigateTo({ url: '/pages/login/login' });
            return false;
        }
        return true;
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
