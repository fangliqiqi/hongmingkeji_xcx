const store = require("../../../utils/store");
const app =getApp()
// pages/partner/cost/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    tabidx:0,
    tabindex:'',
    tempindex:'',
    years:[],
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    searchDate:['',''],
    tempDate:['',''],
    conlist:[],
    pageSize:10,
    pageNum:1 ,
    total:0 ,
    year:'',
    month:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getYears:function(){
    var that = this;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var years = [];
    for (let i = 2000; i <= year; i++) {
      years.push(i)
    }
    that.setData({
      year:year,
      years:years,
      searchDate:[year-2000,month],
      tempDate:[year-2000,month],
      month:month+1
    })
    that.getPageInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getYears()
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

  bindscrolltolower: function (e) {
    console.info(e)
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
  tabtap:function(e){
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      tabidx:idx
    })
  },
  tabfun:function(e){
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      tempindex:idx
    })
  },
  bindChange:function(e){
    var vl = e.detail.value;
    console.info(e)
    this.setData({
      tempDate:vl
    })
  },
  sureFun:function(e){
    var that  = this;
    var idx = e.currentTarget.dataset.idx;
    var date = that.data.tempDate;
    var years = that.data.years||[];
    var tabindex = that.data.tempindex;
    if(idx==1){
      this.setData({
        searchDate:date,
        month:date[1]+1,
        year:years[date[0]],
      })
    }else if(idx==2){
      this.setData({
        tabindex:tabindex||''
      })
    }
    this.setData({
      tabidx:0,
      pageNum:1,
      conlist:[],
    })
    this.getPageInfo();
  },
  getPageInfo: function (cb) {
    var that = this;
    let userId = app.globalData.userId||'';
    let state = that.data.tabindex||'';
    store.getJSON('/share/payEpetOrder/getUserEpetOrder', { 
      userId:userId,
      pageSize:that.data.pageSize,
      pageNum:that.data.pageNum,
      year:that.data.year||'',
      month:that.data.month||'',
      type:state
    }, function (res) {
      console.info(res)
      if(res.data.code==200){
        var conlist = that.data.conlist||[];
        that.setData({
          conlist:conlist.concat(res.data.rows||[]),
          total:res.data.total||0
        })
      }
      if(typeof cb =='function'){
        cb(res)
      }else{
        that.setData({
          loading: false
        })
      }
    })
  },
})