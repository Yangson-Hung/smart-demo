const util = require('../../utils/util.js')
const app = getApp()
var codeNum = 123456

Page({
  data: {
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
    saveDisabled: true,
    sendDisabled: true,
    devName: '默认设备名'
  },
  onLoad(){
  },
  //发送短信
  sendShortMessage: function() {
    // codeNum = Math.ceil(Math.random() * (999999 - 100000) + 100000)
    wx.cloud.callFunction({
      name: 'zhenzisms_send',
      data: {
        apiUrl: 'https://sms_developer.zhenzikj.com',
        appId: '101770',
        appSecret: 'b7dfe8eb-2bf7-41b5-a899-7f6685fc75c8',
        message: this.data.phoneNumber+'，设备绑定验证码为:'+codeNum+'，该验证码有效期为5分钟，请在小程序中输入。安诺智行科技', 
        number: this.data.phoneNumber,
        messageId: ''
      },
      success(res) {
        console.log(res.result.body)
        app.showToast({
          title: '发送成功'
        })
      },
      fail: res => {
        app.showToast({
          title: '发送失败！',
          image: '../../images/fail.png'
        })
      }
    })
  },
  //验证码输入
  inputCodeNum: function(e){
    if(e.detail.value.length === 6){
      var userInput = parseInt(e.detail.value)
      if (userInput === codeNum){
        this.setData({
          mycode: userInput
        })
      } else {
        app.showToast({
          title: '验证码错误',
          image: '../../images/fail.png',
        })
      }
    }
  },
  //手机号码输入
  inputPhoneNumber: function(e) {
    var phoneNumber = e.detail.value
    if (phoneNumber.length === 11) {
      var checkStatus = this.checkPhoneNumber(phoneNumber)
      if (checkStatus) {
        this.setData({
          phoneNumber: e.detail.value,
          sendDisabled: false
        })
        this.activeButton()
      }
    }
  },
  //手机号码框失去焦点
  losePhoneNumberFocus: function(e) {
    if (e.detail.value.length !== 11) {
      app.showToast({
        title: '请输入11位手机号',
        image: '../../images/fail.png',
      })
      this.setData({
        sendDisabled: true
      })
    }
  },
  //检查手机号码是否正确
  checkPhoneNumber: function(phoneNumber) {
    let str = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
    if (str.test(phoneNumber)) {
      return true
    } else {
      app.showToast({
        title: '手机号不正确',
        image: '../../images/fail.png',
      })
      this.setData({
        sendDisabled: true
      })
      return false
    }
  },
  //联系人输入
  inputLianXiRen: function(e) {
    this.setData({
      lianXiRen: e.detail.value
    })
    this.activeButton()
  },
  //使用者姓名输入
  inputShiYongZhe: function(e) {
    this.setData({
      shiYongZhe: e.detail.value
    })
    this.activeButton()
  },
  //设备名输入
  inputDeviceName: function(e) {
    this.setData({
      devName: e.detail.value
    })
    this.activeButton()
  },
  //按钮激活
  activeButton: function() {
    let {
      phoneNumber,
      mycode,
      lianXiRen,
      shiYongZhe,
      devName
    } = this.data
    if (phoneNumber && mycode && lianXiRen && shiYongZhe && devName) {
      this.setData({
        saveDisabled: false
      })
    } else {
      this.setData({
        saveDisabled: true,
      })
    }
  },
  //设备绑定通知
  deviceBindingNotification: function(e) {
    //tmp作为设备id和编号
    var tmp =  'SW-'+Math.ceil(Math.random() * (999999 - 100000) + 100000)
    var createTime = util.formatTime(new Date(Date.now()))
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        formId: e.detail.formId,
        templateId: 'vqVcvbnuHXe21KArLaUIR9lC18F8gCxQS821Uquj_0E',
        page: 'pages/index/index',
        phone: e.detail.value.phone,
        info: '您提交的设备绑定成功了',
        time: createTime,
        bianhao: tmp,
        xinghao: 'SmartWalking-OE1',
        devName: e.detail.value.devName
      },
    }).then((res) => {
      const db = wx.cloud.database()
      db.collection('device').add({
        data: {
          devId: tmp,
          devName: e.detail.value.devName
        },
        success: res => {
          app.globalData.deviceInfo.push({
            //保存到全局的设备名
            devName: e.detail.value.devName,
             //保存到全局的设备ID
            devId: tmp
          })

          //查询GPS信息
          db.collection('location').where({
            _openid: app.globalData.openid
          }).get({
            success: res => {
              app.globalData.gpsinfo.id = res.data[0].id
              app.globalData.gpsinfo.latitude = res.data[0].latitude
              app.globalData.gpsinfo.longitude = res.data[0].longitude
            }
          })
        }
      })
      wx.showLoading({
        title: '绑定中',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
      setTimeout(function() {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }, 2000)
    }).catch(err => {
      console.error(err)
    })
  }
})