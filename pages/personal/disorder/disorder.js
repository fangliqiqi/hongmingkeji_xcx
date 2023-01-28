// pages/personal/disorder/disorder.js
const app  = getApp()
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    disorderList:[],
    tabidx: 1,
    value:'',
    keyword:'',
    type:1
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
    this.getdisorderList()
  },

    // 获取页面订单列表
    getdisorderList(){
      var data = {
        keyword:this.data.keyword,
        type:this.data.type
      }
      https.getJSON('/share/AgentOrder/ownList4Api',data).then((res) => {
        var disorderList = res.data.rows
        this.setData({
          disorderList:disorderList
        })
      }).catch((err) => {
        console.info(err)
      });
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
        var res = app.globalData.userInfo
        that.setData({
          userInfo: res,
        })
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
        }
      }
    },

    //根据状态查询 列表
    getIntorder(state){
      this.setData({
        type:state
      })
      var data = {
        keyword:this.data.keyword,
        type:this.data.type
      }
      https.getJSON('/share/AgentOrder/ownList4Api',data).then(res=>{
        var disorderList = res.data.rows
        if(res.data.code==200){
          this.setData({
            disorderList:disorderList
          })
        }
      })
    },
     //选项卡头部点击
     tabfun: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let disorderList = this.data.disorderList
      if(idx!=this.data.tabidx){
        this.setData({
          tabidx: idx,
          type:idx
        })
      }
      if(this.data.tabidx == 1){  
        this.getIntorder(1)
      }else if(this.data.tabidx == 2){
        this.getIntorder(2)
      }else if(this.data.tabidx == 3){
        this.getIntorder(3)
      }
    },

    // 搜索 模糊查询
    searchFun: function (e) {
      // console.log(e)
      this.setData({
        keyword:e.detail.value
      })
      let data = {
        keyword:this.data.keyword,
        type:this.data.type
      }
      https.getJSON('/share/AgentOrder/ownList4Api',data).then(res=>{
        var disorderList = res.data.rows
        if(res.data.code==200){
          this.setData({
            tabidx :this.data.type,
            disorderList:disorderList
          })
        }
      })
    },
    clearFun:function(){
      // console.log(this.data.keyword)
      // console.log(this.data.type)
      this.setData({
        keyword:'',
        type:this.data.type
      })
      this.getdisorderList()
    },

  // 取消按钮
  cancel: function(){
    this.setData({
      value:'',
      keyword:'',
      type:this.data.type
    })
    this.getdisorderList()
  },

    // 添加
    toPage: function (e) {
      console.log(e)
        wx.navigateTo({
          url: '/pages/personal/disorder/addorder/addorder',
        })
    },
    // 详情
    todetails:function(e){
      // console.log(e)
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/personal/disorder/disdetails/disdetails?id='+ id,
      })
    },
    // 分享
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