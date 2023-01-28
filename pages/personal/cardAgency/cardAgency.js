// pages/personal/cardAgency/cardAgency.js
const https = require("../../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.cardUrl,
    url:wx.AppUrl,
    titleTab:1,
    roleIds:[],//多重身份数组
    myroleFlag:false, //是不是等于114 代理人判断
    roleFlag:false,//判断在不在109~113之间 代理商判断
    userInfo:null,
    isShow:false,
    pageSize:10,
    pageNum:1,
    total:0,
    loading: false,
    cardList:[],//会员卡列表
    sellList:[],//销售列表
    cardNumber:null,//转售数量,
    cardPrice:null,//单价
    cardItem:null,//转售 卡信息          
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if(this.data.titleTab==2){
      this.setData({
        loading: true,
        sellList:[],
        pageNum:1 ,
        total:0 
      }) 
      this.getSelllist()
    }
    this.getUser()
    this.getCardlist()
  },
  // 获取会员卡列表
  getCardlist(){
    https.getJSON('/share/userCard/list').then(res=>{
      if(res.data.code==200){
        res.data.rows.map(items=>{
          if(items.photoFlag=='yellow'){
            items.cardColor='colorYellow'
          }else if(items.photoFlag=='gray'){
            items.cardColor='colorGray'
          }else if(items.photoFlag=='cyan'){
            items.cardColor='colorCyan'
          }else if(items.photoFlag=='blue'){
            items.cardColor='colorBlue'
          }
          return items
        })
        this.setData({
          cardList:res.data.rows
        })
      }
    })
  },
  // tab 点击切换
  tabfun(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      titleTab:idx
    })
    if(idx==1){
      this.getCardlist()
      this.setData({
        sellList:[]
      })
    }else if(idx==2){
      this.getSelllist()
    }
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
  // 获取个人信息
  getUser: function () {
    var that = this;
    if(app.globalData.userId==''){
      wx.hideNavigationBarLoading()
      that.setData({
        userInfo: null
      })
    }else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        roleIds:app.globalData.userInfo.roles
      })
      that.decideRoles(that.data.roleIds)
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
      }
    }
  },

  // 点击转售
  toSell(e){
    console.log(e)
    if(this.data.roleFlag){
      this.setData({
        cardItem:e.currentTarget.dataset.item,
        sellNum:null,
        isShow:true,
      })
    }else if(this.data.myroleFlag){
      this.setData({
        cardItem:e.currentTarget.dataset.item,
        cardNumber:1,
        isShow:true
      })
    }
  },
  // 输入框
  input1Eve(e){
    // console.log(e)
    // console.log(this.data.cardItem)
    let maxNum = this.data.cardItem.buyNumber
    let num = e.detail.value;
    if(num>maxNum){
      wx.showToast({
        title: '最多售卖'+maxNum+'张',
        icon:"none"
      })
      this.setData({
        cardNumber:maxNum
      })
    }else{
      this.setData({
        cardNumber:num
      })
    }
    
  },
  input2Eve(e){
    let num  = e.detail.value
    this.setData({
      cardPrice:num
    })
  },

  // 线下付款
  offlinepayFun(){
    if(!this.data.cardNumber){
      wx.showToast({
        title: '请输入转售数量',
        icon:"none"
      })
    }else if(!this.data.cardPrice){
      wx.showToast({
        title: '请输入转售单价',
        icon:"none"
      })
    }else{
      let payMoney =Math.round(this.data.cardNumber*this.data.cardPrice*100)/100
      let data = {
        cardId:this.data.cardItem.cardId,
        cardNumber:this.data.cardNumber,
        cardPrice:this.data.cardPrice,
        payMoney:payMoney,
        payType:2
      }
      https.postJSON('/share/cardOrder/add4xcx',data).then(res=>{
        console.log(res)
        if(res.data.code==200){
          let orderId = res.data.data.idStr
          this.setData({
            isShow:false,
            cardNumber:null,
            cardPrice:null,
          })
          wx.navigateTo({
            url: '/pages/personal/cardAgency/agencyInfo/agencyInfo?orderId='+ orderId,
          })
        }
      })
    }  
  },
  // 线上付款
  onlinepayFun(){
     if(!this.data.cardNumber){
      wx.showToast({
        title: '请输入转售数量',
        icon:"none"
      })
    }else if(!this.data.cardPrice){
      wx.showToast({
        title: '请输入转售单价',
        icon:"none"
      })
    }else{
      let payMoney =Math.round(this.data.cardNumber*this.data.cardPrice*100)/100
      let data = {
        cardId:this.data.cardItem.cardId,
        cardNumber:this.data.cardNumber,
        cardPrice:this.data.cardPrice,
        payMoney:payMoney,
        payType:1
      }
      https.postJSON('/share/cardOrder/add4xcx',data).then(res=>{
        console.log(res)
        if(res.data.code==200){
          let orderId = res.data.data.idStr
          this.setData({
            isShow:false,
            cardNumber:null,
            cardPrice:null,
          })
          wx.navigateTo({
            url: '/pages/personal/cardAgency/agencyInfo/agencyInfo?orderId='+ orderId,
          })
        }
      })
    }
  },
  // 获取销售列表
  getSelllist:function (cb) {
    var that =this;
    https.getJSON('/share/cardOrder/list4xcx',{
      pageSize:that.data.pageSize,
      pageNum:that.data.pageNum 
    }).then(res=>{
      console.info(res)
      if(res.data.code==200){
        var sellList = that.data.sellList||[];
        that.setData({
          sellList:sellList.concat(res.data.rows||[]),
          total:res.data.total||0,
        })
        console.log(that.data.sellList)
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
  // 点击去销售订单详情
  toDetail(e){
    console.log(e)
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personal/cardAgency/agencyInfo/agencyInfo?orderId='+ orderId,
    })
  },
  // 下拉
  // bindscrolltolower: function (e) {
  //   let that = this;
  //   let total = that.data.total;
  //   let pageSize = that.data.pageSize;
  //   let pageNum = that.data.pageNum +1
  //   if(!that.data.loading&&Math.ceil(total/pageSize) >=pageNum){
  //     that.setData({
  //       loading: true,
  //       pageNum:pageNum
  //     })
  //     that.getSelllist(function(){
  //       that.setData({
  //         loading: false
  //       })
  //     })
  //   }
  // },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      loading: true,
      sellList:[],
      pageNum:1 ,
      total:0 
    })
    that.getSelllist(function(){
      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh();
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