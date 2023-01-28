// pages/share/share.js
const app = getApp();
const store = require("../../utils/store");
const utils = require("../../utils/util");
const https = require("../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    isRecommend: false,
    isRError: false,
    userInfo: {},
    region: ['', '', ''],
    index: '',
    orderTypeList:[],
    // servers: wx.serlist.filter((e)=>{
    //   return e!='';
    // }),
    share: {
      recommendId: '',
      userName: '',
      userPhone: '',
      province: '',
      city: '',
      county: '',
      orderContent: '',
      orderType: ''
    },
    bannerList:[],
    msgList:[],
    msgobj:'',
    animation:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options)
    var that = this;
    if(options.idx){
      let list = this.data.servers;
      let index =options.idx-1;
      this.setData({
        index: index+'',
        'share.category': list[index].id
      })
    }
    
    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPageInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getUser();
    this.msgFun();
    this.getorderType();
  },
  getUser: function () {
    var that = this;
    if (app.globalData.userId == '') {
      wx.hideNavigationBarLoading();
      that.shareFun();
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        'share.recommendId': app.globalData.userInfo.userId
      })
      wx.hideNavigationBarLoading();
      that.shareFun();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data || null,
            'share.recommendId': res.data.data.userId
          })
        }
        wx.hideNavigationBarLoading();
        that.shareFun();
      }
    }
  },
  shareFun:function(){
    var that = this;
    let userId = app.globalData.userId||'';
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
  // 获取服务类型
  getorderType(){
    https.postJSON('/share/AgentBusinessType/list4Order').then((res) => {
      // console.log(res)
      this.setData({
        orderTypeList:res.data.data
      })     
    }).catch((err) => {
      console.info(err)
    });
  },
  //选择城市
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let vl = e.detail.value;
    this.setData({
      region: vl,
      'share.province': vl[0],
      'share.city': vl[1],
      'share.county': vl[2]
    })
  },
  // 选择服务类型
  bindPickerChange: function (e) {
    // console.log(e.detail.value)
    var orderTypeList = this.data.orderTypeList || [];
    // console.log(orderTypeList)
    var value = e.detail.value;
    this.setData({
      index: value,
      'share.orderType': orderTypeList[value].id
    })
  },

  inputfun: function (e) {
    var vl = e.detail.value;
    let idx = e.currentTarget.dataset.idx;
    if (idx == 1) {
      this.setData({
        'share.userName': vl
      })
    } else if (idx == 2) {
      this.setData({
        'share.userPhone': vl
      })
    } else if (idx == 3) {
      this.setData({
        'share.orderContent': vl
      })
    }
  },

  // 提交 到 意向订单
  submintap: utils.throttle(function (e) {
    this.subminfun(e);
  }, 3000),
  subminfun: function (e) {
    var that = this;
    let userId = app.globalData.userId || '';
    // console.info(e);
    let item = that.data.share;
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login?cb=1'
      })
    } else if (item.userName.trim().length == 0) {
      wx.showToast({
        title: '请输入被推荐人姓名',
        icon: 'none'
      })
    } else if (item.userPhone.trim().length < 11) {
      wx.showToast({
        title: '请输入被推荐人手机号',
        icon: 'none'
      })
    } else if (item.province.length == 0) {
      wx.showToast({
        title: '请选择被推荐人所在城市',
        icon: 'none'
      })
    } else if (item.orderType.length == 0) {
      wx.showToast({
        title: '请选择服务类型',
        icon: 'none'
      })
    } else {
      // console.log(item)
      store.getJSON('/share/agentIntentionOrder/addIntentionOrder', item, function (res) {
        console.info(res)
        if(res.data.code==200){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '/pages/personal/intorder/intorder'
               })
              }, 2000) //延迟时间
            }    
          })
        }else{
          console.log('提交失败')
        }
      })
    }
  },
  
  toPage: function () {
    var that = this;
    let item = {
      recommendId: app.globalData.userId,
      nickName: '',
      phonenumber: '',
      prov: '',
      city: '',
      county: '',
      remark: '',
      category: ''
    }
    this.setData({
      share: item,
      index: '',
      region: ['', '', ''],
      isRecommend: false
    })
  },
  bannerFun: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    let idx = e.currentTarget.dataset.idx;
    let url = e.currentTarget.dataset.url;
    let web = e.currentTarget.dataset.web;
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login?idx=' + idx+'&url='+url,
      })
    } else if (idx == -1) {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
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
  closeFun: function () {
    this.setData({
        isRError: false
      })
  },
  getPageInfo:function(){
    var that =this;
    console.info('获取Banner')
    wx.request({
      url: wx.AppUrl + '/share/banner/getBanner',
      data:{
        type:40
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
  }
})