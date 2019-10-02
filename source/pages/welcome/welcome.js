const app = getApp()

Page({

  data: {},

  onLoad: function() {
    this.setData({
      width: app.globalData.windowWidth,
      height: app.globalData.windowHeight
    })
  },

  scanCode: function() {
    wx.scanCode({
      success: res => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/devinfo/devinfo',
        })
      }
    })
  }
  
})