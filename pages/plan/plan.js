var app = getApp();
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentDayStr:'',
    isChoosed:false,
    dou_items: ["item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content"],
    hasNoData:2,
    planData:{}
  },
  onLoad: function (options) {
    var currentObj = this.getCurrentDayString()
    var YYYY = currentObj.getFullYear();
    var MM = currentObj.getMonth()+1;
    var dd = currentObj.getDate();
    if (MM < 10 ){
      MM = "0" + MM;
    }
    if (dd < 10 ) {
      dd = "0" + dd;
    }
    var planDate = YYYY + '-' + MM + '-' + dd;
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日',
      currentDay: currentObj.getDate(),
      currentObj: currentObj
    })
    this.setSchedule(currentObj)
    this.getPlanData(planDate)
  },
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str)
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日',
      currentObj: currentObj
    })
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = ''
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1
          f = currentDayList[i]
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },

  /**
   * 用户选中日期
   */
  chooseDay: function (day) {
     // 选中下标
     var chooseIndex = day.currentTarget.dataset.index;
     // 选中的天
     var chooseDay = day.currentTarget.dataset.chooseday;

     // 拼接查询的日期
     var currentDate = this.data.currentDate;
     var yea = currentDate.substring(0, 4);
     var mon = parseInt(currentDate.substring(currentDate.indexOf("年") + 1, currentDate.indexOf("月")));
     if (mon <10) {
        mon = "0" + mon;
     }

     chooseDay = chooseDay < 10 ? ("0"+chooseDay)  : chooseDay;

     // 查询日期
     var dateStr = yea + "-" + mon + "-" + chooseDay;

     var dou_arr = this.data.dou_items;
     for(var d = 0; d < dou_arr.length ; d++) {
          dou_arr[d] = "item-content";
     }
     dou_arr[chooseIndex] = "item-content isChoosed";
     this.setData({
       dou_items: dou_arr
     });

     this.getPlanData(dateStr);
  },

  /**
   * 根据日期查询当前用户的信息
   */
  getPlanData: function (planDate) {
     var memberId = wx.getStorageSync("memberId");
     var param = {};
     var obj = this;
     param.memberId = memberId;
     param.planDate = planDate;
    //  微信请求中，
     wx.request({
       url: 'https://www.ecartoon.com.cn/expertex!list.asp',
       data:{
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         var hasNoData = res.data.items.length == 0 ? 1 : 0;
         obj.setData({
           hasNoData : hasNoData,
           planData : res.data.items
         });
       }
       
     })
      
  },
  
  /**
   * 用户点击课程名称
   */
  courseAction: function (dou) {
      var courseId = dou.currentTarget.dataset.courseid;
      wx.navigateTo({
        url: '../../pages/planDetail/planDetail?courseId=' + courseId
      })
  }


})