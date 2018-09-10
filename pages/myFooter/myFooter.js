var app = getApp();
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: "https://www.ecartoon.com.cn/picture/",
    signList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
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
    // 每次页面显示重新刷新我的足迹数据
    this.getLastTrainRecord();
    this.getData();
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
   * 获取最新训练日志
   */
  getLastTrainRecord: function () {
    wx.request({
      url: app.request_url + 'getLastTrainRecord.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        _this.data.trainRcord = res.data;
      }
    })
  },

  /**
   * 获取数据
   */
  getData: function () {
    wx.request({
      url: app.request_url + 'ShowHeartRate.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        currentPage: 1,
        pageSize: 1000
      },
      success: function (res) {
        _this.setData({
          signList: res.data.phrList.map(_this.computeData)
        })
      }
    })
  },

  /**
   * 切割日期
   */
  computeData: function (sign) {
    // 切割日期
    var date = sign.train_date;
    sign.year = date.split('-')[0];
    sign.month = date.split('-')[1];
    sign.monthText = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][parseInt(sign.month)];
    sign.date = date.split('-')[2];

    // 计算身体数据
    var trainRcord = _this.data.trainRcord;
    var age = _this.ages(trainRcord.birthday);
    var base = (220 - age - trainRcord.heart);
    var bmiH = base * (trainRcord.bmiHigh / 100) + trainRcord.heart;
    var bmiL = base * (trainRcord.bmiLow / 100) + trainRcord.heart;
    var styles = [
      { 
        message: '您的运动强度不够，请继续努力！', 
        icon: '201809031053.png', 
        css: 'sign-message-style2' 
      },
      {
        message: '您的运动强度合适，请继续保持！',
        icon: '201809031052.png',
        css: 'sign-message-style1'
      },
      {
        message: '您的运动强度太大，请减少运动量！',
        icon: '201809031054.png',
        css: 'sign-message-style3'
      }
    ];
    // 判断运动强度区域
    if (sign.heartRates < bmiL) {
      sign.style = styles[0];
    }
    if (sign.heartRates >= bmiL && sign.heartRates < bmiH) {
      sign.style = styles[1];
    }
    if (sign.heartRates >= bmiH) {
      sign.style = styles[2];
    }
    return sign;
  },

  /**
   * 获得年龄
   */
  ages: function (birthday) {
    var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      return  (Y - r[1]);
    }   
  },

  /**
   * 自定义方法
   */
  methods: {
    /**
     * 签到数据过滤
     */
    signFilter: (sign) => {
      // 处理签到日期
      let signDates = sign.signDate.split("-");
      let year = signDates[0];
      let month = signDates[1];
      let date = signDates[2];
      let monthTextList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
      sign.year = year;
      sign.month = month;
      sign.monthText = monthTextList[parseInt(month) - 1];
      sign.date = date;
      // 处理签到评分
      if (sign.deviceScore){
        sign.deviceScore = parseInt(sign.deviceScore) / 20;
      }
      if (sign.evenScore){
        sign.evenScore = parseInt(sign.evenScore) / 20;
      }
      if (sign.servieScore){
        sign.servieScore = parseInt(sign.servieScore) / 20;
      }
      return sign;
    },
    /**
     * 请求服务端我的足迹(签到)数据
     */
    myFooter: (obj) => {
      wx.request({
        url: app.request_url + 'myFooter.asp',
        data: {
          memberId: wx.getStorageSync('memberId'),
          clubId: wx.getStorageSync('clubId'),
        },
        success: (res) => {
          obj.setData({
            signList: res.data.signList.map(obj.methods.signFilter)
          });
        }
      });
    }
  },
  /**
   * wxml绑定方法: 签到列表点击绑定
   */
  bindTapSignItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let signId = this.data.signList[index].id;
    wx.navigateTo({
      url: `../memberEvaluate/memberEvaluate?signId=${signId}`
    });
  }
})