var bmap = require('../../libs/bmap-wx.min.js');
const app = getApp()
Page({
  /**
   * 转发分享
   */
  onShareAppMessage: function() {
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
    notice_color: "#e54d42"
  },
  onLoad: function() {
    this.setDeviceInfo()
    this.changeColotTimer()
    this.setData({
      userInfo: app.globalData.userInfo,
      width: app.globalData.windowWidth,
      height: app.globalData.windowHeight,
    })
    //this.bMapWeather()
  },
  //解绑设备
  jiebang: function(e) {
    var that = this
    app.showModal({
      content: "确定解绑该设备？",
      showCancel: true,
      confirm: function() {
        var _id = ""
        var tmpId = e.currentTarget.dataset.devId
        const db = wx.cloud.database()
        db.collection('device').where({
          _openid: app.globalData.openid,
        }).get({
          success: res => {
            var tmpArr = res.data
            for (var i in tmpArr) {
              if (tmpId == tmpArr[i].devId) {
                _id = tmpArr[i]._id
              }
            }

            db.collection('device').doc(_id).remove({
              success: res => {
                app.showToast({
                  title: '加载中',
                  icon: 'loading',
                })
                var tmp = app.globalData.deviceInfo
                for (var i in tmp){
                  if (tmpId === tmp[i].devId){
                    tmp.splice(i,1)
                    app.globalData.deviceInfo = tmp
                    //wx.setTimeout(function(){
                      
                      wx.reLaunch({
                        url: '/pages/index/index',
                        success: res => {
                          app.showToast({
                            title: '加载中',
                            icon: 'loading',
                          })
                        },
                        fail: res => {
                          console.log(234)
                        }
                      })
                   // },5000)
                   
                  }
                }
              
              },
              fail: res => {
                console.log(res)
              }
            })

          }
        })
      }
    })

  },
  //获取设备信息
  setDeviceInfo: function() {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  //改变颜色
  changeColor: function() {
    this.setData({
      change_color: !this.data.change_color
    })
  },
  //改变颜色定时函数
  changeColotTimer: function() {
    var that = this
    var timer1 = setInterval(this.changeColor, 150)
    setTimeout(function() {
      clearInterval(timer1)
      that.setData({
        change_color: false,
        notice_color: '#0f0'
      })
    }, 2000)
  },
  mypage: function() {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },
  devmap: function() {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },
  newDev: function() {
    wx.navigateTo({
      url: '/pages/welcome/welcome',
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