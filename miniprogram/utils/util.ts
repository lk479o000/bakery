/**
 * 通用工具函数
 */

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数
 */
export function formatAmount(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals);
}

/**
 * 格式化时间
 * @param date 日期对象或时间戳
 * @param format 格式化模板
 */
export function formatTime(date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 格式化手机号
 * @param phone 手机号
 */
export function formatPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
}

/**
 * 防抖
 * @param fn 函数
 * @param delay 延迟时间
 */
export function debounce(fn: Function, delay: number = 300): Function {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流
 * @param fn 函数
 * @param interval 间隔时间
 */
export function throttle(fn: Function, interval: number = 300): Function {
  let lastTime = 0;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 手机号校验
 * @param phone 手机号
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 复制到剪贴板
 * @param text 文本内容
 */
export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'success' });
        resolve();
      },
      fail: (err) => reject(err)
    });
  });
}

/**
 * 拨打电话
 * @param phone 电话号码
 */
export function makePhoneCall(phone: string): void {
  wx.makePhoneCall({
    phoneNumber: phone,
    fail: () => {
      wx.showToast({ title: '拨打失败', icon: 'none' });
    }
  });
}

/**
 * 打开地图导航
 * @param latitude 纬度
 * @param longitude 经度
 * @param name 位置名称
 * @param address 详细地址
 */
export function openNavigation(latitude: number, longitude: number, name: string, address: string): void {
  wx.openLocation({
    latitude,
    longitude,
    name,
    address,
    scale: 16
  });
}

/**
 * 计算两点之间距离（km）
 * @param lat1 纬度1
 * @param lng1 经度1
 * @param lat2 纬度2
 * @param lng2 经度2
 */
export function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const a = radLat1 - radLat2;
  const b = (lng1 * Math.PI) / 180 - (lng2 * Math.PI) / 180;
  let distance = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
    )
  );
  distance = distance * 6378.137; // 地球半径
  distance = Math.round(distance * 100) / 100;
  return distance.toFixed(2);
}

export default {
  formatAmount,
  formatTime,
  formatPhone,
  debounce,
  throttle,
  isValidPhone,
  copyToClipboard,
  makePhoneCall,
  openNavigation,
  calcDistance
};
