// pages/personal/disorder/disorder.js
const app  = getApp()
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    intorderList:[],
    tabidx: '',
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 重写搜索中点击文字按钮没有作用
    let t = this, 
    sbar = this.selectComponent("#searchbar"),
    { hideInput } = sbar
    // console.log(this.selectComponent("#searchbar"))
    // 重写
    Object.defineProperties(sbar.__proto__, {
      hideInput:{
        configurable: true,
        enumerable: true,
        writable: true,
        value(...p){
           // 加上这句，同时wxml需要加上bindcancel="cancel"
          this.triggerEvent('cancel', {})
          // 或者这里直接调用下面的cancel方法，那么wxml就不需要bindcancel
          // t.cancel()
          // 执行原方法，返回原方法结果
          return hideInput.apply(sbar, p)
        }
      }
    })
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
    this.getIntorderList()
  },
  // 获取意向订单列表
  getIntorderList(){
    var that = this;
    let gdata = app.globalData;
    let userId = gdata&&gdata.userId; 
    console.log(userId)
    if(userId){
      https.getJSON('/share/agentIntentionOrder/list').then((res) => {
        console.log(res.data.rows)
        var intorderList = res.data.rows
        this.setData({
          intorderList:intorderList
        })
      })
    }else{
      that.getUser()
    }
  },

  addintCb: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    },
    // 添加意向订单并订阅消息
    toPage(e){
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
                  that.addintCb(e,temp)
              },
              fail(resp) { 
                console.info(resp)
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    setTimeout(()=>{
                      that.addintCb(e,'reject')
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
                  that.addintCb(e,'reject')
                },2000)
              }
            })
          }
        }
      })
    },

    intDetailCb:function(e){
      console.log(e)
      let id = e.currentTarget.dataset.id;
      let orderId = e.currentTarget.dataset.orderid;
      if(orderId){
        wx.navigateTo({
        url: '/pages/personal/disorder/disdetails/disdetails?id='+ orderId,
      })
      }else{
        wx.navigateTo({
        url: '/pages/personal/intorder/intorderdetail/intorderdetail?id='+ id,
      })
      }
    },
    // 查看详情
    todetails:function(e){
      console.log(e)
      // var arg = arguments;
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
                  that.intDetailCb(e,temp)
              },
              fail(resp) { 
                console.info(resp)
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    setTimeout(()=>{
                      that.intDetailCb(e,'reject')
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
                  that.intDetailCb(e,'reject')
                },2000)
              }
            })
          }
        }
      })
    },






    //选项卡头部点击
    tabfun: function (e) {
      // console.log(e)
      let idx = e.currentTarget.dataset.idx;
      let intorderList = this.data.intorderList
      if(idx!=this.data.tabidx){
        this.setData({
          tabidx: idx,
        })
      }
      // console.log(this.data.tabidx)
      if(this.data.tabidx == ''){
          this.getIntorderList()
      }else if(this.data.tabidx == 1){
        this.getIntorder(1)
      }else if(this.data.tabidx == 2){
        this.getIntorder(2)
      }
    },

    //根据状态查询 列表
    getIntorder(state){
      var data = {
        orderState:state
      }
      https.getJSON('/share/agentIntentionOrder/list',data).then(res=>{
        // console.log(res)
        var intorderList = res.data.rows
        if(res.data.code==200){
          this.setData({
            intorderList:intorderList
          })
        }
      })
    },
    // 搜索
    searchFun: function (e) {
      // console.log(e)
      let data = {
        keyword:e.detail.value
      }
      https.getJSON('/share/agentIntentionOrder/list',data).then(res=>{
        // console.log(res)
        var intorderList = res.data.rows
        if(res.data.code==200){
          this.setData({
            tabidx : '',
            intorderList:intorderList
          })

        }
      })
  },
  // 清空
  clearFun:function(){
    this.getIntorderList()
  },
  // 取消按钮
  cancel: function(){
    this.setData({
      value:''
    })
    this.getIntorderList()
    console.log("cancel")
  },

    // 获取用户信息
    getUser: function () {
      var that = this;
      if(app.globalData.userId==''){
        wx.hideNavigationBarLoading()
        that.setData({
          userInfo: null
        })
        that.shareFun()
      }else if (app.globalData.userInfo) {
        wx.hideNavigationBarLoading()
        var res = app.globalData.userInfo
        that.setData({
          userInfo: res
        })
        that.getIntorderList();
        // var prov = res.prov;
        if(!res.prov || !res.city || !res.county){
          wx.showModal({
            title: '温馨提示',
            content: '您还没有选择常驻区域，请去个人设置页面进行选择设置',
            showCancel:false,
            confirmText:'好的',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/personal/setting/setting',
                })
              } 
            }
          })
        }
        wx.hideNavigationBarLoading()
        that.shareFun()
      } else {
        app.userInfoCallBack = res => {
          console.info(res)
          if (res&&res.data && res.data.code == 200) {
            that.setData({
              userInfo: res.data.data||null
            })
          }
          wx.hideNavigationBarLoading()
          that.shareFun()
          that.getIntorderList()
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
  onShareAppMessage: function () {

  }
})