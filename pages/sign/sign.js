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
      });
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
    if (!wx.getStorageSync('memberId')) {
      // 获取登录code
      wx.login({
        success: function (res) {
          _this.data.code = res.code;
        }
      });
    }

    // 查询用户数据
    if (_this.data.model.memberId) {
      _this.getMemberData(_this.data.model.memberId);
    } else {
      _this.getMemberData(wx.getStorageSync('memberId'));
    }

    // 查询当天是否打过卡
    _this.getSign();
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
    var memberNick = _this.data.memberData.nickName;
    model.memberId = wx.getStorageSync('memberId');
    model.share = true;
    return {
      title: `“${memberNick}” 请您监督TA的健身打卡记录`,
      path: 'pages/sign/sign?model=' + JSON.stringify(model)
    }
  },

  /**
   * wechatLogin
   */
  wechatLogin: function (e) {
    var objx = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      // 获取code
      e.detail.code = objx.data.code;

      // 判断是否从他人分享的连接进来的
      var shareMember = app.constants.shareMember;
      if (shareMember > 0) {
        e.detail.shareMember = shareMember;
      }

      // 判断是否从百度广告小程序码进入
      var originType = app.constants.originType;
      if (originType && originType != '') {
        e.detail.originType = originType;
      }

      // 请求登录后台
      wx.request({
        url: app.wechat_login_url + 'wechatLogin.asp',
        dataType: JSON,
        data: {
          json: JSON.stringify(e.detail)
        },
        success: function (res) {
          // 网络请求成功
          res = JSON.parse(res.data);
          if (res.success) {
            app.globalData.userInfo = e.detail.userInfo;
            // 登录成功，将数据存储起来
            wx.setStorageSync("memberId", res.key);
            wx.setStorageSync("session_key", res.session_key);
            wx.setStorageSync("openId", res.openid);

            // 判断用户确认操作还是取消操作
            var success = e.currentTarget.dataset.success;
            if (success == 1) {
              objx.submitForm(res.key);
            } else {
              objx.cancal(res.key);
            }
            _this.setData({
              loginStatus: true
            });
          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
              showCancel: false
            })
          }
        },
        error: function (e) {
          // 网络请求失败
          wx.showModal({
            title: '提示',
            content: '网络异常',
            showCancel: false
          })
          return;
        }
      })
    } else {
      this.submitForm();
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
   * 查询当天是否打过卡
   */
  getSign: function () {
    var param = {
      memberId: _this.data.model.memberId || wx.getStorageSync('memberId')
    }
    wx.request({
      url: app.request_url + 'getSign.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        _this.setData({
          sign: parseInt(res.data.sign)
        });
      }
    });
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

    // 当天已经打过卡, 不能再打卡
    if (_this.data.sign) {
      wx.showModal({
        title: '提示',
        content: '今日已经打过卡, 请明天再来',
        showCancel: false
      });
      return;
    }

    // 判断是否输入最高运动心率
    if (!_this.data.model.bmiHigh) {
      wx.showModal({
        title: '提示',
        content: '请输入最高运动心率',
        showCancel: false
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
  submitForm: function (shareMember) {
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

    // 当天已经打过卡, 不能再打卡
    if (_this.data.sign) {
      wx.showModal({
        title: '提示',
        content: '今日已经打过卡, 请明天再来',
        showCancel: false
      });
      return;
    }

    // 是否是通过分享保存数据标识
    var model = _this.checkForm();
    if (!model) {
      return;
    }
    if (shareMember) {
      model.shareMember = shareMember;
    }
    wx.request({
      url: app.request_url + "sign.asp",
      data: {
        json: encodeURI(JSON.stringify(model))
      },
      success: function (res) {
        if (isNaN(shareMember)) { 
          // 标识已经打过卡
          _this.setData({ sign: 1});
          wx.showModal({
            title: '签到成功',
            content: '您已成功打卡，请进入“我的足迹”查看打卡记录。',
            showCancel: false,
            complete: function () {
              wx.navigateTo({
                url: '../myFooter/myFooter'
              })
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: false,
            complete: function () {
              _this.goHome();
            }
          });
        }
      }
    });
  },

  /**
   * 用户取消操作
   */
  cancal: function (shareMember) {
    var param = { shareMember: shareMember }
    wx.request({
      url: app.request_url + 'cancal.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function () {
        _this.goHome();
      }
    });
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