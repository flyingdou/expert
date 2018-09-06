var app = getApp();
var util = require('../../utils/util.js');
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 0,
    targetList: [
      { 
        text: '健身次数', 
        placeholder: '输入次数', 
        code: 'C' 
      },
      {
        text: '体重减少',
        placeholder: '输入减少体重kg',
        code: 'A'
      },
      {
        text: '体重增加',
        placeholder: '输入增加体重kg',
        code: 'B'
      }
    ],
    targetIndex: 0,
    memberList: [],
    memberIndex: 0,
    model: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

    // 计算页面高度和宽度
    var systemInfo = util.getSystemInfo();
    _this.setData({
      windowWidthRpx: systemInfo.windowWidthRpx,
      windowHeightRpx: systemInfo.windowHeightRpx
    });

    // 查询慈善机构列表
    _this.findInstitution();
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
   * 查询慈善机构列表
   */
  findInstitution: function (e) {
    wx.request({
      url: app.request_url + 'findInstitution.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        _this.setData({
          memberList: res.data.items
        })
      }
    })
  },

  /**
   * 显示另一个页面
   */
  showOtherPage: function (e) {
    var index = e.currentTarget.dataset.index;
    var titles = [ '挑战目标', '成功奖励', '失败惩罚' ];
    _this.setData({
      position: _this.data.windowWidthRpx,
      pageIndex: index
    });
    wx.setNavigationBarTitle({
      title: titles[index]
    });
  },

  /**
   * 改变挑战目标索引
   */
  changeSelectIndex: function (e) {
    var key = e.currentTarget.dataset.key;
    var index = e.currentTarget.dataset.index;
    var data = {}
    data[key] = index;
    _this.setData(data);
  },

  /**
   * 上传图片
   */
  uploadImage: function () {
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://www.ecartoon.com.cn/esignwx!uploadImage.asp',
          filePath: tempFilePaths[0],
          name: 'memberHead',
          success: function (res) {
            res = JSON.parse(res.data);
            var model = res.data.model;
            model.image = res.image;
            _this.setData({
              model: model
            });
          }
        });
      }
    });
  },

  /**
   * 保存表单数据
   */
  saveFormData: function (e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var model = _this.data.model;
    model[key] = value;
    _this.setData({
      model: model
    });
  },

  /**
   * 返回
   */
  back: function () {
    _this.setData({
      position: 0
    });
    wx.setNavigationBarTitle({
      title: '健身挑战'
    });
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = _this.data.model;
    var paramList = [
      { key: 'image', message: '请上传挑战海报' },
      { key: 'name', message: '请输入挑战名称' },
      { key: 'days', message: '请输入挑战天数' },
      { key: 'value', message: '请输入挑战目标值' },
      { key: 'award', message: '请输入成功奖励' },
      { key: 'amerceMoney', message: '请输入失败惩罚金额' }
    ];
    for (var item of paramList) {
      if (!model[item.key] || model[item.key] == '') {
        wx.showModal({
          title: '提示',
          content: item.message,
          showCancel: false
        });
        return false;
      }
    }
    model.target = _this.data.targetList[_this.data.targetIndex].code;
    model.institution = _this.data.memberList[_this.data.memberIndex].id;
    model.memberId = wx.getStorageSync('memberId');
    return model;
  },

  /**
   * 提交表单
   */
  submitForm: function () {
    var model = _this.checkForm();
    if (!model) {
      return;
    }
    // 校验通过, 调用服务端发起挑战接口
    wx.request({
      url: app.request_url + 'activeSave.asp',
      data: {
        json: encodeURI(JSON.stringify(model))
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '发布成功',
          showCancel: false,
          complete: function () {
            wx.navigateTo({
              url: '../activeDetail/activeDetail?activeId=' + res.data.key
            })
          }
        })
      }
    });
  }
})