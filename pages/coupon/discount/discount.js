// pages/coupon/discount/discount.js
const https = require("../../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],//优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getcouponList()
  },
  getcouponList(){
    https.getJSON('/share/userCardActivationBusiness/list',{userCardBusinessType:1}).then(res=>{
      if(res.data.code==200){
        this.setData({
          couponList:res.data.rows
        })
      }
    })
  },
  // 点击失效优惠券
  toPage(){
    wx.navigateTo({
      url: '/pages/coupon/losediscount/losediscount',
    })
  },
  // 点击优惠券 去使用
  toDetail(e){
    let id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: '/pages/coupon/discountDetail/discountDetail?id='+id,
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