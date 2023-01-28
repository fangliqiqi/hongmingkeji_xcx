const __arg = function () {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = wx.AppUrl + arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
    }
  }
  return setting;
}
const __json = function (method, setting) {
  setting.method = method;
  if ("POST" == method) {
    setting.header = {
      'content-type': 'application/x-www-form-urlencoded',
      // 'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId': wx.uId || '',
      'X-Auth-Open': wx.openId
    };
  } else if ("PUT" == method) {
    setting.header = {
      // 'content-type': 'application/x-www-form-urlencoded',
      'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId': wx.uId || '',
      'X-Auth-Open': wx.openId
    };
  } else {
    setting.header = {
      'content-type': 'application/json',
      'X-Auth-Token': wx.uId,
      'X-Auth-UseId': wx.uId || '',
      'X-Auth-Open': wx.openId
    };
  }
  return new Promise(function (resolve, reject) {
    setting.success = resolve
    setting.fail = reject
    wx.request(setting);
  })
}

var payJSON = function (url, data, cbUrl) {
  var AppUrl = wx.AppUrl;
  return new Promise((resolve, reject) => {
    let userId = data.userId || wx.uId || '';
    // data.paymentAmount=0.01
    wx.request({
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'X-Auth-Open': wx.openId,
        'X-Auth-UseId': userId
      },
      url: AppUrl + url,
      data: data,
      method: 'POST',
      success: function (res) {
        console.log('api result:');
        console.log(res.data);
        if (res.data.code == '200') {
          // 发起支付
          cbUrl = res.data.data.notify_url||cbUrl
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            fail: reject,
            success: function (bbb) {
              console.log(bbb);
              wx.request({
                method: 'POST',
                url: AppUrl + cbUrl,
                header: {
                  "content-type": "application/x-www-form-urlencoded",
                  'X-Auth-Open': wx.openId,
                  'X-Auth-UseId': userId
                },
                data: {
                  orderNo: res.data.data.orderNo || '',
                  sourceTypeId: data.sourceTypeId || '',
                  type: data.type || '',
                  orderId: res.data.data.orderId || data.orderId||'',
                  payStatus:data.payStatus||1
                },
                success: resolve,
                fail: reject
              })
            }
          })
        } else {
          return Promise.reject(new Error(res.data.msg))
        }
      }, fail: reject
    })
  })
}

module.exports = {
  postJSON: function () {
    return __json('POST', __arg.apply(this, arguments));
  },
  getJSON: function () {
    return __json('GET', __arg.apply(this, arguments));
  },
  putJSON: function () {
    return __json('PUT', __arg.apply(this, arguments));
  },
  delJSON: function () {
    return __json('DELETE', __arg.apply(this, arguments));
  },
  payJSON: payJSON,
  wxPay: function () {
    var arg = arguments;
    var url = '/wx/api/apiPay/prepay';
    var cbUrl = '/wx/api/apiPay/notify';
    return new Promise((resolve, reject) => {
      if (wx.uId) {
        var data = {};
        if (typeof arg[0] === 'object') {
          data = arg[0];
        }
        data.userId = wx.uId;
        console.info(data)
        // data.totalAmount = 0.01;
        if (!data.orderId) {
          data.orderId = "hm" + new Date().getTime();
        }
        resolve(
          payJSON(url, data, cbUrl)
        )
      } else {
        reject()
      }
    });
  }
}