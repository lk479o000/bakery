"use strict";
/**
 * 余额相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeBalance = rechargeBalance;
exports.getBalanceRecords = getBalanceRecords;
const request_1 = require("../utils/request");
/**
 * 余额充值
 * @param amount 充值金额
 * @param payType 支付方式：wechat-微信支付
 * @returns Promise<{ payParams: PayParams }>
 */
function rechargeBalance(amount, payType = 'wechat') {
    return (0, request_1.post)('/api/balance/recharge', {
        amount,
        payType
    });
}
/**
 * 获取余额明细
 * @param params 查询参数
 * @returns Promise<BalanceRecordResponse>
 */
function getBalanceRecords(params) {
    return (0, request_1.get)('/api/balance/records', params);
}
