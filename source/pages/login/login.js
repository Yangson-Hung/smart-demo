const app = getApp()
Page({

  data: {
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function() {
    if (app.globalData.devInfo.hasDev) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    if (e.detail.userInfo !== undefined) {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorageSync('userInfo', e.detail.userInfo)
      wx.redirectTo({
        url: '/pages/welcome/welcome',
      })
    }
  },


})