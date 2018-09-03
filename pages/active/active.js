var app = getApp();
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      { title: '体重管理' },
      { title: '健身次数' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var systemInfo = util.getSystemInfo();
    this.setData({
      height: systemInfo.windowHeightRpx
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
    // 每次页面显示刷新挑战列表数据
    this.methods.getActiveList(this);
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
    // 刷新挑战列表数据
    this.methods.getActiveList(this);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    var club = wx.getStorageSync('club');
    return {
      title: club.name + '的活动',
      path: 'pages/active/active'
    }
  },

  /**
   * 保存当前索引
   */
  saveCurrentIndex: function (e) {
    this.data.currentIndex = e.detail.index;
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 获取挑战列表
     */
    getActiveList: (obj) => {
      // 请求服务器挑战数据
      wx.request({
        url: app.request_url + 'findActiveAndDetail.asp',
        data: {
          clubId: wx.getStorageSync('clubId')
        },
        success: (active_res) => {
          var activeWeightList = [];
          var activeCountList = [];
          for (var item of active_res.data.activeList) {
            !!!(item.target == 'A' || item.target == 'B') || activeWeightList.push(item);
            !!!(item.target == 'C' || item.target == 'D') || activeCountList.push(item);
          }

          var tab = obj.data.tab;
          tab[0].data = activeWeightList;
          tab[1].data = activeCountList;

          obj.setData({
            tab: tab
          });
        }
      });
    }
  },

  /**
   * wxml绑定函数: 活动列表点击绑定
   */
  activeDetail : function (e) {
    // 先检查是否登录
    if (!wx.getStorageSync('memberId')){
      wx.reLaunch({
        url: '../mine/mine?source=active'
      });
      return;
    }
    // 获取挑战数据跳转到挑战页面
    let index = e.currentTarget.dataset.index;
    let active_data = encodeURI(JSON.stringify(this.data.tab[this.data.currentIndex].data[index]));
    wx.navigateTo({
      url: `../activeDetail/activeDetail?active=${active_data}`
    });
  },

  /**
   * wxml绑定函数: 砍价列表点击绑定
   */
  cutdown: function (e) {
    // 先检查是否登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=active'
      });
      return;
    }
    // 获取挑战数据跳转到挑战页面
    let index = e.currentTarget.dataset.index;
    let priceActive = this.data.priceActiveList[index];
    wx.navigateTo({
      url: '../priceCutdown/priceCutdown?priceActiveId=' + priceActive.id
    });
  }
})