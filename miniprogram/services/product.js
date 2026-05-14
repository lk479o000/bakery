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
/**
 * 获取轮播图列表
 * @returns Promise<Banner[]>
 */
function getBannerList() {
    return (0, request_1.get)('/api/banner/list', {}, false);
}
/**
 * 获取商品分类列表
 * @returns Promise<Category[]>
 */
function getCategoryList() {
    return (0, request_1.get)('/api/category/list', {}, false);
}
/**
 * 获取商品列表
 * @param params 查询参数
 * @returns Promise<ProductListResponse>
 */
function getProductList(params) {
    return (0, request_1.get)('/api/product/list', params, false);
}
/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise<Product>
 */
function getProductDetail(id) {
    return (0, request_1.get)('/api/product/detail', { id }, false);
}
