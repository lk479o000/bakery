Page({
  data: {
    agreementTitle: '',
    agreementContent: '',
    showDetail: false
  },

  onLoad(options: { type?: string }) {
    if (options?.type) {
      this.loadAgreement(options.type);
    }
  },

  async onViewAgreement(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as string;
    await this.loadAgreement(type);
    this.setData({ showDetail: true });
  },

  async loadAgreement(type: string) {
    try {
      const fileMap: Record<string, string> = {
        user: '/assets/agreements/user-agreement.json',
        privacy: '/assets/agreements/privacy-policy.json',
        member: '/assets/agreements/member-agreement.json'
      };

      const filePath = fileMap[type] || fileMap.user;
      const res = await wx.getFileSystemManager().readFile({
        filePath,
        encoding: 'utf8'
      });

      const data = JSON.parse(res.data);
      this.setData({
        agreementTitle: data.title,
        agreementContent: data.content
      });
    } catch (error) {
      console.error('加载协议失败:', error);
      this.setData({
        agreementTitle: '协议加载失败',
        agreementContent: '<p>协议内容加载失败，请稍后重试</p>'
      });
    }
  },

  closeDetail() {
    this.setData({ showDetail: false });
  }
});