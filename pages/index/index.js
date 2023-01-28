const store = require("../../utils/store");
const util = require("../../utils/util");
const https = require("../../utils/https");
// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    system: wx.getSystemInfoSync(),
    loading: false,
    bannerList: [],
    activeList:[],
    userInfo: null,
    alert: '',
    msgobj:'',
    animation:'',
    timer:'',
    isMsg:false,
    msgItem:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options)
    if (options.path) {
      this.setData({
        alert: 100
      })
    }
    wx.showNavigationBarLoading();
    console.info("生命周期函数--监听页面加载")
    this.getPageInfo();
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.getUser();
    this.msgFun();
  },
  getUser: function () {
    var that = this;
    let userId = app.globalData.userId;
    console.info("userId" + userId)
    console.info(app.globalData.userInfo)
    if (userId == "") {
      console.info("userId" + userId)
      wx.hideNavigationBarLoading();
      that.shareFun();
    } else if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading();
      that.setData({
        userInfo: app.globalData.userInfo,
        userId: userId
      })
      that.shareFun();
      // that.getImageFun();
    } else {
      app.userInfoCallBack = res => {
        console.info('index-app.userInfoCallBack')
        wx.hideNavigationBarLoading();
        if (res && res.data && res.data.code == 200 && res.data.data) {
          that.setData({
            userInfo: res.data.data || null,
            userId: res.data.data.userId || ''
          })
        }
        that.shareFun();
        // that.getImageFun();
      }
    }
  },
  shareFun: function () {
    var that = this;
    let userId = app.globalData.userId || '';
    if (!userId || userId == "") {
      wx.hideShareMenu()
    } else {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage'],
        success: function (res) {
          console.info(res);
        },
        fail: function (res) {
          console.info(res);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let timer = this.data.timer;
    if(timer){
      clearInterval(timer)
    }
  },
  msgFun:function(){
    var that = this;
    https.getJSON('/wx/api/getUserData/list').then((res)=>{
      console.info(res)
      if(res.data.code==200){
        var msglist = res.data.data;
        if(msglist.length>0){
          app.msgFun(msglist,(msg)=>{
            that.setData(msg)
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    var that = this;
    this.getPageInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.info(e)
    let that = this;
    that.setData({
      loading: true
    })
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 2000)
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
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else if (e.from === 'button') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    var shareObj = {
      title: share_title,
      path: '/pages/index/index?recommendId=' + userId,
      imageUrl: shareImg ? shareImg : "/resource/image/share.jpg",
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
  // ssonShareTimeline: function (e) {
  //   console.info(e)
  //   var share_title = "共享会计 · 莫的问题"; //分享名称
  //   var userId = app.globalData.userId; //传的id
  //   let shareImg = this.data.shareImg;  //分享的时候展示的图片
  //   var that = this;
  //   var shareObj = {
  //     title: share_title,
  //     query: 'recommendId='+userId,
  //     imageUrl: shareImg ? shareImg : "/resource/image/share.jpg",
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  //   return shareObj;
  // },
  getPageInfo: function () {
    var that = this;
    console.info('获取Banner')
    wx.request({
      url: wx.AppUrl + '/share/banner/getBanner',
      data:{
        type:10
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == 200) {
          that.setData({
            bannerList: res.data.bannerList || []
          })
        }
      },
      fail: function (res) {
        console.info(res)
      },
      complete:function(res){
        wx.stopPullDownRefresh();
      }
    })
    wx.request({
      url: wx.AppUrl + '/wx/api/fActivity/homeActivityList',
      data:{
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == 200) {
          that.setData({
            activeList: res.data.data || []
          })
        }
      },
      fail: function (res) {
        console.info(res)
      },
      complete:function(res){
        wx.stopPullDownRefresh();
      }
    })
  },
  toPage: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let idx = e.currentTarget.dataset.idx;
    let url = e.currentTarget.dataset.url;
    let item = e.currentTarget.dataset.item;
    let web = e.currentTarget.dataset.web;
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login?idx=' + idx+'&obj='+(item?JSON.stringify(item):'')+'&url='+url,
      })
    } else if (idx == -1) {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      })
    } else if (url&&item) {
      wx.navigateTo({
        url: url+"&obj="+JSON.stringify(item),
      })
    } else if (url) {
      if (web == 1) {
        wx.navigateTo({
          url: '/pages/web/web?url=' + url,
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    }

  },
  getImageFun: function () {
    var that = this;
    store.getJSON("/share/user/wxcode", {
      secene: 'rid=' + app.globalData.userId || 'test',
      page: 'pages/index/index'
    }, function (res) {
      console.info(res)
      if (res.data.code == "200") {
        that.setData({
          imagename: "data:image/png;base64," + res.data.img_data
        })
      }
    })
  },
  showtoastfun:function(e){
    let msg = e.currentTarget.dataset.msg;
    this.setData({
      isMsg:true,
      msgItem:msg
    })
  },
  closeFun:function(){
    this.setData({
      isMsg:false,
      msgItem:''
    })
  },
})