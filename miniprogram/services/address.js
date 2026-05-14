"use strict";
/**
 * 地址相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressList = getAddressList;
exports.addAddress = addAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
exports.setDefaultAddress = setDefaultAddress;
const request_1 = require("../utils/request");
/**
 * 获取地址列表
 * @returns Promise<Address[]>
 */
function getAddressList() {
    return (0, request_1.get)('/api/address/list');
}
/**
 * 添加收货地址
 * @param data 地址信息
 * @returns Promise<{ id: string }>
 */
function addAddress(data) {
    return (0, request_1.post)('/api/address/add', data);
}
/**
 * 更新收货地址
 * @param addressId 地址ID
 * @param data 地址信息
 * @returns Promise<void>
 */
function updateAddress(addressId, data) {
    return (0, request_1.put)('/api/address/update', Object.assign({ addressId }, data));
}
/**
 * 删除收货地址
 * @param addressId 地址ID
 * @returns Promise<void>
 */
function deleteAddress(addressId) {
    return (0, request_1.del)('/api/address/delete', { addressId });
}
/**
 * 设置默认地址
 * @param addressId 地址ID
 * @returns Promise<void>
 */
function setDefaultAddress(addressId) {
    return (0, request_1.put)('/api/address/default', { addressId });
}
