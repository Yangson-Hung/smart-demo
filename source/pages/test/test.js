Page({
  sendTemplateMessageViaCloudFunction(e) {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        formId: e.detail.formId,
        templateId: '3zFqf3nZ35Pb_SqshO_bOG89AbS59L8iU3dALv162-g',
        time: '123456',
        text: '123',
        where: '8888',
        phone: '55555'
      },
    }).then((res) => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  }
})
