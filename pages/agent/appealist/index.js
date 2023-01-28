// pages/agent/appealist/index.js
const app = getApp();
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyId:'',
    tabidx: '',
    tabsidx:20,
    appealState:20, 
    conlist:[],
    pageSize:5,
    pageNum: 1,
    total: 0,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      companyId:options.cid
    })
    // that.getPageInfo()
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
      pageNum: 1,
      total: 0
    })
    this.getPageInfo()
  },

  // 获取页面信息
  getPageInfo:function(){
    var that = this;
    let gdata = app.globalData;
    let userId = gdata.userId;
    let companyId = this.data.companyId||(gdata.userInfo&&gdata.userInfo.companyId||'')
    wx.hideNavigationBarLoading()
     var data = {
      companyId:companyId,
      sqlFalg :1,
      appealState:this.data.appealState,
      pageSize: that.data.pageSize,
      pageNum: that.data.pageNum
      }
    if(userId){
      https.getJSON('/share/source/listAuditByUserApp', data).then((res) => {
      console.info(res.data)
      if (res.data.code == 200) {
        // 数据拼接
        var conlist = that.data.conlist || [];
        var arr = conlist.concat(res.data.rows || [])||[]
        that.setData({
          total: res.data.total || 0,
          conlist:arr
        })
      }
        if (typeof cb == 'function') {
          cb(res)
        }
      }).catch(function onRejected(error) {
        console.info(error)
      });
    }else{
      that.getUser();
    }






    // var data = {
    //   companyId:this.data.companyId,
    //   sqlFalg :1,
    //   appealState:this.data.appealState,
    //   pageSize: that.data.pageSize,
    //   pageNum: that.data.pageNum
    //   }
    // https.getJSON('/share/source/listAuditByUserApp', data).then((res) => {
    //   console.info(res.data)
    //   if (res.data.code == 200) {
    //     // 数据拼接
    //     var conlist = that.data.conlist || [];
    //     var arr = conlist.concat(res.data.rows || [])||[]
    //     that.setData({
    //       total: res.data.total || 0,
    //       conlist:arr
    //     })
    //   }
    //   if (typeof cb == 'function') {
    //     cb(res)
    //   }
    // }).catch(function onRejected(error) {
    //   console.info(error)
    // });
  },

  // tab 切换
  tabsfun: function (e) {
    let idx = e.currentTarget.dataset.idx;
    if (idx != this.data.tabsidx) {
      this.setData({
        tabsidx: idx,
        appealState:idx,
        conlist: [],
        pageNum: 1,
        tabidx: 0
      })
      this.getPageInfo();
    }
  },

  bindscrolltolower(){
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

  toPage(e){
    // console.log(e)
    let id = e.currentTarget.dataset.id;
    if(this.data.appealState==30){
      console.log('已审核列表')
      wx.navigateTo({
        url: '../detail/index?id='+ id,
      })
    }
  },

  getUser: function () {
    var that = this;
    let userId = app.globalData.userId;
    if (userId == "") {
      console.info("userId" + userId)
      wx.hideNavigationBarLoading();
    } else if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading();
      that.setData({
        userInfo: app.globalData.userInfo,
        userId: userId
      })
      that.getPageInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info('index-app.userInfoCallBack')
        wx.hideNavigationBarLoading();
        if (res && res.data && res.data.code == 200 && res.data.data) {
          that.setData({
            userInfo: res.data.data || null,
            userId: res.data.data.userId || ''
          })
          that.getPageInfo();
        }
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
      conlist: [],
      pageNum: 1,
      total: 0
    })
    that.getPageInfo(function () {
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

  }
})