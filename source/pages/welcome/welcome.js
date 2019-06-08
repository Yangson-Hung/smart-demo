const app = getApp()

Page({
  data: {
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
  },
  onLoad: function (options) {

  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: false,
      success(res) {
        console.log(res)
        app.showToast({
          title: '绑定设备成功',
          icon: 'success',
          duration: 2000
        })

        app.globalData.devInfo.hasDev = true
        wx.setStorageSync('devInfo', app.globalData.devInfo)

        wx.redirectTo({
          url: '/pages/index/index',
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  }
})