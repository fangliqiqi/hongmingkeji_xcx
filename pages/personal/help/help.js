// pages/personal/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabidx:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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
  tabtap:function(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      tabidx:idx
    })
  },
  toPage:function(e){
    let url = e.currentTarget.dataset.url;
    let idx = e.currentTarget.dataset.idx;
    if(url){
      wx.navigateTo({
        url: url,
        events: {
          fromOpenedPage:function(data){
            console.info(data)
          },

        },
        success: (res) => {
          res.eventChannel.emit('fromOpenerPage', { data: 'success' })
        },
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  }
})