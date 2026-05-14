import { login, getPhoneNumber } from '../../services/auth';

Page({
  data: {
    // 状态相关
    loading: false,
    errorMessage: '',
    
    // 登录方式
    loginType: 'wechat' as 'wechat' | 'phone',
    
    // 手机号登录相关
    phone: '',
    code: '',
    countDown: 0,
    
    // 其他
    redirectUrl: ''
  },

  onLoad(options: any) {
    this.setData({
      loading: false,
      errorMessage: '',
      loginType: 'wechat',
      phone: '',
      code: '',
      countDown: 0,
      redirectUrl: options.redirectUrl || ''
    });

    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    
    if (token) {
      this.redirectAfterLogin();
      return true;
    }
    
    return false;
  },

  /**
   * 微信登录
   */
  async handleWechatLogin() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      
      const code = await new Promise<string>((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取登录凭证失败'));
            }
          },
          fail: (err) => reject(err)
        });
      });
      
      const response = await login(code);
      
      wx.setStorageSync('token', response.token);
      wx.setStorageSync('userInfo', response.userInfo);
      
      this.redirectAfterLogin();
    } catch (error) {
      this.showError((error as Error).message || '登录失败，请重试');
    }
  },

  /**
   * 获取手机号登录
   */
  async handleGetPhoneNumber(e: any) {
    try {
      this.setData({ loading: true, errorMessage: '' });
      
      const code = await new Promise<string>((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取登录凭证失败'));
            }
          },
          fail: (err) => reject(err)
        });
      });
      
      const { encryptedData, iv } = e.detail;
      if (!encryptedData || !iv) {
        throw new Error('获取手机号失败，请重试');
      }
      
      const phoneResponse = await getPhoneNumber(code, encryptedData, iv);
      
      const response = await login(code);
      
      wx.setStorageSync('token', response.token);
      wx.setStorageSync('userInfo', response.userInfo);
      
      this.redirectAfterLogin();
    } catch (error) {
      this.showError((error as Error).message || '登录失败，请重试');
    }
  },

  /**
   * 登录成功后跳转
   */
  redirectAfterLogin() {
    const { redirectUrl } = this.data;
    
    if (redirectUrl) {
      wx.redirectTo({
        url: redirectUrl,
        success: () => {
          wx.showToast({ title: '登录成功' });
        }
      });
    } else {
      wx.navigateBack({
        delta: 1,
        success: () => {
          wx.showToast({ title: '登录成功' });
        },
        fail: () => {
          wx.switchTab({ url: '/pages/index/index' });
        }
      });
    }
  },

  /**
   * 显示错误信息
   */
  showError(message: string) {
    this.setData({ 
      errorMessage: message,
      loading: false 
    });
    
    setTimeout(() => {
      this.setData({ errorMessage: '' });
    }, 3000);
  }
});
