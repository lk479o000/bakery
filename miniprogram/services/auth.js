"use strict";
/**
 * 认证相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getPhoneNumber = getPhoneNumber;
const request_1 = require("../utils/request");
/**
 * 微信登录
 * @param code 微信登录临时凭证
 * @param phone 手机号（可选）
 * @returns Promise<LoginResponse>
 */
function login(code, phone) {
    return (0, request_1.post)('/api/auth/login', { code, phone }, false);
}
/**
 * 获取手机号
 * @param encryptedData 加密数据
 * @param iv 加密算法的初始向量
 * @returns Promise<{ phone: string }>
 */
function getPhoneNumber(encryptedData, iv) {
    return (0, request_1.post)('/api/auth/phone', {
        encryptedData,
        iv
    });
}
