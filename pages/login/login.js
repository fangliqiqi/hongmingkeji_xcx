// pages/login/login.js
const utils = require("../../utils/util");
const store = require("../../utils/store");
const https = require("../../utils/https")
const app = getApp();
var timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginSuccess:false,
    count:6,
    codeCount:61,
    isDisabled:true,
    phoneNumber:'',
    code:'',
    idx:'',
    isBind:1,
    cb:0,
    userInfo:'',
    userId: '',
    loginIdx:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options)
    wx.hideShareMenu();
    this.setData({
      idx:options.idx||'',
      cb:options.cb||0,
      redUrl:options.url||'',
      obj:options.obj||''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUser();
  },
  getUser: function () {
    var that = this;
    let userId = app.globalData.userId;
    console.info("userId" + userId)
    console.info(app.globalData.userInfo)
    let redUrl = that.data.redUrl;
    let idx = that.data.idx;
    if (userId == "") {
      console.info("userId" + userId)
      wx.hideNavigationBarLoading();
    } else if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading();
      that.setData({
        userInfo: app.globalData.userInfo,
        userId: userId
      })
      if(redUrl){
        that.toHome();
      }
    } else {
      app.userInfoCallBack = res => {
        console.info('index-app.userInfoCallBack')
        wx.hideNavigationBarLoading();
        if (res && res.data && res.data.code == 200 && res.data.data) {
          that.setData({
            userInfo: res.data.data || null,
            userId: res.data.data.userId || ''
          })
          if(redUrl){
            that.toHome();
          }
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  codeTap:utils.throttle(function(e){
    var that = this;

    if(that.data.phoneNumber.length!=11){
      wx.showToast({
        title: '请正确填写手机号',
        icon:'none'
      })
    }else if(this.data.codeCount==61){
      this.sendCode(e);
    }else{

    }
  },3000),
  sendCode:function(e){
    var that = this;
    var phone = that.data.phoneNumber;
    utils.countFun(function(res){
      console.info(res)
      that.setData({
        codeCount:res<=0?61:res
      })
    },61)
    store.getJSON("/share/user/sendCode",{
      phone:phone
    },function(res){
      if(res.data.code==200){
        that.setData({
          isDisabled:false
        })
      }
    })
  },

  submitap:function(e){
    var that = this;
    var phone =that.data.phoneNumber;
    var code = that.data.code;
    var recommendId = wx.getStorageSync('recommendId');
    var posterId = wx.getStorageSync('posterId');
    var posterType = wx.getStorageSync('posterType');
    let isBind = that.data.isBind;
    let data = {
      phonenumber:phone,
      code:code,
      recommendId:recommendId||'',
      posterId:posterId||'',
      posterType:posterType||'',
      wxBind:isBind
    };
    if(isBind==1){
      data.encryptedData=e.detail.encryptedData||"";
      data.iv= e.detail.iv||"";
      data.rawData= e.detail.rawData||"";
      data.signature= e.detail.signature||""
    }
    console.info(data)
    
    store.postJSON("/share/user/login_phone",data,function(res){
      if(res.data&&res.data.code==200){
        that.setData({
          loginSuccess:true
        })
        if(res.data.userId){
          // wx.setStorageSync('userId', res.data.userId);
          wx.uId = res.data.userId;
          wx.removeStorageSync('recommendId');
          app.globalData.userId = res.data.userId;
          app.getUser(res.data.userId);
        }
        wx.setNavigationBarColor({
          frontColor:"#000000",
          backgroundColor:"#ffffff"
        })
        timer = utils.countFun(function(res){
          that.setData({
            count:res
          })
          if(res<=0){
            that.toHome();
          }
        })
      }else{
        wx.showToast({
          title: res.data.msg||'登录失败',
          icon:"none"
        })
      }
    })

   
    
  },
  toHome:function(){
    let cb = this.data.cb;
    let redUrl = this.data.redUrl;
    let idx = this.data.idx;
    let obj = this.data.obj;
    if(redUrl&&redUrl!='undefined'){
      wx.redirectTo({
        url: redUrl+'?idx='+idx+'&obj='+obj
      })
    }else if(cb==1){
      wx.navigateBack({
        delta: 1,
      })
    }else{
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
  },
  inputfun:function(e){
    console.info(e);
    let idx = e.currentTarget.dataset.idx;
    if(idx==1){
      this.setData({
        phoneNumber:e.detail.value
      })
    }else if(idx==2){
      this.setData({
        code:e.detail.value
      })
    }
  },
  checkboxChange:function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const values = e.detail.value
    this.setData({
      isBind:values.join()==1?1:0
    })
  },
  tabfun:function(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      loginIdx:idx
    })
  },
  getPhoneNumber:function(e){
    console.info(e)
    var that =this;
    if(e.detail.errMsg=="getPhoneNumber:ok"){
      var recommendId = wx.getStorageSync('recommendId');
        var posterId = wx.getStorageSync('posterId');
        var posterType = wx.getStorageSync('posterType');
      var data =e.detail;
      data.inviteCode =recommendId&&recommendId!='null'?recommendId:''
      data.recommendId =recommendId&&recommendId!='null'?recommendId:''
      data.posterId =posterId&&posterId!='null'?posterId:''
      data.posterType =posterType&&posterType!='null'?posterType:''
      https.postJSON('/wx/api/getPhoneNumber',data).then((res)=>{
        console.info(res)
        if(res.data.code==200&&res.data.userId){
          that.setData({
            loginSuccess:true
          })
          wx.uId = res.data.userId;
          app.getUser(wx.uId);
          app.globalData.userId = res.data.userId;
          wx.removeStorageSync('recommendId');
          wx.setNavigationBarColor({
            frontColor:"#000000",
            backgroundColor:"#ffffff"
          })
          timer = utils.countFun(function(res){
            that.setData({
              count:res
            })
            if(res<=0){
              that.toHome();
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch((res)=>{
        console.info(res)
        wx.showToast({
          title: res.data.msg||'授权失败',
          icon:'none'
        })
      })
    }
  },
})