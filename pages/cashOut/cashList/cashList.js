// pages/cashOut/cashList/cashList.js
const app  = getApp()
const store = require('../../../utils/store')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    userInfo:{},
    conlist:[],
    pageSize:10,
    pageNum:1,
    total:0  
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
    this.getUser()
  },
  getUser: function () {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      that.getPageInfo()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null
          })
        }
        that.getPageInfo()
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
    this.bindscrolltolower()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindscrolltolower: function () {
    let that = this;
    let total = that.data.total;
    let pageSize = that.data.pageSize;
    let pageNum = that.data.pageNum +1
    if(!that.data.loading&&Math.ceil(total/pageSize) >=pageNum){
      that.setData({
        loading: true,
        pageNum:pageNum
      })
      this.getPageInfo(function(){
        that.setData({
          loading: false
        })
      })
    }
  },
  getPageInfo: function (cb) {
    wx.hideNavigationBarLoading()
    var that =this;
    let userId = that.data.userInfo.userId;
    store.getJSON('/share/draw/cashlist',{
      userId:userId,
      pageSize:that.data.pageSize,
      pageNum:that.data.pageNum 
    },function(res){
      console.info(res)
      if(res.data.code==200){
        var conlist = that.data.conlist||[];
        that.setData({
          conlist:conlist.concat(res.data.rows||[]),
          total:res.data.total||0,
          data:res.data.data
        })
      }
      if(typeof cb =='function'){
        cb(res)
      }
    })
  },
  toPage:function(e){
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let url = e.currentTarget.dataset.url;
    let item = e.currentTarget.dataset.item;
    if(!userId){
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else if(url=="-1"){
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon:'none'
      })
    }else if(url){
      wx.navigateTo({
        url: url+JSON.stringify(item),
      })
    }
    
  },
})