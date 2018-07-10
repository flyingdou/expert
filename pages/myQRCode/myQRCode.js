var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.methods.init(this);
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
   * 自定义函数
   */
  methods: {
    /**
     * 页面初始化
     */
    init: function (obj) {
      wx.request({
        url: app.request_url + 'createQRCode.asp',
        data: {
          memberId: wx.getStorageSync('memberId')
        },
        success: function (res) {
          obj.setData({
            qrcode: 'data:image/jpeg;base64,' + res.data
          });
        }
      })
    },

    //获取临时路径
    getTempFilePath: function () {
      wx.canvasToTempFilePath({
        canvasId: 'share',
        success: (res) => {
          this.setData({
            shareTempFilePath: res.tempFilePath
          })
        }
      })
    }
  }
})