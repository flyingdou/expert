var app = getApp()
Page({
  data: {
    
  },

  /**
   * 页面载入函数
   */
  onLoad: function (options) {
    // 通过小程序码进入, 保存分享用户Id
    if (options.scene) {
      var shareMember = decodeURIComponent(options.scene);
      wx.setStorageSync('shareMember', shareMember);
    }

    // 通过小程序转发进入, 保存分享用户Id
    if (options.shareMember) {
      wx.setStorageSync('shareMember', options.shareMember);
    }  

    // 页面初始化, 读取服务端专家系统数据
    this.methods.init(this);
  },

  /**
   * 页面显示函数
   */
  onShow: function () {

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
  },

  // wxml绑定函数:我要定制点击绑定
  bindToSettingButtonTap: function (e) {
    // 判断用户是否登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      })
      return;
    }
    // 到填写用户身体数据页面
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  /**
   * 自定义函数
   */
  methods: {
    // 页面初始化
    init: function (obj) {
      wx.request({
        url: app.request_url + 'loadPlan.asp',
        success: function (res) {
          obj.setData({
            item: res.data.item
          });
        }
      });
    }
  }
})
