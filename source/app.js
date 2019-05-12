const config = require('./config')
App({
  /**
   * 监听小程序初始化
   */
  onLaunch: function() {

    //小程序云能力初始化
    wx.cloud.init({
      traceUser: true
    })

    //获取openid
    this.getOpenidViaCloud()
    //获取系统信息
    this.getSystemInfo()
    //设置地图样式
    this.setMapStytle()
    //读取设备信息
    this.readDevInfo()
    //读取地点信息
    this.readPositionInfo()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * 获取手机系统信息
   */
  getSystemInfo: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.systemInfo = res;
      }
    })
  },
  /**
   * 显示模态对话框
   */
  showModal: function(param) {
    wx.showModal({
      title: param.title || '',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#2a5caa',
      success: function(res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function(res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function(res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  /**
   * 显示消息提示框
   */
  showToast: function(param) {
    wx.showToast({
      title: param.title,
      icon: param.icon || "success",
      image: param.image || "",
      duration: param.duration || 1500,
    })
  },
  /**
   * 设置地图样式
   */
  setMapStytle: function() {
    var subkey = wx.getStorageSync('subkey')
    if (subkey !== "") {
      this.globalData.subkey = subkey
    }
  },
  /**
   * 从本地读取设备信息
   */
  readDevInfo: function() {
    var devInfo = wx.getStorageSync('devInfo')
    if (devInfo !== "") {
      this.globalData.devInfo = devInfo
    }
  },
  /**
   * 从本地读取地点信息
   */
  readPositionInfo: function() {
    var circleCenter = wx.getStorageSync('circleCenter')
    if (circleCenter !== "") {
      this.globalData.circleCenter = circleCenter
    }

    var circleRadius = wx.getStorageSync('circleRadius')
    if (circleRadius !== "") {
      this.globalData.circleRadius = circleRadius
    }

    var markerInfo = wx.getStorageSync('markerInfo')
    if (markerInfo !== "") {
      this.globalData.markerInfo = markerInfo
    }
  },
  /**
   * 获取openid
   */
  getOpenidViaCloud: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.globalData.openid = res.result.openid
        console.log(res)
      },
      fail: err => {
        console.log("get openid fail!", err)
      }
    })
  },
  /**
   * 全局数据
   */
  globalData: {
    openid: null,
    markerInfo: {
      laittude: null,
      longitude: null
    },
    circleCenter: {
      laittude: null,
      longitude: null
    },
    circleRadius: 0,
    devInfo: {
      hasScan: false,
      devCount: 0
    },
    userInfo: null,
    systemInfo: {},
    appTitle: "安若智行监护",
    share_slogan: "智能拐杖 助力出行",
    subkey: 'key1',
    subkeys: {
      key1: 'UYOBZ-M5DKG-35WQ4-IL2TQ-LMGP6-NFBLN',
      key2: 'MLKBZ-LXH64-KOLUO-XXNSU-UTCDK-4SBPQ',
      key3: 'DOABZ-GGOCU-H5CVS-4GJCN-CTJTK-4YBR3',
      key4: 'VYHBZ-UV4KJ-EWLF2-KIESM-APMJ2-QGFG7'
    }
  },
})