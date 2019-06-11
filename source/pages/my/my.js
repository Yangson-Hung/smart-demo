const app = getApp()
Page({
  data: {
    loginImg: '/images/my_pic/login-image.png',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    myList: [{
      iconPath: '/images/my_pic/manager.png',
      router: 'manager',
      name: '设备管理',
    }, {
      iconPath: '/images/my_pic/set.png',
      router: 'set',
      name: '设置',
    }, {
      iconPath: '/images/my_pic/help.png',
      router: 'help',
      name: '帮助',
    }, {
      iconPath: '/images/my_pic/issue.png',
      router: 'issue',
      name: '问题与建议',
    }, {
      iconPath: '/images/my_pic/about.png',
      router: 'about',
      name: '关于',
    }]
  },
  // onLoad: function() {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse) {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  /**
   * 获取用户信息
   */
  // getUserInfo: function(e) {
  //   console.log(e)
  //   if (e.detail.userInfo !== undefined) {
  //     app.globalData.userInfo = e.detail.userInfo
  //     this.setData({
  //       userInfo: e.detail.userInfo,
  //       hasUserInfo: true
  //     })
  //   }
  // },
  /**
   * 页面跳转
   */
  turnToPage: function(e) {
    var router = e.currentTarget.dataset.router
    var pageUrl = '/pages/' + router + '/' + router
    wx.navigateTo({
      url: pageUrl
    })
  }
})