// pages/personal/disorder/disorder.js
const app  = getApp()
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    disorderList:[]
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
    this.getUser()
    https.getJSON('/share/AgentOrder/noAgentList').then((res) => {
      // console.log(res)
      console.log(res.data.rows)
      var disorderList = res.data.rows
      this.setData({
        disorderList:disorderList
      })
      
    }).catch((err) => {
      console.info(err)
    });
  },

  toPage: function (e) {
    console.log(e)
      wx.navigateTo({
        url: '/pages/personal/disAgentorder/adddisAgent/adddisAgent',
      })
    },
    todetails:function(e){
      // console.log(e)
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/personal/disAgentorder/disAgentdetail/disAgentdetail?id='+ id,
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