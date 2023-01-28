// pages/wallet/expenseDetail/expenseDetail.js
const https = require("../../../utils/https");
const app  = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.cardUrl,
    url:wx.AppUrl,
    userInfo:null,
    orderId:null,//从上个页面带来的orderid
    logId:null,//从上个页面带来的id   用来来付款
    orderInfo:null,
    cardNum:null,//优惠券字段
    content:null,//购买须知
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId:options.orderId,
      logId:options.id
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
    this.getOrderInfo()
  },
  // 获取用户信息
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
        // roleIds:app.globalData.userInfo.roles
      })
      // that.decideRoles(that.data.roleIds)
      wx.hideNavigationBarLoading()
      // that.shareFun()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res&&res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null,
            // roleIds:res.data.data.roles
          })
          // that.decideRoles(that.data.roleIds)
        }
        wx.hideNavigationBarLoading()
        // that.shareFun()
      }
    }
  },
  // 获取订单详情
  getOrderInfo(){
    let data = {
      orderId:this.data.orderId
    }
    let that = this;
    https.getJSON('/share/cardOrder/getInfo',data).then(res=>{
      if(res.data.code==200){
        let datas = res.data.data.cardInfo
          if(datas.photoFlag=='yellow'){
            datas.cardColor='colorYellow'
          }else if(datas.photoFlag=='gray'){
            datas.cardColor='colorGray'
          }else if(datas.photoFlag=='cyan'){
            datas.cardColor='colorCyan'
          }else if(datas.photoFlag=='blue'){
            datas.cardColor='colorBlue'
          }
        that.setData({
          orderInfo:res.data.data
        })
        let num = res.data.data.cardBusinessList.length
        switch(num) {
          case 1:
            that.setData({
              cardNum:'一'
            })
             break;
          case 2:
            that.setData({
              cardNum:'二'
            })
             break;
             case 3:
            that.setData({
              cardNum:'三'
            })
             break;
             case 4:
            that.setData({
              cardNum:'四'
            })
             break;
             case 5:
            that.setData({
              cardNum:'五'
            })
             break;
     } 
      }
    })
    
  },
   // 点击打电话
   toPhone(){
    var phone = wx.callPhone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },

  // 付款
  payFun: function () {
    var that = this;
    var data = {
      logId:that.data.logId,                                                                                                                 
      totalAmount:that.data.orderInfo.payMoney,
      givenAmount:0
    }
      https.payJSON('/share/pay/cardPrepay', data,'/share/pay/cardNotify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg || '支付失败',
            icon: 'none',
            mask: true,
          })
        }
      }).catch((res)=>{
        wx.showToast({
          title: res.data.msg || '支付失败',
          icon: 'none',
          mask: true,
        })
      });
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