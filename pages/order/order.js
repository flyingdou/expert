var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    productDetail: {},
    price: 0,
    phoneNumber: 0,
    showPhoneNubmer: '请点击获取手机号',
    ticket: { name: '请选择优惠券'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    if (options.product) {
      obj.setData({
        userInfo: getApp().globalData.userInfo,
        productDetail: JSON.parse(decodeURI(options.product))
      });
    } else {
      // 展示用户信息和商品数据
      wx.request({
        url: 'https://www.ecartoon.com.cn/expertex!getProducDetail.asp',
        success: function(res){
          obj.setData({
            userInfo: getApp().globalData.userInfo,
            productDetail: {
              productName: res.data.productName,
              originalPrice: res.data.price,
              strengthDate: options.strengthDate
            },
            price: res.data.price.toFixed(2)
          });
        }
      })
    }

    /**
   * 查询当前用户的数据
   */
   var _this = this;
    // 发起网络请求
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify({ memberId: wx.getStorageSync('memberId') }))
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
            _this.setData({
              showPhoneNumber: mobilephone,
              phoneNumber: mobilephone
            })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 如果有优惠券就显示优惠券并计算价格
    if (wx.getStorageSync("ticket")){
      var ticket = wx.getStorageSync("ticket");
      var price = this.data.productDetail.originalPrice - ticket.price;
      price = price.toFixed(2);
      price = price < 0 ? 0 : price;
      this.setData({
        ticket: ticket,
        price: price
      });
      wx.removeStorageSync("ticket");
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
    
  },

  /**
   * 用户点击获取手机号
   */
  getPhoneNumber: function(e) {
    wx.showLoading({
      mask: 'true'
    })
    var obj = this;
    e.session_key = wx.getStorageSync("session_key");
    wx.request({
      url: 'https://www.ecartoon.com.cn/expertex!decodePhoneNumber.asp',
      data: {
        json: JSON.stringify(e)
      },
      success: function (res) {
        // 获取和处理用户手机号
        var userPhoneNumber = res.data.phoneNumber;
        var showUserPhoneNumber = userPhoneNumber.substring(0, 3) + "****" 
          + userPhoneNumber.substring(userPhoneNumber.length - 4, userPhoneNumber.length);
        // 更新UI显示
        obj.setData({
          phoneNumber: userPhoneNumber,
          showPhoneNubmer: showUserPhoneNumber
        });
        // 隐藏加载动画
        wx.hideLoading();
      }
    })
  },
  /**
   * 用户点击选择优惠券
   */
  selectTicket: function() {
    var url = '../ticket/ticket';
    if (this.data.productDetail.productType) {
      url = '../ticket/ticket?type=1';
    }
    wx.navigateTo({
      url: url
    });
  },
  /**
   * 用户点击确认支付
   */
  payMent: function() {
    // 判断用户是否已经获取手机号
    if (this.data.phoneNumber == 0){
      wx.showToast({
        title: '请先获取手机号!',
        icon: 'none'
      });
      return;
    }
    // 请求服务端签名
    var param = {}
    param.phoneNumber = this.data.phoneNumber;
    param.strengthDate = this.data.productDetail.strengthDate;
    param.memberId = wx.getStorageSync("memberId");
    param.openId = wx.getStorageSync("openId");
    if(this.data.ticket){
      param.ticket = this.data.ticket.ticketId;
    }
    if (this.data.productDetail.productType) {
      param.productId = this.data.productDetail.productId;
      param.productType = this.data.productDetail.productType;
      if (this.data.productDetail.weight) {
        param.weight = this.data.productDetail.weight;
      }
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
          package: sign.data.packageValue,
          signType: sign.data.signType,
          paySign: sign.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
            // 支付成功, 跳转页面
            wx.navigateTo({
              url: '../paySuccess/paySuccess'
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