//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    var obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/expertex!loadPlan.asp',
      success: function (res) {
        obj.setData({
          item: res.data.item
        });
      }
    })

    wx.login({
      success: function (res) {
        obj.setData({
          code: res.code
        });
      }
    }) 

    if(options.shareMember){
      this.setData({
        shareMember: shareMember
      });
    }  
  },

  onShow: function () {
    if (wx.getStorageSync('memberId')) {
      this.setData({
        loginStatus: 1
      })
    }
  },

  // 我的计划按钮绑定
  myPlan: function (e) {
    if (e.detail.errMsg == 'getUserInfo:ok'){
      if (this.data.loginStatus == 1) {
        wx.navigateTo({
          url: '../plan/plan'
        })
        return;
      }
      e.detail.code = this.data.code;
      this.wechatLogin(e.detail, function () {
        wx.navigateTo({
          url: '../plan/plan'
        })
      });
    }
  },

  // 我要定制按钮绑定
  goBuy: function (e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      if(this.data.loginStatus == 1){
        wx.navigateTo({
          url: '../setting/setting'
        })
        return;
      }
      e.detail.code = this.data.code;
      this.wechatLogin(e.detail, function () {
        wx.navigateTo({
          url: '../setting/setting'
        })
      });
    }
  },

  // 在服务端登录
  wechatLogin: function(param, callback){
    var obj = this;
    if (this.data.shareMember) {
      param.shareMember = this.data.shareMember;
    }
    // 发起网络请求
    wx.request({
      url: 'https://www.ecartoon.com.cn/loginex!wechatLogin.asp',
      data: {
        json: JSON.stringify(param)
      },
      success: function (res) {
        if(!res.data.success){
          wx.showModal({
            title: '提示',
            content: '注册失败, 程序异常, 请联系开发者!'
          });
        }

        getApp().globalData.userInfo = param.userInfo;
        wx.setStorageSync("memberId", res.data.key);
        wx.setStorageSync("openId", res.data.openid);
        wx.setStorageSync("session_key", res.data.session_key);

        callback();
      }
    });
  },
  
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '国家健身队主教练王严多年研究成果，量身定制增肌减脂健身计划，'
      + '快速达成目标！新用户领30元礼券',
      desc: '',
      imageUrl: 'https://www.ecartoon.com.cn/picture/201806280920.jpg',
      path: 'pages/index/index'
    }
  }

})
