var bmap = require('../../libs/bmap-wx.min.js');
const app = getApp()
Page({
  /**
   * 转发分享
   */
  onShareAppMessage: function() {
    return {
      title: app.globalData.share_slogan,
      path: '/pages/index/index'
    }
  },
  /**
   * 页面数据
   */
  data: {
    weatherData: "",
    ak: "mtxmirSI8Rrr4auxsCXklYYCeg4f6ECH",
    scanText: "扫二维码",
    inputText: "输入编号",
    width: app.globalData.systemInfo.windowWidth,
    height: app.globalData.systemInfo.windowHeight,
    isShowInputDialog: false,
    inputTitle: "提示",
    inputType: "number",
    placeholder: "请输入设备编号",
    focus: true,
    cancelText: "取消",
    confirmText: "确定",
    inputValue: null,
    scanValue: null,
    hasDev: app.globalData.devInfo.hasDev,
    devCount: app.globalData.devInfo.devCount,
    countText: '当前设备数：',
    headline: '设备',
    devName: '默认名称',
    isOnline: '在线',
    isShowMenu: false
  },
  showMenu: function() {
    this.setData({
      isShowMenu: !this.data.isShowMenu
    })
  },
  /**
   * 扫码添加设备
   */
  scanCode: function() {
    this.setData({
      isShowMenu: false
    })
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        // this.setData({
        //   scanValue: res.result
        // })
        app.showToast({
          title: '添加设备成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          devCount: that.data.devCount + 1,
          hasDev: true
        })
        var devInfo = {
          devCount: that.data.devCount,
          hasDev: that.data.hasDev,
        }
        //全局设置
        app.globalData.devInfo = devInfo
        //本地保存
        that.setDevStorge('devInfo', devInfo)
      },
      fail(res) {
      },
      complete(res) {
      }
    })
  },
  /**
   * 输入编号添加设备
   */
  inputNum: function() {
    this.setData({
      isShowMenu: false,
      isShowInputDialog: true
    })
  },
  /**
   * input触发事件
   */
  inputChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  prenventTouchMove: function() {
    console.log(123)
  },
  /**
   * 对话框确定按钮
   */
  onConfirm: function() {
    if (this.data.inputValue !== "" && this.data.inputValue !== null) {
      app.showToast({
        title: '输入成功',
        duration: 1000
      })
      //未写函数的调用
      this.myfun()
      this.setData({
        isShowInputDialog: false
      })
    } else {
      app.showToast({
        title: '输入错误',
        image: '/images/other/err.png',
        duration: 1000
      })
    }
  },
  /**
   * 对话框取消按钮
   */
  onCancel: function() {
    this.setData({
      isShowInputDialog: false
    })
  },
  /**
   * 将input的value值传给数据，然后清除掉，这个函数在确定里调用
   */
  myfun() {
    this.setData({
      inputValue: null
    })
  },
  addDevInfo: function() {
    console.log(123)
  },
  setDevStorge: function(key, data) {
    wx.setStorageSync(key, data)
  },
  /**
   * 获取天气信息
   */
  bMapWeather: function() {
    var that = this
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    })
    var fail = function (data) {
      console.log('获取天气失败！')
    }
    var success = function (data) {
      console.log('获取天气成功！')
      var weatherData = data.currentWeather[0]
      console.log(weatherData)
      weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      that.setData({
        weatherData: weatherData
      })
    }
    BMap.weather({
      fail: fail,
      success: success
    })
  }
})