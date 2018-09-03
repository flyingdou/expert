var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberRanking: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    var source = options.source;
    var clubId = options.clubId;
    if (source && clubId) {
      objx.setData({
        source:source,
        clubId:clubId
      })
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
    this.getRanking(this);
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
    this.getRanking(this);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  // 加载俱乐部数据
  getRanking: function (obj) {
    wx.request({
      url: app.request_url + 'getRanking.asp',
      success: function (res) {
        obj.setData({
          memberRanking: res.data
        });
      }
    });
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    var objx = this;
    var club = wx.getStorageSync('club');
    return {
      title: club.name + '会员排行榜',
      path: 'pages/memberRanking/memberRanking?source=share&clubId=' + club.id
    }
  },

  /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  }


  
})