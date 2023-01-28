// pages/coupon/discountDetail/discountDetail.js
const https = require("../../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,//优惠券id
    discountInfo:{},//优惠券详情,
    code:null, //券码,
    scanCode:null,
    roleKey:null,//核销人角色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('核销详情页面')
    console.log(options)
    var orderId = wx.getStorageSync('orderId');
    if(options&&options.scene){
      const scene = decodeURIComponent(options.scene);
      orderId = scene.split("=")[1];
    }
      // 扫码进入小程序
    this.setData({
      id:options.id||orderId
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
    this.getdiscountInfo()
    this.getScanCodeFun()
  },
  // 获取优惠券详情
  getdiscountInfo(){
    let that = this;
    https.getJSON('/share/userCardActivationBusiness/getInfo',{id:this.data.id}).then(res=>{
      console.log("优惠券详情")
      console.log(res)
      let code = res.data.data.idStr.replace(/(.{4})/g, "$1 ")
      if(res.data.code==200){
        that.setData({
          discountInfo:res.data.data,
          code:code
        })
      }
    })
  },
   // 获取用户信息
   getUser: function () {
    var that = this;
    if (app.globalData.userInfo) {
      let datas = app.globalData.userInfo.roles
      that.setData({
        userInfo: app.globalData.userInfo
      })
      this.getScanCodeFun()
    } else {
      app.userInfoCallBack = res => {
        if (res&&res.data && res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            userInfo: res.data.data||null
          })
          this.getScanCodeFun()
        }
      }
    }
  },
   // 点击打电话
   toPhone(){
    var phone = wx.callPhone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },
  // 获取二维码
  getScanCode:function(scene,func){
    var that = this;
    https.getJSON("/share/user/wxcode", {
      secene:scene,
      // page: 'pages/personal/personal'
      // page: 'pages/personal/disorder/disorder'
      page: 'pages/coupon/discountDetail/discountDetail'
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
    this.setData({
      roleKey:this.data.userInfo.roles.some(item=>{
        return item.roleKey=='hxzy';
      })
    })
  },
  getScanCodeFun:function(func){
    var that = this;
    var userInfo = app.globalData.userInfo;
    var userId = app.globalData.userId||wx.uId;
    var idx = that.data.id;
    // var sharescene = 'c=' + (userId || '')+'&idx='+idx;
    var sharescene = 'c='+idx;
    // var sharescene =idx;
    if(userInfo&&userInfo.userId){
      this.setData({userInfo:userInfo})
      that.getScanCode(sharescene,function(ress){
        if(typeof func == 'function'){
          func(ress);
        }
      })
    }else if(userId){
      app.getUser(userId,function(res){
        let data = res.data.data || "";
        if(res.data.code=='200'&&data){
          // sharescene = 'r=' +(data.userId || '')+'&idx='+idx;
          sharescene = 'c='+idx;
          that.setData({userInfo:data})
        }
        that.getScanCode(sharescene,function(ress){
          if(typeof func == 'function'){
            func(ress);
          }
        })
      })
    }else{
      this.getUser()
    }
  },

  // 核销
  cancel(){
    let data = {
      cardCode:this.data.id
    }
    let that = this;
    https.getJSON('/share/userCardActivationBusiness/business/chargeOff',data).then(res=>{
      console.log(res)
      if(res.data.code==200){
        wx.showToast({
          title: '核销成功',
          success:function(){
            that.getdiscountInfo()
          }
        })
      }
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

  }
})