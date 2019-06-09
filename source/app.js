const config = require('./config')
App({
  /**
   * 监听小程序初始化
   */
  onLaunch: function() {
    var that = this
    //小程序云能力初始化
    wx.cloud.init({
      traceUser: true
    })

    //获取openid
    this.getOpenidViaCloud()

    //获取存在本地的openid
    this.globalData.openid = wx.getStorageSync("openid")

    var tmp = wx.getStorageSync("userInfo")

    //读取到本地缓存的用户信息
    if (tmp !== "") {
      this.globalData.userInfo = tmp
      this.globalData.hasUserInfo = true
      
      const db = wx.cloud.database()
      db.collection('device').where({
        _openid: this.globalData.openid
      }).get({
        success: res => {
          if (res.data.length !== 0) {
            db.collection('location').where({
              _openid: that.globalData.openid
            }).get({
              success: res => {
                that.globalData.gpsinfo.id = res.data[0].id,
                that.globalData.gpsinfo.latitude = res.data[0].latitude,
                that.globalData.gpsinfo.longitude = res.data[0].longitude
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
            wx.reLaunch({
              url: '/pages/welcome/welcome',
            })
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    }
    //获取系统信息
    this.getSystemInfo()
    //设置地图样式
    this.setMapStytle()
    //读取地点信息
    this.readPositionInfo()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
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
        that.globalData.windowHeight = res.windowHeight
        that.globalData.windowWidth = res.windowWidth
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
      success: function(res) {
        typeof param.success == 'function' && param.success(res);
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
   * 设置地图样式
   */
  setMapStytle: function() {
    var subkey = wx.getStorageSync('subkey')
    if (subkey !== "") {
      this.globalData.subkey = subkey
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
        wx.setStorageSync("openid", res.result.openid)
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
    gpsinfo: {
      id: null,
      latitude: null,
      longitude: null
    },
    openid: null,
    markerInfo: {
      latitude: null,
      longitude: null
    },
    circleCenter: {
      latitude: null,
      longitude: null
    },
    circleRadius: 0,
    userInfo: "",
    hasUserInfo: false,
    windowHeight: null,
    windowWidth: null,
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