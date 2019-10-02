const app = getApp()
Page({
  data: {
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
    hasUserInfo: app.globalData.hasUserInfo
  },
  onLoad() {

  },
  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    if (e.detail.userInfo !== undefined) {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorageSync("userInfo", e.detail.userInfo)

      //删掉小程序后再进入时判断之前是否添加过设备
      //查询是否有添加过设备
      const db = wx.cloud.database()
      db.collection('device').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          if (res.data.length !== 0) {
            var tmp = res.data
            for (var i in tmp) {
              app.globalData.deviceInfo.push({
                //获取设备名
                devName: tmp[i].devName,
                //获取设备ID
                devId: tmp[i].devId
              })
            }
            //获取GPS信息
            db.collection('location').where({
              _openid: app.globalData.openid
            }).get({
              success: res => {
                app.globalData.gpsinfo.id = res.data[0].id
                app.globalData.gpsinfo.latitude = res.data[0].latitude
                app.globalData.gpsinfo.longitude = res.data[0].longitude
              }
            })
            //已经有设备，直接跳转
            wx.showLoading({
              title: '加载中',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 3000)
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }, 3000)  
          } else {
            //没有添加设备，跳到扫码页      
            wx.showLoading({
              title: '加载中',
            })
            setTimeout(function() {
              wx.hideLoading()
            }, 2000)
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/welcome/welcome',
              })
            }, 2000)
          }
        }
      })
    }
  }
})