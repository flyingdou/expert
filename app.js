//app.js
App({
  onLaunch: function () {
    // 小程序初始化
    wx.removeStorageSync('memberId');
  },
  globalData: {
    userInfo: null
  },

  /**
   * 全局常量
   */
  constants: {
    expert_img_url: 'https://www.ecartoon.com.cn/expert/img/'
  }
})