/**
 * 本地存储封装
 */

const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';
const ORDER_TYPE_KEY = 'orderType';
const SELECTED_STORE_KEY = 'selectedStore';

/**
 * 设置存储
 */
function setStorage(key: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data,
      success: () => resolve(),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 获取存储
 */
function getStorage<T = any>(key: string): T | null {
  try {
    return wx.getStorageSync(key) as T || null;
  } catch {
    return null;
  }
}

/**
 * 删除存储
 */
function removeStorage(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key,
      success: () => resolve(),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 清除所有存储
 */
function clearStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.clearStorage({
      success: () => resolve(),
      fail: (err) => reject(err)
    });
  });
}

// Token 相关
export function getToken(): string {
  return getStorage<string>(TOKEN_KEY) || '';
}

export function setToken(token: string): Promise<void> {
  return setStorage(TOKEN_KEY, token);
}

export function removeToken(): Promise<void> {
  return removeStorage(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// 用户信息相关
export function getUserInfoStorage(): any {
  return getStorage(TOKEN_KEY);
}

export function setUserInfoStorage(userInfo: any): Promise<void> {
  return setStorage(USER_INFO_KEY, userInfo);
}

export function removeUserInfoStorage(): Promise<void> {
  return removeStorage(USER_INFO_KEY);
}

// 订单类型相关
export function getOrderType(): string {
  return getStorage<string>(ORDER_TYPE_KEY) || 'pickup';
}

export function setOrderType(type: string): Promise<void> {
  return setStorage(ORDER_TYPE_KEY, type);
}

// 选中门店相关
export function getSelectedStore(): any {
  return getStorage(SELECTED_STORE_KEY);
}

export function setSelectedStore(store: any): Promise<void> {
  return setStorage(SELECTED_STORE_KEY, store);
}

// 登录信息清除
export async function clearLoginInfo(): Promise<void> {
  await Promise.all([
    removeToken(),
    removeUserInfoStorage()
  ]);
}

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getToken,
  setToken,
  removeToken,
  isLoggedIn,
  getUserInfoStorage,
  setUserInfoStorage,
  removeUserInfoStorage,
  getOrderType,
  setOrderType,
  getSelectedStore,
  setSelectedStore,
  clearLoginInfo
};
