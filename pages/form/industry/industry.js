// pages/form/industry/industry.js
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comObj:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(res) {
      console.log(res)
      that.setData({
        comObj:res.data||''
      })
    })
    this.getPageInfo()
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
  // onShareAppMessage: function () {

  // }
  getPageInfo:function(){
    var that =this;
    https.getJSON('/wx/api/industry/getMapIndustry').then((res)=>{
      console.info(res)
      if(res.data.code==200){
        that.setData({
          comlist:res.data.data||[]
        })
      }
    })
  },
  comtap:function(e){
    console.info(e)
    let item = e.currentTarget.dataset.item;
    this.setData({
      comObj:item
    })
  },
  resettap:function(){
    this.setData({
      comObj:''
    })
  },
  suretap:function(){
    const eventChannel = this.getOpenerEventChannel();
   let  comObj = this.data.comObj;
    wx.navigateBack({
      delta: 1,
      success:function(){
        eventChannel.emit('acceptDataFromOpenedPage', {data: comObj});
      }
    })
  }
})