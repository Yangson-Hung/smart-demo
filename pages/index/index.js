const app = getApp()
Page({
  /**
   * 转发分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_slogan,
      path: '/pages/index/index'
    }
  },
  /**
   * 页面数据
   */
  data: {
    btnScanText: "扫码添加设备",
    btnInputText: "输入编号添加设备",
    width: app.globalData.systemInfo.windowWidth,
    height: app.globalData.systemInfo.windowHeight,
    showModal: false,
    inputTitle: "提示",
    inputType: "number",
    placeholder: "请输入设备编号",
    focus: true,
    cancelText: "取消",
    confirmText: "确定",
    inputValue: null,
    scanValue: null,
    isScan: app.globalData.devInfo.isScan,
    hasDev: app.globalData.devInfo.hasDev,
    devCount: app.globalData.devInfo.devCount,
    countText: '个设备',
    headline: '设备',
    devName: '默认名称',
    isOnline: '在线'
  },
  showMenu: function() {
    // wx.showActionSheet({
    //   itemList: ['1','2'],
    //   success: function() {

    //   }
    // })
    this.setData({
      isShowMenu: true
    })
  },
  /**
   * 扫码添加设备
   */
  btnScanCode: function () {
    var that = this
    wx.scanCode({
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
          devCount: that.data.devCount+1,
          hasDev: true,
          isScan: true
        })
        var devInfo = {
          devCount: that.data.devCount,
          hasDev: that.data.hasDev,
          isScan: that.data.isScan
        }
        //全局设置
        app.globalData.devInfo = devInfo
        //本地保存
        that.setDevStorge('devInfo', devInfo)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  /**
   * 输入编号添加设备
   */
  btnInputNum: function () {
    this.showModal()
  },
  /**
   * input触发事件
   */
  inputChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  prenventTouchMove: function () {
    console.log(123)
  },
  /**
   * 对话框确定按钮
   */
  onConfirm: function () {
    if (this.data.inputValue !== "" && this.data.inputValue !== null) {
      app.showToast({
        title: '输入成功',
        duration: 1000
      })
      //未写函数的调用
      this.myfun()
      this.hideModal()
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
  onCancel: function () {
    this.hideModal()
  },
  /**
   * 显示模态框
   */
  showModal: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 隐藏模态框
   */
  hideModal: function () {
    this.setData({
      showModal: false
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
  ceshi() {
    console.log(123)
  },
  setDevStorge: function (key, data) {
    wx.setStorageSync(key, data)
  }
})