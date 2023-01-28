// components/login/index.js
const app = getApp();
const https = require("../../utils/https");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo:null
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes: {
    attached:function(){
      console.info(this.data.userInfo)
      if(app.globalData.userInfo){
        this.setData({
          userInfo:app.globalData.userInfo
        })
      }
    }
  },
  pageLifetimes:{
    show:function(){
      if(app.globalData.userInfo){
        this.setData({
          userInfo:app.globalData.userInfo
        })
      }else{
        this.setData({
          userInfo:null
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    stopfun:function(){
      return false;
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
            wx.uId = res.data.userId;
            app.globalData.userId = res.data.userId;
            app.getUser(wx.uId,function(resp){
              let data = resp.data.data||''
              that.setData({
                userInfo:data
              })
              if (data) {
                app.globalData.userInfo = data;
                wx.uId = data.userId || '';
                app.globalData.userId = data.userId;
                console.log(data)
                app.getAgentist(data.userId,data.roles)
              } else {
                app.globalData.userId = "";
                wx.uId = '';
                app.globalData.userInfo = null;
              }
              if (app.userInfoCallBack) {
                app.userInfoCallBack(res)
              }
              that.triggerEvent('login', res.data, resp.data)
            });
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }).catch((res)=>{
          console.info(res)
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        })
      }
    },
    getUserInfo: function (e) {
      console.info('点击')
      var that = this;
      https.getJSON('/wx/api/getUserInfo', {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        rawData: e.detail.rawData,
        signature: e.detail.signature
      }).then(function (res) {
        if (res.data.code == "200") {
          var data = res.data.user;
          // console.info(data)
          app.getUser(data.userId)
        }
        that.updateFlagFun()
      }).catch(err=>{
        that.updateFlagFun()
      })
    },

    updateFlagFun:function(){
      var that = this;
      https.postJSON('/wx/api/updateLoginFlag').then((res)=>{
        console.info(res)
        if(res.data.code==200){
          let userInfo = app.globalData.userInfo;
          userInfo.loginFlag = 20;
          if(userInfo){
            that.setData({
              userInfo:userInfo
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch((res)=>{
        console.info(res)
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      })
    }
  }
})
