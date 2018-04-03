Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    productDetail: {},
    price: 0,
    phoneNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    // 展示用户信息和商品数据
    wx.request({
      url: 'https://www.ecartoon.com.cn/expertex!getProducDetail.asp',
      success: function(res){
        obj.setData({
          userInfo: getApp().globalData.userInfo,
          productDetail: {
            productName: res.data.productName,
            price: res.data.price,
            strengthDate: options.strengthDate
          },
          price: res.data.price
        });
      }
    })
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
   * 用户点击获取手机号
   */
  getPhoneNumber: function (e) {
    var obj = this;
    wx.request({
      url: '',
      data: {
        json: encodeURI(JSON.stringify(e))
      },
      success: function (res) {
        console.log(res);
        if(res.success){
          obj.setData({
            phoneNumber: res.phoneNumber
          });
        } else {
          var message = res.data.message ? '程序异常' : res.data.message;
          wx.showToast({
            title: message,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 用户点击确认支付
   */
  payMent: function () {
    // 判断用户是否已经获取手机号
    if(this.data.phoneNumber == 0){
      wx.showToast({
        title: '请先获取手机号!',
        icon: 'none'
      });
      return;
    }
    // 请求服务端签名
    var param = {
      strengthDate: this.data.strengthDate
    }
    param.memberId = wx.getStorageSync("memberId");
    if(wx.getStorageInfoSync("ticket")){
      param.ticket = wx.getStorageInfoSync("ticket");
    }
    wx.request({
      url: 'https://www.ecartoon.com.cn/expertex!createGoodsOrder.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function(sign){
        // 调用微信支付接口
        wx.requestPayment({
          timeStamp: sign.data.timeStamp,
          nonceStr: sign.data.nonceStr,
          package: sign.data.package,
          signType: sign.data.signType,
          paySign: sign.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
            // 支付成功, 跳转页面
            wx.navigateTo({
              url: ''
            });
          },
          fail: function (e) {
            console.log(e);
          }
        });
      }
    });
  }
})