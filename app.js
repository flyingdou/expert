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
    shareMember: 0,
    expert_img_url: 'https://www.ecartoon.com.cn/expert/img/'
  },
  
  /**
     * 请求服务器URL 
     */
  wechat_login_url: 'https://www.ecartoon.com.cn/loginex!',

  /**
   * 请求服务器URL 
   */
  request_url: 'https://www.ecartoon.com.cn/expertex!'
})