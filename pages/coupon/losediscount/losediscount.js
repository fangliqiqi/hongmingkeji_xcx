const https = require("../../../utils/https")

// pages/coupon/losediscount/losediscount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loseDiscount:[],//失效券列表
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
    this.getloseDiscount()
  },
  // 获取失效列表
  getloseDiscount(){
    https.getJSON('/share/userCardActivationBusiness/listUsed').then(res=>{
      // console.log(res)
      if(res.data.code==200){
        this.setData({
          loseDiscount:res.data.rows
        })
      }
    })
  },
  // 已核销查看核销成功的页面
  cancelCard(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/coupon/cancelCard/cancelCard?id='+id,
    })
  },
   // 点击清空
   clear(){
    let datas = this.data.loseDiscount
    let arr = []
    datas.map(items=>{
      arr.push(items.idStr)
    })
    console.log(arr)
    let data = {
      ids:arr
    }
    let that = this;
    wx.showModal({
      title: '是否清空所有失效优惠券',
      confirmColor:'#2253f4',
      success (res) {
        if (res.confirm) {
          https.postJSON('/share/userCardActivationBusiness/removeList',data).then(res=>{
            console.log(res)
            if(res.data.code==200){
              wx.showToast({
                title: '失效券已清空',
                icon:'none'
              })
              that.getloseDiscount()
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