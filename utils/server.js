//接口访问域名地址
function __args() {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = wx.AppUrl + arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
      setting.success = arguments[2];
    } else {
      setting.success = arguments[1];
    }
  }
  console.info(setting)
  return setting;
}
function __json(method, setting) {
  setting.method = method;
  if ("POST" == method) {
    setting.header = {
      'content-type': 'application/x-www-form-urlencoded',
      // 'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId':wx.uId ||'',
      'X-Auth-Open': wx.openId
    };
  } else if ("PUT" == method) {
    setting.header = {
      // 'content-type': 'application/x-www-form-urlencoded',
      'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId':wx.uId ||'',
      'X-Auth-Open': wx.openId
    };
  } else {
    setting.header = {
      'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId':wx.uId ||'',
      'X-Auth-Open': wx.openId
    };
  }

  console.info(setting)
  var func = setting.success;
  setting.success = (res) => {
    console.info(res)
    if (res.data.code == 888) {
      console.info(888)
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      func(res);
    }
  }
  wx.request(setting);
}

module.exports = {
  getJSON: function () {
    __json('GET', __args.apply(this, arguments));
  },
  postJSON: function () {
    __json('POST', __args.apply(this, arguments));
  },
  putJSON: function () {
    __json('PUT', __args.apply(this, arguments));
  },
  sendTemplate: function (formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success,   // errorcode==0时发送成功
      fail: fail
    });
  }
}
