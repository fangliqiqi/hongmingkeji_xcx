const app = getApp();
function wxpayfun(userId,orderId,url, func) {
  wx.request({
    header: {
      "content-type": "application/x-www-form-urlencoded",
      'X-Auth-Open': wx.openId,
      'X-Auth-UseId':userId ||''
    },
    url: url,
    data: {
      orderId: orderId,
      totalAmount:0.01,
      givenAmount:0
    },
    method: 'POST',
    success: function (res) {
      console.info(res);
      console.log('api result:');
      console.log(res.data);
      //console.log(res.data.data.timeStamp)
      if (res.data.errno == '0') {
        // 发起支付
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          fail: function (aaa) {
            //console.log(aaa);
            if (typeof (func) == 'function') {
              func(aaa, false)
            }
          },
          success: function (bbb) {
            //console.log(bbb);
            if (typeof (func) == 'function') {
              func(bbb, true)
            }
            wx.request({
              method: 'POST',
              url: wx.AppUrl+'/wx/api/apiPay/notify',
              header: {
                "content-type": "application/x-www-form-urlencoded",
                'X-Auth-Open': wx.openId,
                'X-Auth-UseId':userId ||''
              },
              data: {
                orderNo: res.data.data.orderNo
              },
              success:function(ress){
console.info(ress)
              },
              fail:function(resf){
                console.info(resf)
                              },
            })
          }
        })
      }else if (typeof (func) == 'function') {
        func(res, false)
      }
    },fail:function(res){
      wx.showToast({
        title: '调用支付失败',
        icon:'none'
      })
    }
  })
}
function wxpay(orderId, func) {
  var url = wx.AppUrl + '/wx/api/apiPay/prepay';
  if(wx.uId){
    wxpayfun(wx.uId,orderId, url, func)
  }else{
    wx.showToast({
      title: '请登录后支付',
      icon:'none'
    })
  }
  // wx.getStorage({
  //   key: 'userId',
  //   success:function(res){
  //     wxpayfun(res.data,orderId, url, func)
  //   },
  //   fail:function(res){
  //     wx.showToast({
  //       title: '请登录后支付',
  //       icon:'none'
  //     })
  //   }
  // })
}
module.exports = {
  wxpay: wxpay,
  wxpayfun: wxpayfun
}