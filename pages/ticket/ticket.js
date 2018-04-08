Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: {},
    types:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var memberId = wx.getStorageSync("memberId");
    wx.request({
      url: 'https://www.ecartoon.com.cn/expertex!findTicketByType.asp',
      data: {
        memberId: memberId
      },
      success: function(res) {
        res.data.tickets.forEach(function(item){
          var scope = '';
          var types = item.scope.split(",");
          types.forEach(function(typeItem){
            typeItem = parseInt(typeItem);
            if(typeItem == 1){
              scope += '健身卡,';
            } else if (typeItem == 2){
              scope += '健身挑战,';
            } else if (typeItem == 3) {
              scope += '健身计划,';
            } else if (typeItem == 4) {
              scope += '场地预定,';
            } else if (typeItem == 5) {
              scope += '团体课程,';
            } else if (typeItem == 6) {
              scope += '智能计划,';
            } else if (typeItem == 7) {
              scope += '健身E卡通,';
            }
          });
          if(scope.length > 18){
            scope = scope.substring(0, 18);
            scope += '...';
          } else {
            scope = scope.substring(0, scope.length - 1);
          }
          item.scope = scope;
        });
        // 设置数据源
        obj.setData({
          tickets: res.data.tickets
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
   * 用户点击优惠券
   */
  selectTicket: function(e) {
    var ticket = e.currentTarget.dataset.ticket;
    wx.setStorageSync("ticket", ticket)
    wx.navigateBack({
      delta: 1
    });
  }
})