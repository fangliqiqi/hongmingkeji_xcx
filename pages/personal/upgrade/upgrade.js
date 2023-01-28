// pages/personal/upgrade/upgrade.js
const app = getApp();
const store = require('../../../utils/store')
const https = require('../../../utils/https')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleId:'',
    totalAmount:'',
    typeid: '',
    typeids:[],
    typelist:[],
    userInfo:{}
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
    // this.getUpgrade()
    this.getUser()
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
      // that.getIntorderList();
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
      }else{
        wx.showModal({
          title: '温馨提示',
          content: '您设置的常驻区域是'+res.city+'-'+res.county+',是否需要修改',
          cancelText:'不需要',
          confirmText:'需要',
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/personal/setting/setting',
              })
            }else{
             that.getUpgrade()
            }
          }
        })
      }
      wx.hideNavigationBarLoading()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res&&res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data||null
          })
        }
        wx.hideNavigationBarLoading()
        // that.getIntorderList()
      }
    }
  },
  // 获取升级信息
  getUpgrade(){
    https.getJSON('/share/agentProportionSettings/list4Recharge').then((res) => {
      if (res.data.code == 200) {
        this.setData({
          typelist: res.data.data,
        })
      }else{
        wx.showToast({
          title: '抱歉，您所在城市暂未开通，请耐心等待',
          icon:'none'
        })
      }
    })
  },
  amtap: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    let amt = e.currentTarget.dataset.amt;
    let isOption = e.currentTarget.dataset.op;
    let name = e.currentTarget.dataset.name;
    console.log(isOption)
    if(isOption==2){
      wx.showToast({
        title: '您的级别较高，无需再次购买',
        icon:'none'
      })
    }else if(isOption=1){
      this.setData({
        roleId:id,
        typeid:id,
        totalAmount:amt
      })
    }
    
  },
  // 订单付款
  payFun: function () {
    var that = this;
    var data = {
      // logId:
      roleId:that.data.roleId,
      totalAmount:that.data.totalAmount,
      givenAmount:0
    }
      https.payJSON('/share/pay/agentLevelPrepay', data,'/share/pay/levelUpNotify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function (){
              setTimeout(() => {
                wx.navigateBack({
                  delta: 0,
                })
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