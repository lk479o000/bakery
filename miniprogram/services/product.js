"use strict";
/**
 * 商品相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannerList = getBannerList;
exports.getCategoryList = getCategoryList;
exports.getProductList = getProductList;
exports.getProductDetail = getProductDetail;
const request_1 = require("../utils/request");
function buildOrderQuery(orderType) {
    if (!orderType) {
        return {};
    }
    return { order_type: orderType };
}
/**
 * 获取轮播图列表
 * @returns Promise<Banner[]>
 */
function getBannerList() {
    return (0, request_1.get)('/api/banner/list', {}, false);
}
/**
 * 获取商品分类列表
 */
function getCategoryList(params) {
    return (0, request_1.get)('/api/category/list', buildOrderQuery(params === null || params === void 0 ? void 0 : params.orderType), false);
}
/**
 * 获取商品列表
 */
function getProductList(params) {
    const q = Object.assign(Object.assign({}, buildOrderQuery(params === null || params === void 0 ? void 0 : params.orderType)), {});
    if (params === null || params === void 0 ? void 0 : params.categoryId) {
        q.category_id = params.categoryId;
    }
    if ((params === null || params === void 0 ? void 0 : params.page) !== undefined) {
        q.page = params.page;
    }
    if ((params === null || params === void 0 ? void 0 : params.pageSize) !== undefined) {
        q.pageSize = params.pageSize;
    }
    return (0, request_1.get)('/api/product/list', q, false);
}
/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise<Product>
 */
function getProductDetail(id) {
    return (0, request_1.get)('/api/product/detail', { id }, false);
}
