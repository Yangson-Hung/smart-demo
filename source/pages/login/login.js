const app = getApp()
Page({
  data:{},
  onLoad() {
    this.setData({
      width: app.globalData.windowWidth,
      height: app.globalData.windowHeight,
      hasUserInfo: app.globalData.hasUserInfo
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    if (e.detail.userInfo !== undefined) {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorageSync("userInfo", e.detail.userInfo)
      wx.redirectTo({
        url: '/pages/welcome/welcome',
      })
    }
  },
})