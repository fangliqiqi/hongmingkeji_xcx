// pages/bankCard/bankCard.js
const app = getApp()
const store = require('../../utils/store')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.AppUrl,
    loading: false,
    userInfo: {},
    conlist: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.showNavigationBarLoading();
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
    this.setData({
      conlist: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    })
    this.getUser();

  },
  getUser: function () {
    var that = this;
    var userId = app.globalData.userId;
    if (userId == '') {
      wx.hideNavigationBarLoading()
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      this.getPageInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data || null
          })
        }
        this.getPageInfo();
      }
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
    var that = this;
    that.setData({
      loading: true,
      conlist:[],
      pageNum:1 ,
      total:0 
    })
    that.getPageInfo(function(){
      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh();
    })
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

  bindscrolltolower: function (e) {
    console.info(e)
    let that = this;
    let total = that.data.total;
    let pageSize = that.data.pageSize;
    let pageNum = that.data.pageNum + 1
    if (!that.data.loading && Math.ceil(total / pageSize) >= pageNum) {
      that.setData({
        loading: true,
        pageNum: pageNum
      })
      this.getPageInfo(function () {
        that.setData({
          loading: false
        })
      })
    }
  },
  getPageInfo: function (cb) {
    wx.hideNavigationBarLoading()
    var that = this;
    let userId = that.data.userInfo.userId;
    store.getJSON('/share/bank/list', {
      userId: userId,
      pageSize: that.data.pageSize,
      pageNum: that.data.pageNum
    }, function (res) {
      console.info(res)
      if (res.data.code == 200) {
        var conlist = that.data.conlist || [];
        that.setData({
          conlist: conlist.concat(res.data.rows || []),
          total: res.data.total || 0,
          data: res.data.data
        })
      }
      if (typeof cb == 'function') {
        cb(res)
      }
    })
  },


  toPage: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let item = e.currentTarget.dataset.item;
    if (!userId) {
      wx.navigateTo({
        url: '/pages/login/login?idx=' + idx,
      })
    } else{
      wx.navigateTo({
        url: '/pages/bankCard/add/add?item=' + (item?JSON.stringify(item):'')
      })
    }

  },
})