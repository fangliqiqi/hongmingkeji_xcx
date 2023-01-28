// pages/partner/index.js
const app = getApp();

const store = require('../../utils/store')
const https = require("../../utils/https");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.AppUrl,
    userInfo: {},
    conObj:null,
    isAgent:-1,
    bargainInfo:{}
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
    var that  =this ;
    wx.getStorage({
      key: 'isNotice',
      success:function(res){
        that.setData({
          isAgent:res.data
        })        
      },fail:function(){
        that.setData({
          isAgent:1
        })  
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUser();
    this.getBargain();
  },
  getUser: function () {
    var that = this;
    if (app.globalData.userId == '') {
      wx.hideNavigationBarLoading()
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      this.getPageInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res&&res.data && res.data.code == 200) {
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
    this.getUser();
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
  getPageInfo(){
    var that = this;
    store.postJSON('/wx/api/partner/getData',{
      userId:app.globalData.userId
    },function(res){
      console.info(res)
      if(res.data.code==200){
        that.setData({
          conObj:res.data.data||null
        })
      }
      wx.stopPullDownRefresh();
    })
  },

  //获取成交信息展示
  getBargain(){
    https.getJSON('/share/source/makeCount').then((res) => {  
      console.log(res)
      let  bargainInfo = this.data.bargainInfo
      console.log(res.data.data)
      if(res.data.code == 200){
        this.setData({
          bargainInfo:res.data.data
        })   
      }
    })
  },
  
  toPage:function(e){
    var that = this;
    let userId = app.globalData.userId||'';
    console.info(e);
    let url = e.currentTarget.dataset.url;
    let obj = e.currentTarget.dataset.obj||null;
    let cid = e.currentTarget.dataset.cid||'';
    if(!userId||userId==''){
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else if(url=="-1"){
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon:'none'
      })
    }else if(url&&obj){
      wx.navigateTo({
        url: url+'?obj='+JSON.stringify(obj)+'&cid='+cid,
      })
    }else if(url){
      wx.navigateTo({
        url: url,
      })
    }
  }, 
})