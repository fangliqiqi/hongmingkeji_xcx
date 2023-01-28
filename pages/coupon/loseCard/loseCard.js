const https = require("../../../utils/https")
const app  = getApp()
// pages/coupon/loseCard/loseCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.cardUrl,
    url:wx.AppUrl,
    loseCard:[],
    loseId:[],//失效卡id 数组
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
    this.getLoseCard()
  },
  // 获取失效卡列表
  getLoseCard(){
    https.getJSON('/share/userCardActivation/overdueCardList').then(res=>{
      console.log(res)
      let datas = res.data.rows;
      let arr = []
      datas.map(items=>{
        arr.push(items.id)
      })
      if(res.data.code==200){
        this.setData({
          loseCard:datas,
          loseId:arr
        })
      }
    })
  },
  // 点击清空
  clear(){
    let that = this;
    let arr = that.data.loseId
    let data = {
      ids:arr
    }
    wx.showModal({
      title: '是否清空所有失效会员卡',
      confirmColor:'#2253f4',
      success (res) {
        if (res.confirm) {
          https.postJSON('/share/userCardActivation/deleteList',data).then(res=>{
            if(res.data.code==200){
              wx.showToast({
                title: '失效卡已清空',
                icon:'none'
              })
              that.getLoseCard()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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