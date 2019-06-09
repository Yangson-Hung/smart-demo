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

      const db = wx.cloud.database()
      db.collection('device').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          if (res.data.length !== 0) {
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
            //已经有设备，直接跳转
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else {
            //没有添加设备，跳到扫码页
            wx.redirectTo({
              url: '/pages/welcome/welcome',
            })
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
})