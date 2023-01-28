const https = require("../../utils/https");
// pages/personal/personal.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    url:wx.AppUrl,
    roleIds:[],//多重身份数组
    myroleFlag:false, //是不是等于114 进行判断
    roleFlag:false,//判断在不在109~113之间
    userInfo:null,
    bannerList:[],
    userFlag:false,
    agentId:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPageInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    this.getUser();
    wx.getSetting({
      success:function(res){
        that.setData({
          userFlag:res.authSetting['scope.userInfo']||false
        })
      },
      fail:function(res){
        that.setData({
          userFlag:false
        })
      }
    });
     
  },
  // 判断多重身份角色是否在109 113中间  判断是不是等于114
  decideRoles(arr){
    arr.map(items=>{
      if(items.roleId>=109 && items.roleId <= 113){
        this.setData({
          roleFlag:true
        })
      }else{
        this.setData({
          roleFlag:false
        })
        if(items.roleId==114){
            this.setData({
              myroleFlag:true
            })
        }else{
          this.setData({
            myroleFlag:false
          })
        }
      }
    })
  },
  getUser: function () {
    var that = this;
    if(app.globalData.userId==''){
      wx.hideNavigationBarLoading()
      that.setData({
        userInfo: null
      })
      that.shareFun()
    }else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        roleIds:app.globalData.userInfo.roles
      })
      that.decideRoles(that.data.roleIds)
      wx.hideNavigationBarLoading()
      that.shareFun()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res&&res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null,
            roleIds:res.data.data.roles
          })
          that.decideRoles(that.data.roleIds)
        }
        wx.hideNavigationBarLoading()
        that.shareFun()
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
    this.getAgentlist();
  },

  // 获取能看到代理人订单的id数组信息
  getAgentlist(){
    var that = this;
    // console.log(that.data.userInfo.userId)
    https.getJSON('/share/agentOrderPermissionUser/idList').then(res=>{
      if(res.data.code == 200){
        let agentArr = res.data.data;
        // console.log(agentArr)
        let userId = that.data.userInfo&&that.data.userInfo.userId;
        if(agentArr.indexOf(userId) > -1){
          this.setData({
            agentId:true
          })
        }else{
          this.setData({
            agentId:false
          })
        }
      }  
    })
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
    var that =this;
    if(app.globalData.userId==''){
      wx.showToast({
        title: '请登录后刷新',
        icon:'none',
        complete:function(){
          wx.stopPullDownRefresh()
        }
      })
    }else{
      app.getUser(app.globalData.userId,function(res){
        console.info(res)
        if(res.data.code==200){
          that.setData({
            userInfo: res.data.data||null
          })
        }
        wx.stopPullDownRefresh()
      })
    }
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
      path: '/pages/index/index?recommendId='+userId,
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

  getUserInfo: function (e) {
    console.info('点击')
    var that = this;
    https.getJSON('/wx/api/getUserInfo', {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      rawData: e.detail.rawData,
      signature: e.detail.signature
    }).then(function (res) {
      if (res.data.code == "200") {
        var data = res.data.user;
        console.info(data)
        if (data.wxFlag == 1) {
          that.setData({
            userInfo: data
          })
        }
      }
    }).catch()
  },
  toPage:function(e){
    var that = this;
    let userId = app.globalData.userId||'';
    console.info(e);
    let url = e.currentTarget.dataset.url;
    let idx = e.currentTarget.dataset.idx;
    let web = e.currentTarget.dataset.web;
    let login = e.currentTarget.dataset.login;
    if(login!=2&&(!userId||userId=='')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else if(url=="-1"){
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon:'none'
      })
    }else if(url){
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

  intCb:function(e){
    var that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  // 点击到意向订单同时订阅消息
  toIntorder(e){
    console.log(e)
    var arg = arguments;
    var that = this;
    wx.getSetting({
      withSubscriptions: true, success: function (res) {
        console.log(res)
        if (res.subscriptionsSetting && res.subscriptionsSetting['mainSwitch']) {
          wx.requestSubscribeMessage({
            tmplIds: wx.noticesid,
            success(resp) {
              console.info(resp)
              var temp = resp[wx.noticesid[0]];
                try {
                  wx.setStorageSync('noticeflag', temp);
                } catch (error) {
                  console.info(error)
                }
                that.intCb(e,temp)
            },
            fail(resp) { 
              console.info(resp)
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(()=>{
                    that.intCb(e,'reject')
                  },2000)
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '用户已关闭消息推送',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(()=>{
                that.intCb(e,'reject')
              },2000)
            }
          })
        }
      }
    })
  },

  getPageInfo: function () {
    var that = this;
    console.info('获取Banner')
    wx.request({
      url: wx.AppUrl + '/share/banner/getBanner',
      data:{
        type:20
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
  },
  noticeCb:function(e){
    var that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  toNotice:function(e){
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: wx.noticesid,
      success(resp) {
        console.info(resp)
        var temp = resp[wx.noticesid[0]];
          try {
            wx.setStorageSync('noticeflag', temp);
          } catch (error) {
            console.info(error)
          }
          that.noticeCb(e,temp)
      },
      fail(resp) { 
        console.info(resp)
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 2000,
          success: function () {
              that.noticeCb(e,'reject')
          }
        })
      }
    })
  },
  toAgent:function(e){
    console.log(e)
    var arg = arguments;
    var that = this;
    wx.getSetting({
      withSubscriptions: true, success: function (res) {
        console.log(res)
        if (res.subscriptionsSetting && res.subscriptionsSetting['mainSwitch']) {
          wx.requestSubscribeMessage({
            tmplIds: wx.noticesid,
            success(resp) {
              console.info(resp)
              var temp = resp[wx.noticesid[0]];
                try {
                  wx.setStorageSync('noticeflag', temp);
                } catch (error) {
                  console.info(error)
                }
                that.noticeCb(e,temp)
            },
            fail(resp) { 
              console.info(resp)
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(()=>{
                    that.noticeCb(e,'reject')
                  },2000)
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '用户已关闭消息推送',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(()=>{
                that.noticeCb(e,'reject')
              },2000)
            }
          })
        }
      }
    })
  },
  video(){
    
  },
  //跳转到积分商城
  toOther(){
    // console.log(this.data.userInfo)
    let userInfo = this.data.userInfo
    wx.navigateToMiniProgram({
      appId:'wx231e850433dd4393',
      path: 'pages/home/home?account',
      extraData:{
        account: userInfo.phonenumber
      },
      envVersion: 'trial',
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }


})