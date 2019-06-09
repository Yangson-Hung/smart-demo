var bmap = require('../../libs/bmap-wx.min.js');
const app = getApp()
Page({
  /**
   * 转发分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_slogan,
      path: '/pages/index/index'
    }
  },
  /**
   * 页面数据
   */
  data: {
    change_color: true,
    weatherData: {
      city: "",
      date: "",
      pm25: "",
      range: "",
      temp: "",
      desc: "",
      wind: "",
    },
    ak: "mtxmirSI8Rrr4auxsCXklYYCeg4f6ECH",
  },
  onLoad: function () {
    this.changeColotTimer()
    this.setData({
      userInfo: app.globalData.userInfo,
      width: app.globalData.windowWidth,
      height: app.globalData.windowHeight
    })
    //this.bMapWeather()
  },
  changeColor: function () {
    this.setData({
      change_color: !this.data.change_color
    })
  },
  changeColotTimer: function () {
    setInterval(this.changeColor, 618)
  },
  mypage: function () {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },
  devmap: function () {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },
  newDev: function () {
    wx.navigateTo({
      url: '/pages/welcome/welcome?id=1',
    })
  },
  /**
   * 获取天气信息
   */
  // bMapWeather: function () {
  //   var that = this
  //   var BMap = new bmap.BMapWX({
  //     ak: that.data.ak
  //   })
  //   var fail = function (data) {
  //     console.log('fail!')
  //   }
  //   var success = function (data) {
  //     var weatherData = data.currentWeather[0]
  //     that.setData({
  //       weatherData: {
  //         city: weatherData.currentCity,
  //         date: weatherData.date.substring(0, 9),
  //         pm25: '空气质量：' + weatherData.pm25,
  //         range: weatherData.temperature,
  //         temp: weatherData.date.substring(14, 17),
  //         desc: weatherData.weatherDesc,
  //         wind: weatherData.wind
  //       }
  //     })
  //   }
  //   BMap.weather({
  //     fail: fail,
  //     success: success
  //   })
  // }
})