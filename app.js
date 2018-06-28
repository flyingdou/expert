//app.js
App({
  onLaunch: function () {
    // 小程序初始化
    wx.removeStorageSync('memberId');
  },
  globalData: {
    userInfo: null
  }
})