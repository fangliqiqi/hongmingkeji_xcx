// pages/wallet/recharge/recharge.js
// const store = require('../../../utils/store')
const app = getApp();
const https = require("../../../utils/https");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    totalAmount:'',
    givenAmount:0,
    accountBalance:''
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
    this.getUserInfo()
    this.getBalance()

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
  // 获取用户信息
  getUserInfo: function () {
    var that = this;
    var userId = app.globalData.userId;
    app.getUser(userId);
    app.userInfoCallBack = (res) => {
      // console.log(res)
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data
        })
      }
    }
  },


  //获取余额积分显示
  getBalance:function(){
    https.getJSON('/share/AgentUserWallet/getInfo').then((res) => {
      console.log(res)
      // console.log(res.data.data)
      let data = res.data.data
      this.setData({
        accountBalance:data.accountBalance,
      })
    }).catch((err) => {
      console.info(err)
    });
  },

  inputfun: function (e) {
    console.info(e)
    this.setData({
      totalAmount: e.detail.value || ''
    })
  },
  //调用充值
payFun: function () { 
  var that = this;
  // console.log(that.data.userInfo)
  let userInfo  = that.data.userInfo;
  var totalAmount  = that.data.totalAmount;
  if(totalAmount.length!== 0){
    var data = {
      totalAmount:totalAmount,
      givenAmount:that.data.givenAmount
    }
    // console.log(data)
    https.payJSON('/share/pay/rechargePrepay', data).then((res)=>{
      // console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg || '支付成功',
          icon: 'success',
          mask: true,
          duration:1500,
          success:function(){
            setTimeout(function () {
              //充值成功后 再次调用获取用户信息的方法
              app.getAgentist(userInfo.userId,userInfo.roles)
              //要延时执行的代码
             wx.navigateBack({
               delta: 0,
             })

            }, 2000) //延迟时间
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg || '充值失败',
          icon: 'none',
          mask: true,
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: res.data.msg || '充值失败',
        icon: 'none',
        mask: true,
      })
    });       
    }
  },
  
})