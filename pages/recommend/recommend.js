// pages/recommend/recommend.js
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
    tabidx: '',
    conlist:[],
    pageSize:10,
    pageNum:1 ,
    total:0 ,
    recommendId:'',
    recommendInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var recommendId = options.recommendId||'';
    if(recommendId){
      that.setData({
        recommendId:recommendId||'',
      })
      app.getUser(recommendId,function(res){
        if(res.data.code==200){
          let data = res.data.data
          that.setData({
            recommendInfo:data||null
          })
        }
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
    this.setData({
      loading: true,
      conlist:[],
      pageNum:1 ,
      total:0 
    })
    this.getUser()
  },
  getUser: function () {
    var that = this;
    var userId = app.globalData.userId||'';
    if (!userId||userId=='') {
      that.setData({
        userInfo: null
      })
      that.shareFun();
      that.getPageInfo();
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      that.shareFun();
      that.getPageInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data || null
          })
        }
        that.shareFun();
        that.getPageInfo();
      }
    }
  },
  shareFun:function(){
    var that = this;
    let userId = app.globalData.userId;
    if(!userId||userId==""){
      wx.hideShareMenu()
    }else{
      wx.showShareMenu()
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
  onShareAppMessage: function (e) {
    console.info(e)
    var share_title = "共享会计 · 莫的问题"; //分享名称
    var userId = app.globalData.userId; //传的id
    let shareImg = this.data.shareImg;  //分享的时候展示的图片
    var that = this;
    if(!userId||userId==''){
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else if (e.from === 'button') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    var shareObj =  {
      title: share_title,
      path: '/pages/recommend/recommend?recommendId='+userId,
      imageUrl: shareImg ? shareImg :"/resource/image/share.jpg",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    console.info(shareObj)
    return shareObj
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
  getPageInfo: function (cb) {
    var that = this;
    let userId = that.data.userInfo?that.data.userInfo.userId:'';
    let recommendId = that.data.recommendId;
    let state = that.data.tabidx;
    store.getJSON('/share/user/recommend', { 
      recommendId:recommendId||userId||'',
      followState:state,
      pageSize:that.data.pageSize,
      pageNum:that.data.pageNum 
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
  tabfun: function (e) {
    let idx = e.currentTarget.dataset.idx;
    if(idx!=this.data.tabidx){
      this.setData({
        tabidx: idx,
        conlist:[],
        pageNum:1
      })
      this.getPageInfo();
    }
  },
  tiptap: function (e) {
    let state = e.currentTarget.dataset.state;
    if(state==20){
      wx.showToast({
        title: '经核实，该推荐无效\r\n请联络客服',
        icon: "none"
      })
    }
  },
  
})