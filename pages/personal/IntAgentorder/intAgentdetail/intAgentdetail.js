// pages/personal/disorder/disdetails/disdetails.js
const app = getApp();
const store = require('../../../../utils/store')
const https = require("../../../../utils/https");
const { postJSON } = require('../../../../utils/server');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    type:'',
    pid:'',
    intorderdetail:{},
    userInfo:null,
    showFlag:false,
    intState:false,
    orderState:1,
    orderId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideShareMenu();
    // console.log(options)
    let id = options.id;  
    this.setData({
      id:id
    })
    this.getPage()
  },

  //获取页面信息
  getPage(cb){
    var that = this;
    var id = that.data.id;
    https.getJSON('/share/agentIntentionOrder/' + id).then((res) => {  
      console.log(res.data.data)
      let data = res.data.data
      that.setData({
        intorderdetail:data
      })
      if(typeof cb == 'function'){
        cb(data)
      }
    }).catch((err) => {
      console.info(err)
    });
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
    this.getPage()  
  },
  //得到用户信息
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
      })
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
      }
    }
    // console.log(this.data.userInfo)
  },
 
  // 点击修改订单状态 弹窗
  statusChange(e){
    // console.log(e)
    this.setData({
      intState:true
    })
  },

  // 弹窗取消
  closeFun: function () {
    this.setData({
      showFlag: false,
      intState:false
    })
  },
  // 选择状态
  bindchangestate(e){
    console.log(e)
    var value = e.detail.value;
    this.setData({
      orderState:value
    }) 
  },

  // 弹窗确定 修改订单状态
  bindstateFun: function (e) {
    // console.log(e)
    var that= this;
    var data = {
      id:that.data.id,
      orderState:that.data.orderState
    }
    console.log(data)
    https.getJSON('/share/agentIntentionOrder/updateIntentionOrder',data).then(res=>{
      // console.log(res)
      that.setData({
        intState:false,
      })
      if(res.data.code==200){   
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            setTimeout(function () {
              //要延时执行的代码  
              that.getPage()
            }, 2000) //延迟时间
          }    
        })
      }
    })
  },
  // 点击打电话
  toPhone(e){
    console.log(e)
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 转订单
  toDisorder(e){
    // console.log(e)
    this.setData({
      showFlag:true
    })
  },
  bindCodeFun(){
    // console.log(this.data.pid)
    // console.log(this.data.intorderdetail)
    var that  = this;
    let pid = that.data.pid;
    let intorderdetail = that.data.intorderdetail;
    if(pid.length>0){
      var data = {
        userName: intorderdetail.userName,
        userPhone: intorderdetail.userPhone,
        orderType:intorderdetail.orderType,
        province:intorderdetail.province,
        city:intorderdetail.city,
        county:intorderdetail.county,
        downPayment:pid,
        paidAmount:0, 
        orderContent:intorderdetail.orderContent,
        intentionOrderId:that.data.id,
      }
      // console.log(data)
      https.getJSON('/share/AgentOrder/agent/add4Api',data).then(res=>{
        if(res.data.code==200){
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
                that.setData({
                  showFlag:false
                })
                that.getPage(cbdata=>{
                  // console.log(cbdata)
                  if(cbdata&&cbdata.agentOrderId)
                  wx.redirectTo({
                    url: '/pages/personal/disorder/disdetails/disdetails?id='+ cbdata.agentOrderId,
                  })
                })
                
                // wx.redirectTo({
                //   url: '/pages/personal/disorder/disdetails/disdetails?id='+ that.data.intorderdetail.agentOrderId,
                // })
              }, 2000) //延迟时间
            }    
          })
        }else{
          console.log('提交失败')
        }
      })
    }
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
  onShareAppMessage: function (res) {
    // console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // console.log(this.data.orderdetails)
    let id = this.data.id;
    var orderdetails = this.data.orderdetail
    return {
      title: '莫的问题',
      path: '/pages/personal/disorder/disdetails/disdetails?id='+id+'&orderdetails='+JSON.stringify(orderdetails),
      imageUrl:'../../../../resource/image/share.jpg'
    }
    console.log(path)
  }
})