// pages/coupon/coupon.js
const https = require("../../utils/https");
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.cardUrl,
    url:wx.AppUrl,
    cardColor:null,
    isFollow:false,//激活弹窗
    cardList:[],//会员卡列表
    cardNum:null,
    couponList:[],//优惠券列表
    equityList:[],//权益列表
    equityCheck:null,//权益的选择
    sellerId:null,//(卖家ID) 激活的时候用，
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
    this.getCardList()
    this.getcouponList()
    this.getAllcardList()
  },
  // 获取卡券列表
  getCardList(){
    https.getJSON('/share/activity/cardList').then(res=>{
      console.log('卡券列表')
      console.log(res.data.rows)
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
  // 获取全部卡券列表
  getAllcardList(){
    https.getJSON('/share/activity/cardList4user').then(res=>{
      if(res.data.code==200){
        this.setData({
          cardNum:res.data.rows.length
        })
      }
    })
  },
  // 获取优惠券列表
  getcouponList(){
    https.getJSON('/share/userCardActivationBusiness/list',{userCardBusinessType:1}).then(res=>{
      console.log('优惠券列表')
      console.log(res.data.rows)
      if(res.data.code==200){
        this.setData({
          couponList:res.data.rows
        })
      }
    })
  },
  // 点击查看全部
  toPage(e){
    console.log(e)
    let url  = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 点击激活按钮弹窗
  toActivate(e){
    console.log(e)
    let cardNum = e.currentTarget.dataset.num
    let url = e.currentTarget.dataset.url
    let item = e.currentTarget.dataset.item
    let data = {
      cardId:e.currentTarget.dataset.id
    }
    if(cardNum==0){
      wx.navigateTo({
        url: url+"&obj="+JSON.stringify(item),
      })
    }else{
      https.getJSON('/share/activity/cardInfo',data).then(res=>{
        if(res.data.code==200){
          this.setData({
            isFollow:true,
            equityList:res.data.data.businessList,
            equityCheck:res.data.data.businessList[0].id
          })
        }
      })
      https.getJSON('/share/userCard/activation/cardInfo',data).then(res=>{
        if(res.data.code==200){
          this.setData({
            sellerId:res.data.data.sellerId
          })
        }
      })
      
    }
  },
  // 单选 选择权益
  radioChange(e){
    console.log(e)
    this.setData({
      equityCheck:e.detail.value
    })
  },
  // 取消激活
  closeFun(){
    this.setData({
      isFollow:false
    })
  },
  // 确认激活
  sureFun(){
    console.log(this.data.sellerId)
    let equityitem = this.data.equityList.filter(item=>item.id == this.data.equityCheck)[0]
    console.log(equityitem)
    let data = {
      sellerId:this.data.sellerId,
      cardId:equityitem.cardId,
      businessId:equityitem.id
    }
    let that  = this;
    https.postJSON('/share/userCardActivation/add',data).then(res=>{
      console.log(res)
      if(res.data.code==200){
        wx.showToast({
          title:'激活成功',
          icon: 'success',
          mask: true,
          duration:1500,
          success:function(){
              that.setData({
                isFollow:false
              })
            that.getCardList()
            that.getcouponList()
          }
        })
      }
    })
  },
   // 点击优惠券 去使用
   toDetail(e){
     let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/coupon/discountDetail/discountDetail?id='+id,
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

  },

 
})