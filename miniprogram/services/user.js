"use strict";
/**
 * 用户相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
exports.updateUserInfo = updateUserInfo;
exports.getMemberCode = getMemberCode;
const request_1 = require("../utils/request");
/**
 * 获取用户信息
 * @returns Promise<UserInfo>
 */
function getUserInfo() {
    return (0, request_1.get)('/api/user/info');
}
/**
 * 更新用户信息
 * @param data 用户信息
 * @returns Promise<UserInfo>
 */
function updateUserInfo(data) {
    return (0, request_1.put)('/api/user/info', data);
}
/**
 * 获取会员码
 * @returns Promise<MemberCode>
 */
function getMemberCode() {
    return (0, request_1.get)('/api/member/code');
}
