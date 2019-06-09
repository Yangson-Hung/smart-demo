const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
  },
  onLoad: function(options) {

  },
  deviceBindingNotification: function(e) {
    var tmp = Math.random() * 2019
    var createTime = util.formatTime(new Date(Date.now()))
    console.log(e)
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        formId: e.detail.formId,
        templateId: 'vqVcvbnuHXe21KArLaUIR96kxGXNKY8TixP_Notdc4w',
        page: 'pages/index/index',
        phone: e.detail.value.phone,
        info: '您提交的设备绑定成功了',
        time: createTime,
        bianhao: tmp,
        xinghao: 'SmartWalking-OE1'
      },
    }).then((res) => {
      const db = wx.cloud.database()
      db.collection('device').add({
        data: {
          status: "online"
        },
        success: res => {
          db.collection('location').where({
            _openid: app.globalData.openid
          }).get({
            success: res => {
              app.globalData.gpsinfo.id = res.data[0].id
              app.globalData.gpsinfo.latitude = res.data[0].latitude
              app.globalData.gpsinfo.longitude = res.data[0].longitude
            },
            fail: err => {
              console.log(err)
            }
          })
        }
      })
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 2000)
      setTimeout(function() {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }, 2000)
    }).catch(err => {
      console.error(err)
    })
  }
})