var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    images: [ '201809031048.png', '201809031048.png' ],
    buttons: [
      { image: '201807090917.png', text: '定制计划', page: 'setting' },
      { image: '201805042235.png', text: '健身排行榜', page: 'ranking' },
      { image: '201805042236.png', text: '健身视频', page: 'txVideo' },
      { image: '201805042233.png', text: '健身打卡', page: 'sign' }
    ],
    healthy: [
      { 
        image: '201809031049.png', 
        title: '体质指数 (BMI)',
        text: '请点击“健身打卡”填写您的身体数据。', 
        value: 0
      },
      { 
        image: '201809031056.png', 
        title: '腰臀比 (WHR)',
        text: '请点击“健身打卡”填写您的身体数据。', 
        value: 0
      }
    ],
    line: [
      [
        { text: '性别', lineType: 'select' },
        { text: '出生日期', lineType: 'picker', key:'date' }
      ],
      [
        { text: '身高', lineType: 'input', company: 'cm', key: 'height' },
        { text: '体重', lineType: 'input', company: 'kg', key: 'weight' }
      ],
      [
        { text: '腰围', lineType: 'input', company: 'cm', key: 'waist' },
        { text: '臀围', lineType: 'input', company: 'cm', key: 'hip' }
      ]
    ],
    selectBlocks: [
      { text: '男', code: 'M' },
      { text: '女', code: 'F' }
    ],
    selectIndex: 0,
    model: {}
  },

  /**
   * 页面载入函数
   */
  onLoad: function (options) {
    // 通过小程序码进入
    if (options.scene) {
      var param = decodeURIComponent(options.scene);
      // 通过百度手机广告小程序码进入, 保存originType
      if (param == 'expert_baidu_mobile') {
        app.constants.originType = param;
      }
      // 通过百度PC广告小程序码进入, 保存originType
      if (param == 'expert_baidu_PC') {
        app.constants.originType = param;
      }
      // 普通小程序码, 保存用户Id
      app.constants.shareMember = param;
    }

    // 通过小程序转发进入, 保存分享用户Id
    if (options.shareMember) {
      app.constants.shareMember = options.shareMember;
    }  

    // 页面初始化, 读取服务端专家系统数据
    this.methods.init(this);

    var model = this.data.model;
    model.date = util.formatData(new Date());
    this.setData({
      model: model
    })
  },

  /**
   * 页面显示函数
   */
  onShow: function () {
    var _this = this;
    !!!wx.getStorageSync('memberId') || this.setData({ status: true })
    if (!wx.getStorageSync('memberId')) {
      wx.login({
        success: function (res) {
          _this.data.code = res.code;
        }
      })
    } else {
      wx.request({
        url: app.request_url + 'getLastTrainRecord.asp',
        data: {
          memberId: wx.getStorageSync('memberId')
        },
        success: function (res) {
          var model = {
            gender: res.data.gender,
            height: res.data.height,
            weight: res.data.weight,
            waist: res.data.waist,
            hip: res.data.hip
          }
          _this.data.model = model;
          _this.computeHealthy();
        }
      })
    }
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

  // 去填写身体数据页面
  toPage: function (e) {
    // 判断用户是否登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      })
      return;
    }
    // 到指定页面
    var page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: `../${page}/${page}`
    })
  },

  /**
   * 保存表单数据
   */
  saveFormData: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 'select') {
      this.setData({ 
        selectIndex: e.currentTarget.dataset.index 
      })
    } else {
      var model = this.data.model;
      var key = e.currentTarget.dataset.key;
      model[key] = e.detail.value;
      this.setData({
        model: model
      })
    }
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = this.data.model;
    var paramList = [
      { key: 'height', message: '请输入身高' },
      { key: 'weight', message: '请输入体重' },
      { key: 'waist', message: '请输入腰围' },
      { key: 'hip', message: '请输入臀围' }
    ]

    for (var item of paramList) {
      if (!model[item.key] || model[item.key] == '') {
        wx.showModal({
          title: '提示',
          content: item.message,
          showCancel: false
        })
        return false;
      }
    }

    model.gender = this.data.selectBlocks[this.data.selectIndex].code;
    model.memberId = wx.getStorageSync("memberId");
    return model;
  },

  /**
   * 计算健康评估
   */
  computeHealthy: function () {
    var model = this.data.model;
    var healthy = this.data.healthy;

    // BMI
    var bmi_messages = [
      '您的体重过轻，请增强营养，加强锻炼。',
      '您的体重正常，健康风险最低，身体健康。',
      '您的体重超重，患病风险正在加大。',
      '您属于肥胖体型，属健康高危人群。',
      '请点击“健身打卡”填写您的身体数据。'
    ];
    var bmi = Math.pow(model.weight / model.height, 2);
    !!!(bmi < 18.5) || (healthy[0].text = bmi_messages[0]);
    !!!(bmi >= 18.5 && bmi < 24) || (healthy[0].text = bmi_messages[1]);
    !!!(bmi >= 24 && bmi < 28) || (healthy[0].text = bmi_messages[2]);
    !!!(bmi >= 28) || (healthy[0].text = bmi_messages[3]);
    !!!(bmi == 0) || (healthy[0].text = bmi_messages[4]);
    healthy[0].value = bmi;

    // WHR
    var whr_messages = [
      '您拥有理想的腰臀比，请继续保持！',
      '您的腰臀比偏高，中心性肥胖患病概率较大。',
      '您的腰臀比偏低，请加强营养、科学健身！',
    ];
    var whr = model.waist / model.hip || 0;
    !!!(model.gender == 'M' && whr >= 0.85 && whr <= 0.9) || (healthy[1].text = whr_messages[0])
    !!!(model.gender == 'M' && whr > 0.9) || (healthy[1].text = whr_messages[1])
    !!!(model.gender == 'M' && whr < 0.67 && whr > 0) || (healthy[1].text = whr_messages[2])
    !!!(model.gender == 'F' && whr >= 0.67 && whr <= 0.8) || (healthy[1].text = whr_messages[0])
    !!!(model.gender == 'F' && whr > 0.8) || (healthy[1].text = whr_messages[1])
    !!!(model.gender == 'F' && whr < 0.67 && whr > 0) || (healthy[1].text = whr_messages[2])
    healthy[1].value = whr;

    this.setData({ healthy: healthy });
  },

  /**
   * 提交表单
   */
  submitForm: function () {
    var model = this.checkForm();
    if (!model) {
      return;
    }
    // 本地计算健康评估
    this.computeHealthy();

    this.setData({ status: true });

    // 如果已经登录则保存到服务端
    if (wx.getStorageSync('memberId')) {
      wx.request({
        url: app.request_url + 'saveMemberData.asp',
        data: {
          json: encodeURI(JSON.stringify(model))
        }
      })
    }
  },

  /**
   * wechatLogin
   */
  wechatLogin: function (e) {
    var objx = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      // 获取code
      e.detail.code = objx.data.code;

      // 判断是否从他人分享的连接进来的
      var shareMember = app.constants.shareMember;
      if (shareMember > 0) {
        e.detail.shareMember = shareMember;
      }

      // 判断是否从百度广告小程序码进入
      var originType = app.constants.originType;
      if (originType && originType != '') {
        e.detail.originType = originType;
      }

      // 请求登录后台
      wx.request({
        url: app.wechat_login_url + 'wechatLogin.asp',
        dataType: JSON,
        data: {
          json: JSON.stringify(e.detail)
        },
        success: function (res) {
          // 网络请求成功
          res = JSON.parse(res.data);
          if (res.success) {
            app.globalData.userInfo = e.detail.userInfo;
            // 登录成功，将数据存储起来
            wx.setStorageSync("memberId", res.key);
            wx.setStorageSync("session_key", res.session_key);
            wx.setStorageSync("openId", res.openid);

            objx.submitForm();
          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
              showCancel: false
            })
          }
        },
        error: function (e) {
          // 网络请求失败
          wx.showModal({
            title: '提示',
            content: '网络异常',
            showCancel: false
          })
          return;
        }
      })
    } else {
      this.submitForm();
    }
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
