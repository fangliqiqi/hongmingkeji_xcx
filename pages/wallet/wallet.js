// pages/wallet/wallet.js
const app  = getApp()
const store = require('../../utils/store')
const https = require("../../utils/https")
const util= require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.AppUrl,
    loading: false,
    userInfo:{},
    recommendInfo:null,
    conlist:[],
    pageSize:10,
    pageNum:1,
    total:0,
    expenseList:[],
    accountBalance:'',
    integral:'',
    isTip:false,
    tipList:[],
    notOpened:false,
    titleTab:5//消费记录和充值记录点击tab
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
    // this.getExpenselist()
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
    this.getExpenselist(5)
    this.getBalance()
    this.getTipList()
    // console.log(this.data.userInfo)
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
      var res = app.globalData.userInfo
        that.setData({
          userInfo: res,
        })
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
  //点tab  切换
  tabfun(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
    titleTab:idx
    })
    this.getExpenselist(idx)
  },

//获取消费记录列表 //1预充值,2分销订单,3软件使用费,4商品购买,5卡券购买,6等级提升
  getExpenselist:function(expenseType){
    https.getJSON('/share/AgentExpenseLog/list',{expenseType:expenseType}).then((res) => {
      let expenseList = res.data.rows
      this.setData({
        expenseList:expenseList
      })
    }).catch((err) => {
      console.info(err)
    });
  },

  // 点击消费记录查看详情
  toDetail(e){
    let orderId = e.currentTarget.dataset.orderid
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/wallet/expenseDetail/expenseDetail?orderId='+orderId+'&id='+id
    })
  },

  //获取余额积分显示
  getBalance:function(){
    https.getJSON('/share/AgentUserWallet/getInfo').then((res) => {
      console.log(res)
      // console.log(res.data.data)
      let data = res.data.data
      let integral = data.cardFreezeCommission + data.levelFreezeCommission
      this.setData({
        accountBalance:data.accountBalance,
        integral:integral
      })
    }).catch((err) => {
      console.info(err)
    });
  },
  // 获取充值提示
  getTipList(){
    // console.log(this.data.userInfo)
    let data = {
      province:this.data.userInfo.prov,
      city:this.data.userInfo.city
    }
    https.getJSON('/share/agentProportionSettings/list',data).then((res) => {
      // console.log(res)
      let rows = res.data.rows;
      this.setData({
        tipList:rows
      })
      let arr = [];
      rows.map(item=>{
        arr.push(item.prepareRecharge)
      })
      // console.log(arr)
      if(arr.includes(0)){
        this.setData({
          notOpened:true
        })
      }
    })
  },
  // 点击进行充值提示
  showTip(){
    this.setData({
      isTip:true
    })
  },
  //关闭提示弹窗
  bindCodeFun(e){
    this.setData({
      isTip:false
    })
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
        var conlist = that.data.conlist||[];
        that.setData({
          conlist:conlist.concat(res.data.rows||[]),
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

  //调用充值
payFun: util.throttle(function(e){
  var that = this;
  var totalAmount  = e.currentTarget.dataset.item.expenseMoney;
  var payStatus = e.currentTarget.dataset.item.payStatus;
  var  id = e.currentTarget.dataset.item.id;
  var roleId = e.currentTarget.dataset.item.roleId;
  if(payStatus == 3){
    if(roleId){
      var datas = {
        logId:id,
        roleId:roleId,
        totalAmount:totalAmount,
        givenAmount:0
      }
      console.log(datas)
      https.payJSON('/share/pay/agentLevelPrepay', datas,'/share/pay/levelUpNotify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function (){
              that.getExpenselist(1)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg || '支付失败',
            icon: 'none',
            mask: true,
          })
        }
      }).catch((res)=>{
        wx.showToast({
          title: res.data.msg || '支付失败',
          icon: 'none',
          mask: true,
        })
      });
    }else{
      var data = {
        totalAmount:totalAmount,
        givenAmount:0,
        id:id
      }
      https.payJSON('/share/pay/rechargePrepay', data).then((res)=>{
        // console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '充值成功',
            icon: 'success',
            mask: true,
            duration:1500,
            success:function(){
              that.getExpenselist(1)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg || '充值失败',
            icon: 'none',
            mask: true,
          })
          that.getExpenselist(1)
        }
      }).catch((res)=>{
        wx.showToast({
          title: '充值失败',
          icon: 'none',
          mask: true,
        })
        that.getExpenselist(1)
      });
    }   
  } 
  },2000),







  
    toPage(e){
      wx.navigateTo({
        url: '/pages/wallet/topup/topup',
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


  onShareAppMessage: function (e) {
    console.info(e)
    var share_title = "共享会计 · 莫的问题"; //分享名称
    var userId = app.globalData.userId; //传的id
    let shareImg = this.data.shareImg;  //分享的时候展示的图片
    var that = this;
    if (e.from === 'button') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    var shareObj =  {
      title: share_title,
      path: '/pages/service/service?recommendId='+userId,
      imageUrl: shareImg ? shareImg :"/resource/image/share.jpg",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    console.info(shareObj)
    return shareObj;
  },

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
  }

})