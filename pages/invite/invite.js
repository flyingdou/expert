var app = getApp();
var _this = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    qrCode: '',
    userInfo:{
      image: '20180607201806076592.jpg',
      nick: '飞向蓝天'
    }

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.init();
    _this.getQRCode();
    _this.getShareMemberList();
  
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
  * 用户点击、滑动切换tab
  */
  changeCurrentIndex: function (e) {
    // 滑动切换
    if (e.detail.source == 'touch') {
      _this.setData({
        currentIndex: e.detail.current
      })
    }

    // 点击切换
    if (e.currentTarget.dataset.index || e.currentTarget.dataset.index === 0) {
      _this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }

  },

  /**
   * 初始化页面
   */
  init: function () {
    var sysInfo = wx.getSystemInfoSync();
    var rate = 750 / sysInfo.windowWidth;
    var swiperHeight = (sysInfo.windowHeight - 39) * rate;
    _this.setData({
      swiperHeight: swiperHeight
    })

    _this.getMemberData(wx.getStorageSync('memberId'));
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
   * 获取小程序分享码
   */
  getQRCode: function () {
    var userId = wx.getStorageSync('userId');
    var param = {
      userId: userId
    };
    // 发起微信请求
    wx.request({
      url: app.request_url + "createQRCode.asp",
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        _this.setData({
          qrCode: 'data:image/jpeg;base64,' + res.data
        })
      },
      fail: function (e) {
        console.log('网络异常！');

      }



    })
  },

  /**
   * 查询我邀请的好友列表
   */
  getShareMemberList: function () {
    wx.request({
      url: app.request_url + 'getShareMemberList.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        _this.setData({
          shareMemberList: res.data
        })
      }
    })
  }


})