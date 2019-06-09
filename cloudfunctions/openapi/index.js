const cloud = require('wx-server-sdk')
cloud.init()

//设备绑定提醒通知
async function deviceBindingNotification(event) {
  const {
    OPENID
  } = cloud.getWXContext()

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    templateId: event.templateId,
    formId: event.formId,
    page: event.page,
    data: {
      keyword1: {
        value: event.phone,
      },
      keyword2: {
        value: event.info,
      },
      keyword3: {
        value: event.time,
      },
      keyword4: {
        value: event.bianhao
      },
      keyword5: {
        value: event.xinghao
      }
    }
  })
  return sendResult
}

exports.main = async(event) => {
  return deviceBindingNotification(event)
}