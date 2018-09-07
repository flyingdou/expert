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
      model: { currentTime: util.formatTime(new Date()) }
    })

    // 判断是否通过分享进入
    if (options.model) {
      _this.setData({
        model: JSON.parse(options.model)
      })
    }
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
    // 查询用户数据
    if (wx.getStorageSync('memberId')) {
      _this.getMemberData(wx.getStorageSync('memberId'));
    } else {
      _this.getMemberData(_this.data.model.memberId);
    }
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
    var model = _this.data.model;
    model.memberId = wx.getStorageSync('memberId');
    model.share = true;
    return {
      title: '健身打卡',
      path: 'pages/sign/sign?model=' + JSON.stringify(model)
    }
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
   * 显示提示信息
   */
  showMessage: function () {
    // 修改状态, 根据状态禁用按钮
    _this.setData({ status: 2 });

    // 判断是否输入最高运动心率
    if (!_this.data.model.bmiHigh) {
      wx.showModal({
        title: '提示',
        content: '请输入最高运动心率',
        showCancel: false
      })
    }

    // 判断是否需要用户填写生日数据
    if (!_this.data.memberData.birthday) {
      wx.showModal({
        title: '提示',
        content: '请填写准确出生日期并保存后打卡',
        showCancel: false,
        complete: function () {
          wx.navigateTo({
            url: '../userInfo/userInfo'
          });
        }
      });
    }
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = _this.data.model;
    var paramList = [
      // { key: 'weight', message: '请输入体重' },
      // { key: 'waist', message: '请输入腰围' },
      // { key: 'hip', message: '请输入臀围' },
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
    model.memberId = model.memberId || wx.getStorageSync('memberId');
    return model;
  },

  /**
   * 提交表单
   */
  submitForm: function (e) {
    // 修改状态, 根据状态禁用按钮
    _this.setData({ status: 1 });

    // 判断是否需要用户填写生日数据
    if (!_this.data.memberData.birthday) {
      wx.showModal({
        title: '提示',
        content: '请填写准确出生日期并保存后打卡',
        showCancel: false,
        complete: function () {
          wx.navigateTo({
            url: '../userInfo/userInfo'
          });
        }
      });
      return;
    }

    // 是否是通过分享保存数据标识
    var share = e.currentTarget.dataset.share;
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
        if (!share) { 
          wx.showModal({
            title: '签到成功',
            content: '您已成功打卡，请进入“我的足迹”查看打卡记录。',
            showCancel: false,
            complete: function () {
              wx.navigateTo({
                url: '../myFooter/myFooter'
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: false,
            complete: function () {
              _this.goHome();
            }
          })
        }
      }
    })
  },

  /**
   * 回主页
   */
  goHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  }
})