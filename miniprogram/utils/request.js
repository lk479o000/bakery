"use strict";
/**
 * HTTP请求封装工具
 * 基于微信小程序原生 wx.request
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = request;
exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.uploadFile = uploadFile;
// 基础配置
const BASE_URL = 'http://localhost:3001/api'; // 实际使用时替换为真实API地址
const TIMEOUT = 10000; // 10秒超时
/**
 * 统一请求封装
 * @param options 请求配置
 * @returns Promise
 */
function request(options) {
    return new Promise((resolve, reject) => {
        const { url, method = 'GET', data, header = {}, needAuth = true } = options;
        // 构建完整URL
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        // 构建请求头
        const requestHeader = Object.assign({ 'Content-Type': 'application/json' }, header);
        // 如果需要认证，添加token
        if (needAuth) {
            const token = wx.getStorageSync('token');
            if (token) {
                requestHeader['Authorization'] = `Bearer ${token}`;
            }
        }
        // 发起请求
        wx.request({
            url: fullUrl,
            method: method,
            data,
            header: requestHeader,
            timeout: TIMEOUT,
            success: (res) => {
                const response = res.data;
                // 处理成功响应
                if (response.code === 200) {
                    resolve(response.data);
                }
                else if (response.code === 401) {
                    // 401未授权，清除token并跳转到登录页
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    // 跳转到登录页
                    wx.navigateTo({
                        url: '/pages/login/login'
                    });
                    reject(new Error(response.message || '未登录或登录已过期'));
                }
                else {
                    // 其他错误
                    reject(new Error(response.message || '请求失败'));
                }
            },
            fail: (err) => {
                // 网络错误等
                reject(new Error('网络错误，请检查网络连接'));
            }
        });
    });
}
/**
 * GET请求快捷方法
 */
function get(url, data, needAuth = true) {
    return request({
        url,
        method: 'GET',
        data,
        needAuth
    });
}
/**
 * POST请求快捷方法
 */
function post(url, data, needAuth = true) {
    return request({
        url,
        method: 'POST',
        data,
        needAuth
    });
}
/**
 * PUT请求快捷方法
 */
function put(url, data, needAuth = true) {
    return request({
        url,
        method: 'PUT',
        data,
        needAuth
    });
}
/**
 * DELETE请求快捷方法
 */
function del(url, data, needAuth = true) {
    return request({
        url,
        method: 'DELETE',
        data,
        needAuth
    });
}
/**
 * 上传文件
 * @param url 上传地址
 * @param filePath 文件路径
 * @param name 文件字段名
 * @param formData 额外参数
 * @returns Promise
 */
function uploadFile(url, filePath, name = 'file', formData) {
    return new Promise((resolve, reject) => {
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        const token = wx.getStorageSync('token');
        const header = {};
        if (token) {
            header['Authorization'] = `Bearer ${token}`;
        }
        wx.uploadFile({
            url: fullUrl,
            filePath,
            name,
            formData,
            header,
            success: (res) => {
                try {
                    const data = JSON.parse(res.data);
                    if (data.code === 200) {
                        resolve(data.data);
                    }
                    else if (data.code === 401) {
                        // 401处理
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('userInfo');
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                        reject(new Error(data.message || '未登录或登录已过期'));
                    }
                    else {
                        reject(new Error(data.message || '上传失败'));
                    }
                }
                catch (error) {
                    reject(new Error('解析响应数据失败'));
                }
            },
            fail: (err) => {
                reject(new Error('上传失败'));
            }
        });
    });
}
