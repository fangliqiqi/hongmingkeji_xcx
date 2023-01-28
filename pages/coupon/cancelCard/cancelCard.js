// pages/coupon/cancelCard/cancelCard.js
const https = require("../../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    discountInfo:{},//优惠券详情,
    code:null, //券码,
    scanCode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
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
    this.getScanCodeFun()
    this.getdiscountInfo()
  },
  // 获取详情
  getdiscountInfo(){
    let data = {
      id:this.data.id
    }
    let that = this;
    https.getJSON('/share/userCardActivationBusiness/getInfo',data).then(res=>{
      let code = res.data.data.idStr.replace(/(.{4})/g, "$1 ")
      if(res.data.code==200){
        that.setData({
          discountInfo:res.data.data,
          code:code
        })
      }
    })
  },
  // 获取二维码
  getScanCode:function(scene,func){
    var that = this;
    https.getJSON("/share/user/wxcode", {
      secene:scene,
      page: 'pages/personal/personal'
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
    var idx = that.data.id;
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

  }
})