var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expert_img_url: app.constants.expert_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    // if (!wx.getStorageSync('memberId')) {
    //   wx.reLaunch({
    //     url: '../mine/mine?source=giveRose'
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index?shareMember=' + wx.getStorageSync('memberId')
    }
  },

  /**
   * wxml绑定函数: 分享朋友圈按钮点击绑定(到我的二维码页面)
   */
  bindShareCircleButtonTap: function () {
    wx.navigateTo({
      url: '../myQRCode/myQRCode'
    })
  }
})