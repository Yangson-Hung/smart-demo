const app = getApp()

Page({
  /**
   * 转发分享
   */
  onShareAppMessage: function() {
    return {
      title: app.globalData.share_slogan,
      path: '/pages/map/map'
    }
  },
  /**
   * 页面数据 
   */
  data: {
    mapAttr: {
      id: "map",
      subkey: app.globalData.subkeys[app.globalData.subkey],
      scale: 16,
      latitude: 39.908823,
      longitude: 116.397470,
      markers: [{
        id: 1,
        iconPath: '/images/map_pic/home.png',
        width: '24px',
        height: '24px',
        latitude: app.globalData.markerInfo.latitude,
        longitude: app.globalData.markerInfo.longitude,
        callout: {}
      }],
      circles: [{
        latitude: app.globalData.circleCenter.latitude,
        longitude: app.globalData.circleCenter.longitude,
        radius: app.globalData.circleRadius,
        color: "#2a5caa",
        fillColor: "#7cb5ec88",
        strokeWidth: 1
      }],
      showLocation: true,
      enable3d: true,
      showCompass: true,
      enableRotate: true,
      enableOverlooking: true
    },
    mapStyleList: ['经典样式', '墨渊样式', '白浅样式', '烟翠样式', ],
    width: app.globalData.systemInfo.windowWidth,
    height: app.globalData.systemInfo.windowHeight,
    failFlag: false,
    showModalCount: 0,
    showModal: false,
    inputTitle: "提示",
    inputType: "number",
    inputValue: null,
    placeholder: "请输入半径范围（米）",
    focus: true,
    cancelText: "取消",
    confirmText: "确定"
  },
  /**
   * 监听页面加载
   */
  onLoad: function() {
    var that = this
    //获取位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          'mapAttr.latitude': res.latitude,
          'mapAttr.longitude': res.longitude,
        })
        app.showToast({
          title: "注意保持手机定位为开启状态",
          icon: "none",
          duration: 2500
        })
      },
      fail: function(err) {
        console.log(err)
        if (err.errMsg === "getLocation:fail:auth denied" || err.errMsg === "getLocation:fail:auth canceled") {
          //用户拒绝授权的情况
          app.showModal({
            content: "拒绝获取位置信息将无法为您提供服务，建议允许",
            showCancel: true,
            confirmText: "允许",
          })
        } else {
          //同意授权时，但用户未开启手机定位服务（或者手机禁止微信获取定位权限）
          app.showModal({
            content: "获取位置失败，请开启定位功能或检查手机定位权限设置",
            confirmText: '确定',
          })
          //showModalCount控制情景：
          //首次进入小程序（或者关掉后台再次进入小程序）获取位置失败时，只显示一个模态窗，即onLoad的showModal模态窗
          //failFlag控制情景：
          //进入fail回调，failFlag值都被设置为true，控制重新获取定位后显示成功提示框
          that.setData({
            showModalCount: 1,
            failFlag: true
          })
        }
      }
    })
  },
  /**
   * 监听页面显示
   */
  onShow: function() {
    var that = this
    /**
     * 获取用户授权
     */
    wx.getSetting({
      success: function(res) {
        //如果已经授权
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              if (res.latitude !== that.data.mapAttr.latitude &&
                res.longitude !== that.data.mapAttr.longitude) {
                that.setData({
                  'mapAttr.latitude': res.latitude,
                  'mapAttr.longitude': res.longitude
                })
              }
              //用户使用小程序时手动关闭手机定位功能再重新开启获取定位成功时显示成功提示框
              //或用户首次使用小程序获取定位失败（onLoad获取定位失败），在用户开启定位功能，onShow获取定位成功时显示提示框
              if (that.data.failFlag === true) {
                app.showToast({
                  title: "重新定位成功",
                  duration: 2500
                })
                //将标记改为默认false
                that.setData({
                  failFlag: false
                })
              }
            },
            fail: function(err) {
              console.log(err)
              //onLoad获取定位成功，onShow获取定位失败时，这个情况是在用户使用小程序时手动关闭手机定位功能
              if (that.data.showModalCount === 0) {
                app.showModal({
                  content: "定位失效，请检查网络环境或重新开启定位",
                  confirmText: '确定'
                })
                that.setData({
                  failFlag: true
                })
              }
            }
          })
        }
      }
    })
    this.showDevLocation()
  },
  /**
   * 监听页面渲染 
   */
  onReady: function() {
    //获取地图上下文
    this.mapCtx = wx.createMapContext('map')
  },
  /**
   * 移动地图中心至定位点
   */
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
    //将地图的缩放级别设为默认
    this.setData({
      'mapAttr.scale': 16
    })
  },
  /**
   * 改变地图样式
   */
  changeMapStyle: function() {
    var that = this
    app.showModal({
      title: '更改地图样式',
      content: '选择地图样式后，点击左下退出按钮，再重新进入使设置生效',
      showCancel: true,
      confirm: function() {
        wx.showActionSheet({
          itemList: that.data.mapStyleList,
          itemColor: "#2a5caa",
          success: function(res) {
            var subkey
            switch (res.tapIndex) {
              case 0:
                subkey = "key1"
                break
              case 1:
                subkey = "key2"
                break
              case 2:
                subkey = "key3"
                break
              case 3:
                subkey = "key4"
                break
            }
            //将用户选择的样式对应的key存入本地缓存
            wx.setStorageSync('subkey', subkey)
          }
        })
      }
    })
  },
  /**
   * 地图放大
   */
  clickToMagnify: function() {
    var that = this
    //获取地图的缩放级别
    this.mapCtx.getScale({
      success: function(res) {
        //获取成功时且获取值小于上限值时
        if (res.scale < 20) {
          that.setData({
            'mapAttr.scale': res.scale + 1
          })
        }
      }
    })
  },
  /**
   * 地图缩小
   */
  clickToShrink: function() {
    var that = this
    //获取地图的缩放级别
    this.mapCtx.getScale({
      success: function(res) {
        //获取成功时且获取值大于下限值时
        if (res.scale > 3) {
          that.setData({
            'mapAttr.scale': res.scale - 1
          })
        }
      }
    })
  },
  /**
   * 点击地图标记
   */
  clickMarkers: function(e) {
    if (e.markerId == 1) {
      this.setData({
        showModal: !this.data.showModal
      })
      var _markers = this.data.mapAttr.markers;
      var currMarker = _markers.find(function(x) {
        return x.id == e.markerId
      })
      this.setData({
        'mapAttr.circles[0].latitude': currMarker.latitude,
        'mapAttr.circles[0].longitude': currMarker.longitude,
        'mapAttr.markers[0].callout': {}
      })
      var circleCenter = {
        latitude: currMarker.latitude,
        longitude: currMarker.longitude
      }
      this.setPositionInfo('circleCenter', circleCenter)
    }
  },
  /**
   * 选择地点
   */
  choosePosition: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          //二次选择位置时，清除circle内容
          'mapAttr.circles[0].latitude': null,
          'mapAttr.circles[0].longitude': null,
          'mapAttr.circles[0].radius': 0,
          //选择位置后获得经纬度
          'mapAttr.markers[0].latitude': res.latitude,
          'mapAttr.markers[0].longitude': res.longitude,
          'mapAttr.markers[0].callout': {
            content: '点击设置范围',
            color: '#1e90ff',
            fontSize: 10,
            borderRadius: '10',
            bgColor: '#ffffff',
            padding: 10,
            display: 'ALWAYS'
          }
        })
        var markerInfo = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.setPositionInfo('markerInfo', markerInfo)
      }
    })
  },
  /**
   * 对话框确定按钮
   */
  onConfirm: function() {
    if (this.data.inputValue !== "" && this.data.inputValue !== null) {
      app.showToast({
        title: '范围设置完成',
        duration: 1000
      })
      this.setData({
        'mapAttr.circles[0].radius': +this.data.inputValue,
        //赋值后清除，if控制入口
        inputValue: null,
        showModal: !this.data.showModal,
      })
      var circleRadius = this.data.mapAttr.circles[0].radius
      this.setPositionInfo('circleRadius', circleRadius)
    } else {
      app.showToast({
        title: '输入值不正确',
        image: '/images/other/err.png',
        duration: 1500
      })
      this.setData({
        showModal: !this.data.showModal
      })
    }
  },
  /**
   * 对话框取消按钮
   */
  onCancel: function() {
    this.setData({
      showModal: !this.data.showModal
    })
  },
  /**
   * input自动聚焦
   */
  autoFocus: function() {
    this.setData({
      focus: true
    })
  },
  /**
   * input触发事件
   */
  inputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 添加设备成功后，地图上显示标记
   */
  showDevLocation: function() {
    if (app.globalData.devInfo.hasDev) {
      this.setData({
        'mapAttr.markers[1]': {
          id: 2,
          // iconPath: '/images/map_pic/home.png',
          width: '24px',
          height: '24px',
          latitude: 25.7039154131,
          longitude: 119.3105632067,
        }
      })
    }
  },
  /**
   * 保存地点信息
   */
  setPositionInfo: function(key, data) {
    wx.setStorageSync(key, data)
  }
})