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
        const db = wx.cloud.database()
        db.collection('device').add({
          data: {
            status: "online"
          },
          success: res => {
            app.showToast({
              title: '绑定设备成功',
              icon: 'success',
              duration: 3000,
              success: res => {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            })
          },
          fail: err => {
            app.showToast({
              title: '绑定设备失败',
              icon: 'loading',
              duration: 2000
            })
            console.log(err)
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  }
})