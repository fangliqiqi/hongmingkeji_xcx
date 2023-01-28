const server = require('./server');

function roundOne(arr){
  console.info(arr)
  console.info(typeof arr)
  let length = arr.length - 1;
  let idx = Math.round(Math.random()*length);
  console.info(idx)
  console.info(arr[idx])
  return arr[idx];
}

function loginResult(res) {
  if (res.data.code == 200) {
    let phoneArr =  res.data.phones.custPhone || [];
    let merArr = res.data.phones.merchantsPhone||[];
    wx.callPhone = roundOne(phoneArr) ;
    wx.merchantsPhone = roundOne(merArr) ;
    wx.openId = res.data.openId || '';
    wx.uId = res.data.userId ||'';
    console.info(wx)
  } else {
    wx.showToast({
      title: '登录失败',
      icon:'none'
    })
  }
}


function loginFun() {
  var funs = { success: null, fail: null, complete: null };
  var args = arguments;
  if (args.length > 0) {
    if (typeof args[0] == "function") {
      funs.success = function (res) {
        loginResult(res);
        args[0].apply(this, arguments);
      }
    } else if (typeof args[0] == "object") {
      funs.success = function (res) {
        loginResult(res);
        args[0].success.apply(this, arguments);
      }  || null
      funs.fail = args[0].fail || null
      funs.complete = args[0].complete || null
    } else {
      funs.success = args[0]
    }
  } else {
    funs.success = loginResult
  }
  var setting = {
    url: wx.AppUrl + '/wx/api/login',
    data: {}, header: {
      'content-type': 'application/json' // 默认值
    }, success: funs.success
    , fail: funs.fail
    , complete: funs.complete
  }
  wx.login({
    success: res => {
      setting.data.code = res.code
      wx.request(setting);
    },fail:res =>{
      if(typeof args[0].fail == 'function'){
        args[0].fail()
      }
    }
  })
}

function postJSON() {
  let that = this;
  let args = arguments;
  wx.checkSession({
    success() {
      //session_key 未过期，并且在本生命周期一直有效
      server.postJSON.apply(that, args);
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      loginFun(function () {
        server.postJSON.apply(that, args);
      }) //重新登录
    }
  })
}

function putJSON() {
  let that = this;
  let args = arguments;
  wx.checkSession({
    success() {
      //session_key 未过期，并且在本生命周期一直有效
      server.putJSON.apply(that, args);
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      loginFun(function () {
        server.putJSON.apply(that, args);
      }) //重新登录
    }
  })
}

function getJSON() {
  let that = this;
  let args = arguments;
  wx.checkSession({
    success() {
      //session_key 未过期，并且在本生命周期一直有效
      server.getJSON.apply(that, args);
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      loginFun(function () {
        server.getJSON.apply(that, args);
      }) //重新登录
    }
  })
}
module.exports = {
  loginFun: loginFun,
  getJSON: getJSON,
  postJSON: postJSON,
  putJSON: putJSON
}