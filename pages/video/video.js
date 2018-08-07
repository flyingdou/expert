var app = getApp();
import regeneratorRuntime from '../../utils/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    actionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化
    this.methods.init(JSON.parse(options.items), this);
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
   * wxml绑定函数: 上一个按钮点击绑定
   */
  bindPrevButtonTap: function () {
    var currentIndex = this.data.currentIndex;
    if (currentIndex <= 0) {
      return;
    }
    currentIndex--;
    this.setData({
      currentIndex: currentIndex
    })
  },

  /**
   * wxml绑定函数: 下一个按钮点击绑定
   */
  bindNextButtonTap: function () {
    var currentIndex = this.data.currentIndex;
    if (currentIndex >= this.data.actionList.length - 1) {
      return;
    }
    currentIndex++;
    this.setData({
      currentIndex: currentIndex
    })
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 初始化
     */
    init: async function (items, obj) {
      var index = obj.data.currentIndex;
      var actionList = [];

      // 请求第一条数据展示给用户
      var action = await obj.methods.getAction(items[index].workoutId);
      actionList.push(action);
      obj.setData({
        actionList: actionList
      })

      // 后续静默请求其他数据
      for (var i = (index + 1); i < items.length; i++) {
        var action = await obj.methods.getAction(items[i].workoutId);
        actionList.push(action);
      }
      obj.setData({
        actionList: actionList
      })
    },

    /**
     * 获取动作数据
     */
    getAction: function (workoutId) {
      return new Promise (function (reslove, reject) {
        wx.request({
          url: 'https://www.ecartoon.com.cn/expertex!findGroupByAction.asp',
          data: {
            id: workoutId
          },
          success: function (res) {
            reslove(res.data.action) 
          }
        })
      })
    }
  }
})