// pages/personal/cardAgency/agencyInfo/agencyInfo.js
const https = require("../../../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.cardUrl,
    url:wx.AppUrl,
    userInfo:{},
    orderId:null,//从上个页面传过来的
    orderInfo:{},//获取卡券详情
    cardNum:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId:options.orderId
    })
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    this.getUser()
    this.getOrderInfo()
  },
   // 获取订单详情
   getOrderInfo(){
    let data = {
      orderId:this.data.orderId
    }
    let that = this;
    https.getJSON('/share/cardOrder/getInfo',data).then(res=>{
      console.log('订单信息')
      console.log(res.data.data)
      if(res.data.code==200){
        let datas = res.data.data
        if(datas.cardInfo.photoFlag=='yellow'){
          datas.cardInfo.cardColor='colorYellow'
        }else if(datas.cardInfo.photoFlag=='gray'){
          datas.cardInfo.cardColor='colorGray'
        }else if(datas.cardInfo.photoFlag=='cyan'){
          datas.cardInfo.cardColor='colorCyan'
        }else if(datas.cardInfo.photoFlag=='blue'){
          datas.cardInfo.cardColor='colorBlue'
        }
          
        that.setData({
          orderInfo:res.data.data
        })
        let num = res.data.data.cardBusinessList.length
        switch(num) {
          case 1:
            that.setData({
              cardNum:'一'
            })
             break;
          case 2:
            that.setData({
              cardNum:'二'
            })
             break;
             case 3:
            that.setData({
              cardNum:'三'
            })
             break;
             case 4:
            that.setData({
              cardNum:'四'
            })
             break;
             case 5:
            that.setData({
              cardNum:'五'
            })
             break;
     } 
      }
    })
  },
   // 获取用户信息
   getUser: function () {
    var that = this;
    if(app.globalData.userId==''){
      wx.hideNavigationBarLoading()
      that.setData({
        userInfo: null
      })
    }else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res&&res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null
          })
        }
      }
    }
  },
   // 点击打电话
   toPhone(){
    var phone = wx.callPhone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },
  

  // 取消订单
  cancelOrder(){
    let that = this;
    wx.showModal({
      title: '确认取消订单？',
      confirmColor:'#2253f4',
      success (res) {
        if (res.confirm) {
          https.getJSON('/share/cardOrder/cancelOrder',{orderId:that.data.orderId}).then(res=>{
            if(res.data.code==200){
              wx.showToast({
                title: '订单已取消',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(()=>{
                    that.getOrderInfo()
                  },2000)
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 订单付款
  payFun: function () {
    var that = this;
    var data = {
      orderId:that.data.orderId
    }
      https.payJSON('/share/pay/cardOrderPrepay', data,'/share/pay/cardNotify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function (){
              setTimeout(() => {
                that.getOrderInfo()
              }, 1500)
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
    },

  // 确定订单
  confirmFun(){
    // orderId
    let that = this;
    https.getJSON('/share/cardOrder/confirm4Order',{orderId:that.data.orderId}).then(res=>{
      if(res.data.code==200){
        wx.showToast({
          title: '订单确认成功',
          duration: 2000,
          success: function () {
            setTimeout(()=>{
              that.getOrderInfo()
            },2000)
          }
        })
    
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // 
  onShareAppMessage: function (res) {
    // console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // console.log(this.data.orderdetails)
       let orderId = this.data.orderId;
    return {
      title: '莫的问题',
      path: '/pages/personal/cardAgency/agencyInfo/agencyInfo?orderId='+orderId,
      imageUrl:'../../../../resource/image/share.jpg'
    }
    console.log(path)
  },
  // onShareAppMessage: function (res) {
  //   console.log(res)
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   let orderId = this.data.orderId;
  //   return {
  //     title: '莫的问题',
  //     path: '/pages/personal/cardAgency/agencyInfo?orderId='+orderId,
  //     imageUrl:'../../../../resource/image/share.jpg'
  //   }
  // }
})