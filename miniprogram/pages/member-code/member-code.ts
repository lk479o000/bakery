// 会员码页面 - 原生小程序Page写法

import { getUserInfo, getMemberCode } from '../../services/user';
import { MemberCode as MemberCodeType } from '../../types/api';

Page({
  data: {
    // 会员码
    memberCode: null as MemberCodeType | null,

    // 状态
    loading: true,
    error: '' as string,
    isLoggedIn: false,

    // 倒计时
    countdown: 0,
    countdownText: '05:00',
    lastRefreshTime: 0
  },

  // 倒计时定时器
  _countdownTimer: null as ReturnType<typeof setInterval> | null,

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  onHide() {
    this.clearCountdown();
  },

  onUnload() {
    this.clearCountdown();
  },

  /**
   * 检查登录状态
   */
  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ isLoggedIn: false, loading: false });
      return;
    }

    this.setData({ isLoggedIn: true });
    await this.loadMemberCode();
  },

  /**
   * 加载会员码
   */
  async loadMemberCode() {
    try {
      this.setData({ loading: true, error: '' });
      const memberCode = await getMemberCode();
      const countdown = this.calculateCountdown(memberCode.expireTime);

      this.setData({
        memberCode,
        loading: false,
        countdown,
        countdownText: this.formatCountdown(countdown),
        lastRefreshTime: Date.now()
      });

      // 绘制二维码和条形码
      this.drawQrCode(memberCode.code);
      this.drawBarCode(memberCode.code);

      // 启动倒计时
      this.startCountdown();
    } catch (err: any) {
      let errorMessage = '系统错误，请稍后重试';
      if (err.statusCode === 401) {
        errorMessage = '登录已过期，请重新登录';
        this.setData({ isLoggedIn: false });
      } else if (err.statusCode === 403) {
        errorMessage = '您暂无会员码权限';
      }

      this.setData({
        loading: false,
        error: errorMessage,
        memberCode: null
      });
    }
  },

  /**
   * 刷新会员码
   */
  async refreshMemberCode() {
    const now = Date.now();
    if (now - this.data.lastRefreshTime < 10000) {
      wx.showToast({ title: '刷新过于频繁，请稍后再试', icon: 'none' });
      return;
    }
    await this.loadMemberCode();
    wx.showToast({ title: '会员码已刷新', icon: 'success' });
  },

  /**
   * 绘制二维码（简单矩阵点阵）
   */
  drawQrCode(code: string) {
    const query = wx.createSelectorQuery();
    query.select('#qrcodeCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const size = 400;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        // 白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // 生成伪随机矩阵模拟二维码
        const cellSize = 8;
        const cols = Math.floor(size / cellSize);
        const seed = this.hashCode(code);
        let rng = seed;

        const nextRand = () => {
          rng = (rng * 1103515245 + 12345) & 0x7fffffff;
          return rng / 0x7fffffff;
        };

        ctx.fillStyle = '#333333';

        // 三个定位角
        this.drawFinderPattern(ctx, 2 * cellSize, 2 * cellSize, cellSize);
        this.drawFinderPattern(ctx, (cols - 9) * cellSize, 2 * cellSize, cellSize);
        this.drawFinderPattern(ctx, 2 * cellSize, (cols - 9) * cellSize, cellSize);

        // 数据区域
        for (let row = 0; row < cols; row++) {
          for (let col = 0; col < cols; col++) {
            // 跳过定位角区域
            if ((row < 10 && col < 10) || (row < 10 && col > cols - 11) || (row > cols - 11 && col < 10)) continue;
            if (nextRand() > 0.55) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }
      });
  },

  /**
   * 绘制定位角图案
   */
  drawFinderPattern(ctx: any, x: number, y: number, cell: number) {
    // 外框 7x7
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, 7 * cell, 7 * cell);
    // 内白 5x5
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cell, y + cell, 5 * cell, 5 * cell);
    // 中心 3x3
    ctx.fillStyle = '#333333';
    ctx.fillRect(x + 2 * cell, y + 2 * cell, 3 * cell, 3 * cell);
  },

  /**
   * 简单哈希函数
   */
  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },

  /**
   * 绘制条形码
   */
  drawBarCode(code: string) {
    const query = wx.createSelectorQuery();
    query.select('#barcodeCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const width = 500;
        const height = 120;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // 白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // 根据code生成条形码纹理
        ctx.fillStyle = '#333333';
        let x = 20;
        for (let i = 0; i < code.length && x < width - 20; i++) {
          const charCode = code.charCodeAt(i);
          const barWidths = this.getBarPattern(charCode);
          for (let j = 0; j < barWidths.length; j++) {
            if (barWidths[j] === 1) {
              ctx.fillRect(x, 10, 2, height - 20);
            }
            x += 3;
          }
          // 字符间隔
          x += 2;
        }
      });
  },

  /**
   * 获取条形码条纹模式
   */
  getBarPattern(charCode: number): number[] {
    const patterns = [
      [0, 0, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 1, 0, 0], [0, 0, 1, 0, 0, 1, 1], [1, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 0], [0, 0, 1, 1, 0, 1, 0], [1, 1, 0, 1, 0, 1, 1],
      [0, 1, 0, 1, 1, 0, 1]
    ];
    return patterns[charCode % patterns.length];
  },

  /**
   * 计算倒计时秒数
   */
  calculateCountdown(expireTime: number): number {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, expireTime - now);
  },

  /**
   * 启动倒计时
   */
  startCountdown() {
    this.clearCountdown();
    this._countdownTimer = setInterval(() => {
      const newCountdown = this.data.countdown - 1;
      if (newCountdown <= 0) {
        this.clearCountdown();
        this.loadMemberCode();
        return;
      }
      this.setData({
        countdown: newCountdown,
        countdownText: this.formatCountdown(newCountdown)
      });
    }, 1000);
  },

  /**
   * 清除倒计时
   */
  clearCountdown() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  },

  /**
   * 格式化倒计时
   */
  formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  /**
   * 跳转到登录页
   */
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});