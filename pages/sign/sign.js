var app = getApp();
var util = require('../../utils/util.js');
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [
      { text: '体重', company: 'kg', key: 'weight' },
      { text: '腰围', company: 'cm', key: 'waist' },
      { text: '臀围', company: 'cm', key: 'hip' },
      { text: '最高运动心率', company: '次/分钟', key: 'bmiHigh' }
    ],
    model: {}
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
  },

  /**
   * 保存表单数据
   */
  saveFormData: function (e) {
    var key = e.currentTarget.dataset.key;
    var model = _this.data.model;
    model[key] = e.detail.value;
    _this.setData({
      model: model
    })
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = _this.data.model;
    var paramList = [
      { key: 'weight', message: '请输入体重' },
      { key: 'waist', message: '请输入腰围' },
      { key: 'hip', message: '请输入臀围' },
      { key: 'bmiHigh', message: '请输入最高运动心率' }
    ];
    for (var item of paramList) {
      if (!model[item.key] || model[item.key] == '') {
        wx.showModal({
          title: '提示',
          content: item.message,
          showCancel: false
        })
        return false;
      }
    }
    model.memberId = wx.getStorageSync('memberId');
    return model;
  },

  /**
   * 提交表单
   */
  submitForm: function () {
    var model = _this.checkForm();
    if (!model) {
      return;
    }
    wx.request({
      url: app.request_url + "sign.asp",
      data: {
        json: encodeURI(JSON.stringify(model))
      },
      success: function (res) {
        wx.showModal({
          title: '签到成功',
          content: '欢迎您在本次服务结束后，提出您的宝贵意见。',
          showCancel: false,
          complete: function () {
            wx.navigateTo({
              url: '../myFooter/myFooter'
            })
          }
        })
      }
    })
  }
})