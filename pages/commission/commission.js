// pages/commission/commission.js
const app  = getApp()
const store = require('../../utils/store')
const https = require("../../utils/https")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.AppUrl,
    loading: false,
    userInfo:{},
    // conlist:[],
    pageSize:10,
    pageNum:1,
    total:0 ,
    canWithdrawCommission:'',
    freezeCommission:'',
    totalCommission:''
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
      // conlist:[],
      pageNum:1 ,
      total:0 
    })
    this.getUser()
    this.getCommission()
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
            userInfo: res.data.data||null
          })
        }
        that.shareFun();
        that.getPageInfo();
      }
    }
  },
// 获佣金 代发金额等
getCommission:function(){
    var that = this;
    https.getJSON('/share/AgentProportionLog/commission/description').then((res) => {  
      // console.log(res)
      var  deslist = res.data.rows[0]
      console.log(deslist)
      if (res.data.code == 200){
        that.setData({
          canWithdrawCommission:deslist.canWithdrawCommission,
          freezeCommission:deslist.freezeCommission,
          totalCommission:deslist.totalCommission
        })
      }else{
        console.log('err')
      }
    }).catch((err) => {
      console.info(err)
    });
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
      // conlist:[],
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
      path: '/pages/commission/commission?recommendId='+userId,
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
    var that =this;
    let userId = that.data.userInfo?that.data.userInfo.userId:'';
    let recommendId = that.data.recommendId;
    store.getJSON('/share/order/amount',{
      userId:recommendId||userId||'',
      pageSize:that.data.pageSize,
      pageNum:that.data.pageNum 
    },function(res){
      console.info(res)
      if(res.data.code==200){
        // var conlist = that.data.conlist||[];
        that.setData({
          // conlist:conlist.concat(res.data.rows||[]),
          total:res.data.total||0,
          data:res.data.data
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
  toPage:function(e){
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let url = e.currentTarget.dataset.url;
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
        url: url,
      })
    }
  },
})