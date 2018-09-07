var app = getApp();
var util = require('../../utils/util.js');
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderSelector: [ 
      { text: '男', code: 'M' },
      { text: '女', code: 'F' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

    _this.getMemberData(wx.getStorageSync('memberId'));
    _this.getLastTrainRecord();
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
   * 查询当前用户的数据
   */
  getMemberData: function (memberId) {
    // 发起网络请求
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify({ memberId: memberId }))
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
   * 查询最新训练日志
   */
  getLastTrainRecord: function () {
    wx.request({
      url: app.request_url + 'getLastTrainRecord.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        setTimeout(function () {
          var memberData = _this.data.memberData;
          var trainRcord = res.data;
          var model = {
            birthday: memberData.birthday,
            gender: memberData.sex,
            height: trainRcord.height,
            heart: trainRcord.heart,
            bmiLow: trainRcord.bmiLow,
            bmiHigh: trainRcord.bmiHigh
          }
          if (!model.birthday || model.birthday == '') {
            // 如果没有生日默认当前时间减20年
            var time = new Date().getTime() - (20 * 365 * 24 * 60 * 60 * 1000);
            model.birthday = util.formatDate(new Date(time));
          }
          if (!model.gender || model.gender == '') {
            model.gender = '男';
          }
          _this.setData({
            model: model
          });
        }, 100);
      }
    })
  },

  /**
   * 获取用户手机号
   */
  getPhoneNumber: function (e) {
    wx.showLoading({
      mask: 'true'
    })
    e.session_key = wx.getStorageSync("session_key");
    wx.request({
      url: app.request_url + 'decodePhoneNumber.asp',
      data: {
        json: JSON.stringify(e)
      },
      success: function (res) {
        var model = _this.data.model;
        // 获取用户手机号
        model.mobilephone = res.data.phoneNumber;
        // 更新UI显示
        _this.setData({
          model: model
        });
        // 隐藏加载动画
        wx.hideLoading();
      }
    });
  },

  /**
   * 保存表单数据
   */
  saveFormData: function (e) {
    var model = _this.data.model;
    var key = e.currentTarget.dataset.key;
    var type = e.currentTarget.dataset.type;
    var value = type != 'selector' ? e.detail.value : 
      _this.data.genderSelector[e.detail.value].text;
    model[key] = value;
    _this.setData({ model: model });
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = _this.data.model;
    var paramList = [
      { key: 'height', message: '请输入身高' }
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
      url: app.request_url + 'saveMemberData.asp',
      data: {
        json: encodeURI(JSON.stringify(model))
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '保存成功',
          showCancel: false,
          complete: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  }
})