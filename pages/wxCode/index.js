// pages/wxCode/index.js
const app = getApp();
const https = require('../../utils/https');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      idx:options.idx
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
    this.getUser()
  },
  getUser: function () {
    var that = this;
    if(app.globalData.userId==''){
      wx.hideNavigationBarLoading()
      that.setData({
        userInfo: null
      })
      that.shareFun()
    }else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      wx.hideNavigationBarLoading()
      that.shareFun()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null
          })
        }
        wx.hideNavigationBarLoading()
        that.shareFun()
      }
    }
  },
  shareFun:function(){
    var that = this;
    let userId = app.globalData.userId;
    if(!userId||userId==""){
      wx.hideShareMenu()
    }else{
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
        success: function (res) {
          console.info(res);
        },
        fail: function (res) {
          console.info(res);
        }
      })
    }
    that.getScanCodeFun(function(){

    })
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
  getScanCode:function(scene,func){
    var that = this;
    https.getJSON("/share/user/wxcode", {
      secene:scene,
      page: 'pages/index/index',
    }).then((res)=>{
      console.info(res)
      if (res.data.code == "200") {
        that.setData({
          scanCode:wx.CdnUrl+res.data.img_url
        })
      }
      if(typeof func == 'function'){
        func(res);
      }
    })
  },
  getScanCodeFun:function(func){
    var that = this;
    var userInfo = app.globalData.userInfo;
    var userId = app.globalData.userId;
    var idx = that.data.idx;
    var sharescene = 'r=' + (userId || '')+'&idx='+idx;
    if(userInfo&&userInfo.userId){
      that.getScanCode(sharescene,function(ress){
        if(typeof func == 'function'){
          func(ress);
        }
      })
    }else if(userId){
      app.getUser(userId,function(res){
        let data = res.data.data || "";
        if(res.data.code=='200'&&data){
          sharescene = 'r=' +(data.userId || '')+'&idx='+idx;
        }
        that.getScanCode(sharescene,function(ress){
          if(typeof func == 'function'){
            func(ress);
          }
        })
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
})