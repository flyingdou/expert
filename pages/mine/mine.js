import regeneratorRuntime from '../../utils/runtime.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberData: {
      image: "1.jpg"
    },
    login_button: true,
    hasMobilephone: 0,
    hasLogin: 0,
    base_img_url: 'https://fish.ecartoon.com.cn/static/img'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var objx = this;
    // 获取加载页面参数
    var source = options.source;
    var param = options.param;

    // 来源页面
    if (source) {
      objx.setData({
        source: source
      })
    }

    // 来源页面携带的功能参数
    if (param) {
      objx.setData({
        param: param
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var objx = this;
    objx.checkOnShow();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 查询当前用户的数据
   */
  getMemberData: function() {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var param = {};
    param.memberId = memberId;

    // 发起网络请求
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function(res) {
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
          objx.setData({
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
      error: function(e) {
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
   * 去个人信息页面
   */
  gotoUserInfo: function () {
    wx.navigateTo({
      url: '../userInfo/userInfo'
    })
  },

  /**
   * 去我的足迹页面
   */
  gotoMyFooter: function () {
    wx.navigateTo({
      url: '../myFooter/myFooter'
    })
  },

  /**
   * 查看我的订单
   */
  gotoMyOrder: function() {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/myOrder/myOrder",
    })
  },

  /**
   * 查看我的钱包
   */
  gotoMyWallet: function() {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/myWallet/myWallet",
    })
  },

  /**
   * 查看我的挑战
   */
  gotoMyActive: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/myActive/myActive",
    })
  },

  /**
   * 查看我的优惠券
   */
  gotoMyTicke: function() {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/ticket/ticket",
    })
  },

  /**
   * 查看我的分享订单
   */
  gotoMyShareOrder: function() {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: '../../pages/myShareOrder/myShareOrder',
    })
  },

  /**
   * check进入页面时，是否已经登录
   */
  checkOnShow: function() {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    if (!memberId || memberId == "") {
      // 用户未登录，设置登录按钮可用
      wx.login({
        success: function(login_res) {
          objx.setData({
            login_button: true,
            code: login_res.code
          })
        }
      })

    } else {
      // 用户已登录，移除登录按钮
      objx.getMemberData();
      objx.setData({
        login_button: false,
        hasLogin: 1
      })
    }
  },

  /**
   * 点击功能时，检查登录状态
   */
  checkOnFun: function() {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    if (!memberId || memberId == "") {
      wx.showModal({
        title: '提示',
        content: '本小程序需要登录使用，请点击上面的“登录”按钮，用微信号登录获得完整体验。',
        showCancel: false,
        complete: function() {
          return false;
        }
      })
    } else {
      return true;
    }

  },


  /**
   * wechatLogin
   */
  wechatLogin: function(e) {
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
        success: function(res) {
          // 网络请求成功
          res = JSON.parse(res.data);
          if (res.success) {
            app.globalData.userInfo = e.detail.userInfo;
            // 登录成功，将数据存储起来
            wx.setStorageSync("memberId", res.key);
            wx.setStorageSync("session_key", res.session_key);
            wx.setStorageSync("openId", res.openid);
            objx.setData({
              hasLogin: 1
            })
            // 登录成功，判断是relaunch过来的，还是用户主动点击tabBar过来的
            var source = objx.data.source;
            if (!source) {
              // 查询用户数据
              objx.getMemberData();
            }

            // 跳转到来时的页面
            if (source) {
              var param = objx.data.param;
              var reUrl = '../../pages/' + source + '/' + source;
              if (param) {
                reUrl = reUrl + '?param=' + param;
              }
              wx.reLaunch({
                url: reUrl,
              })
            }



          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
              showCancel: false
            })
          }

          // 移除登录按钮
          objx.setData({
            login_button: false
          })
        },
        error: function(e) {
          // 网络请求失败
          wx.showModal({
            title: '提示',
            content: '网络异常',
            showCancel: false
          })
          return;
        }

      })
    }
  },

  /**
   * 获取手机号
   */
  getPhoneNumber: function(e) {
    var objx = this;
    // 去后台解密手机号
    var session_key = wx.getStorageSync("session_key");
    e.session_key = session_key;
    wx.request({
      url: app.request_url + 'decodePhoneNumber.asp',
      dataType: JSON,
      data: {
        json: JSON.stringify(e)
      },
      success: function(res) {
        console.log(res);
        // 网络请求成功
        res = JSON.parse(res.data);
        // 数据请求成功
        var hasMobilephone = 1;
        objx.setData({
          hasMobilephone: hasMobilephone
        })

        console.log(res.phoneNumber);

        // 更新用户的手机号
        objx.updatePhoneNumber(res.phoneNumber);


      },
      error: function(e) {
        // 网络异常
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel: false
        })
      }
    })

  },

  /**
   * 更新用户手机号
   */
  updatePhoneNumber: function(phoneNumber) {
    // 去后台更新用户的手机号信息
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var param = {
      memberId: memberId,
      mobilephone: phoneNumber
    };

    // 请求后台数据
    wx.request({
      url: app.request_url + 'updateMobilephone.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function(res) {
        res = JSON.parse(res.data);
        if (res.success) {
          // 请求成功
          console.log("更新手机号成功");
        } else {
          // 程序异常
          console.log(res.message);
        }
      },
      error: function(e) {
        // 网络请求异常
        console.log("网络异常");
      }
    })
  },

  /**
   * 检查登录
   */
  checkTapLogin: function() {
    wx.showModal({
      title: '提示',
      content: '本小程序需要登录使用，请点击上面的“登录”按钮，用微信号登录获得完整体验。',
      showCancel: false
    })
    return;
  },

  /**
   * 到分享码页面
   */
  gotoMyQRCode: function() {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: '../myQRCode/myQRCode'
    })
  },

  /**
   * 到邀请好友页面
   */
  gotoinvite: function () {
    wx.navigateTo({
      url: '../invite/invite'
    })
  }

})