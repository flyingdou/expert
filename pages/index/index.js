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
            // 发起网络请求
            wx.request({
              url: 'https://www.ecartoon.com.cn/loginex!wechatLogin.asp',
              data: {
                json: encodeURI(JSON.stringify(res))
              },
              success: function(res){
                wx.setStorageSync("memberId", res.data.key);
                wx.setStorageSync("openId", res.data.openid);
                wx.setStorageSync("session_key", res.data.session_key);

                if(res.data.memberTicket){
                  obj.setData({
                    url: 'https://www.ecartoon.com.cn/expert/zjxt.jsp?memberTicket=' 
                        + res.data.memberTicket
                  });
                } else {
                  obj.setData({
                    url: 'https://www.ecartoon.com.cn/expert/zjxt.jsp'
                  });
                }

              }
            });
          }
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
