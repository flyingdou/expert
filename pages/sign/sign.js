var app = getApp();
var util = require('../../utils/util.js');
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [
      { text: '体重', company: 'kg' },
      { text: '腰围', company: 'cm' },
      { text: '臀围', company: 'cm' },
      { text: '最高运动心率', company: '次/分钟' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

    // 获取当前系统时间
    _this.setData({
      currentTime: util.formatTime(new Date())
    })

    // 查询用户数据
    _this.getMemberData(wx.getStorageSync('memberId') || options.memberId);
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

  },

  /**
   * 查询当前用户的数据
   */
  getMemberData: function (memberId) {
    // 发起网络请求
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify({memberId: memberId}))
      },
      success: function (res) {
        // 请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 用户数据请求成功
          var mobilephone = res.memberData.mobilephone;
          var mobileValid = res.memberData.mobileValid;
          var hasMobilephone = 0;
          if (mobilephone && "" != mobilephone && "null" != mobilephone && "undefined" != mobilephone && mobileValid && "" != mobileValid && "null" != mobileValid && "undefined" != mobileValid) {
            // 手机号存在，且已验证
            hasMobilephone = 1;
          }
          // 获取数据成功
          _this.setData({
            memberData: res.memberData,
            hasMobilephone: hasMobilephone
          })
        } else {
          // 程序异常
          wx.showModal({
            title: "提示",
            content: res.message,
            showCancel: false
          })
        }
      },
      error: function (e) {
        // 请求失败
        wx.showModal({
          title: "提示",
          content: "网络异常",
          showCancel: false
        })
      }
    })
  }
})