//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: ''
  },
  onLoad: function () {
    var obj = this;
    // 请求微信登录code
    wx.login({
      success: function(login_data){
        // 请求用户基本信息
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            // 请求参数
            res.code = login_data.code;
            // 调用服务端登录方法
            obj.wechatLogin(res);
          },
          fail: e => {
            wx.showModal({
              title: '提示',
              content: '您拒绝了授权,如果想使用后续功能,需要将信息授权功能开启',
              success: function(sure){
                if (sure.cancel) {
                  var url = "https://www.ecartoon.com.cn/expert/zjxt.jsp";
                  url += "?memberId=" + 0;
                  url += "&memberTicket=" + 0;

                  obj.setData({
                    url: url
                  });
                  return;
                }

                wx.openSetting({
                  success: function (setting) {
                    if (setting.authSetting["scope.userInfo"]) {
                      //这里是授权成功之后 填写你重新获取数据的js
                      wx.getUserInfo({
                        success: function (res) {
                          app.globalData.userInfo = res.userInfo
                          // 请求参数
                          res.code = login_data.code;
                          // 调用服务端登录方法
                          obj.wechatLogin(res);
                        }
                      });
                    } else {
                      var url = "https://www.ecartoon.com.cn/expert/zjxt.jsp";
                      url += "?memberId=" + 0;
                      url += "&memberTicket=" + 0;

                      obj.setData({
                        url: url
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  // 在服务端登录
  wechatLogin: function(res){
    var obj = this;
    // 发起网络请求
    wx.request({
      url: 'https://www.ecartoon.com.cn/loginex!wechatLogin.asp',
      data: {
        json: JSON.stringify(res)
      },
      success: function (res) {
        console.log(JSON.stringify(res.data));
        if(!res.data.success){
          wx.showModal({
            title: '提示',
            content: '注册失败, 程序异常, 请联系开发者!'
          });

          var url = "https://www.ecartoon.com.cn/expert/zjxt.jsp";
          url += "?memberId=" + 0;

          if (res.data.memberTicket) {
            url += "&memberTicket=" + res.data.memberTicket;
          } else {
            url += "&memberTicket=" + 0;
          }

          obj.setData({
            url: url
          });
        }

        wx.setStorageSync("memberId", res.data.key);
        wx.setStorageSync("openId", res.data.openid);
        wx.setStorageSync("session_key", res.data.session_key);
        
        var url = "https://www.ecartoon.com.cn/expert/zjxt.jsp";
        url += "?memberId=" + res.data.key;

        if (res.data.memberTicket) {
          url += "&memberTicket=" + res.data.memberTicket;
        } else {
          url += "&memberTicket=" + 0;
        }

        obj.setData({
          url: url
        });
      }
    });
  },
  
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '智能健身计划引擎',
      desc: '',
      path: '/index/index'
    }
  }

})
