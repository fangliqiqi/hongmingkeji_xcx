// pages/partner/recharge/public/index.js
const app = getApp();
const https = require('../../../../utils/https');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0,
    typeId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideHomeButton()
    if(options){
      this.setData({
        typeId:options.typeId||'',
        amount:options.amount||0
      })
    }
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
  toHome:function(e){
    var that = this;
    let data = {
      sourceTypeId:that.data.typeId,
      totalAmount:that.data.amount,
      givenAmount:0
    }
    https.getJSON('/wx/api/apiPay/payTransfer',data).then((res)=>{
      wx.reLaunch({
        url: '/pages/index/index',
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }).catch((err)=>{
      wx.reLaunch({
        url: '/pages/index/index',
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    })
    
  },
  callPhone: function () {
    var phone = wx.callPhone;
    var that = this;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        complete: function () {
          that.setData({
            isShow: false
          })
        }
      })
    }
  },
})