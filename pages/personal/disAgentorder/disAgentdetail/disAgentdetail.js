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
    orderdetail:{},
    roleIds:[],//多重身份数组
    roleFlag:false,//判断在不在109~114之间
    userInfo:null,
    showFlag:false,
    pid:'',
    balancePayment:'',
    payType:'',
    flowState:'',
    flowText:'',
    flowShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // console.log(options)
    let id = options.id;  
    this.setData({
      id:id
    })
    this.getPage()
    //获取手机设备信息
    wx.getSystemInfo({
      success(res){
        // console.log(res.platform)
        type:res.platform
      }
    })
  },
  //获取页面信息
  getPage(){
    var that = this;
    var id = that.data.id;
    https.getJSON('/share/AgentOrder/' + id).then((res) => {  
      that.setData({
        orderdetail:res.data.data
      })
      // console.log(that.data.orderdetail)
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
    this.getorderInfo()
    
  },
  // 判断多重身份角色是否在109 114中间  
  decideRoles(arr){
    arr.map(items=>{
      if(items.roleId>=109 && items.roleId <= 114){
        this.setData({
          roleFlag:true
        })
      }else{
        this.setData({
          roleFlag:false
        })
      }
    })
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
        roleIds:app.globalData.userInfo.roles
      })
      that.decideRoles(that.data.roleIds)
      wx.hideNavigationBarLoading()
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
        wx.hideNavigationBarLoading()
      }
    }
    // console.log(this.data.userInfo)
  },
  // 获取订单状态
  getorderInfo(){
    //得到订单状态
    var data = {
      orderId:this.data.id
    }
    https.getJSON('/share/crmUserPair/flowListXcx',data).then((res)=>{
      console.log(res.data)
      let arr = res.data.data;
      if(arr.length>0){
        console.log('有数据')
        let arr = res.data.data;
        // console.log(arr)
        let obj = arr[arr.length-1]
        console.log(obj)
        if(obj.pairId == 2){
          this.setData({
            flowState:2,
            flowText:'订单审核'
          })
        }else if(obj.pairId == 3 || 4 || 5){
          this.setData({
            flowState:3,
            flowText:'订单分派'
          })
        }else if(obj.pairId == 6 || 7 || 10){
          this.setData({
            flowState:4,
            flowText:'订单处理'
          })
        }else if(obj.pairId == 8 || 9 && obj.state == 1){
          this.setData({
            flowState:4,
            flowText:'订单处理'
          })
        }else if(obj.pairId == 8 || 9 && obj.state == 2){
          this.setData({
            flowState:5,
            flowText:'完结'
          })
        }
      }else{
        this.setData({
          flowState:1,
          flowText:'创建订单'
        })
      }
    })
  },
  // 点击展示订单状态详情
  handFlow(e){
    console.log(e)
    let flowShow = this.data.flowShow
    this.setData({
      flowShow:!flowShow
    })
  },


//调用付款 定金
payFun: function () {
  var that = this;
  let orderdetails = this.data.orderdetail;
  let type = that.data.type;
  if(orderdetails.id!==''){
    var data = {
      orderId:orderdetails.id,
      totalAmount:orderdetails.downPayment,
      type:type,
      payStatus:1
    }
    https.payJSON('/share/pay/agentOrderPrepay', data).then((res)=>{
      console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg || '支付成功',
          icon: 'none',
          mask: true,
          success: function () {
            that.getPage()  
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
    }
  },
  // 尾款弹窗
  ptotap: function (e) {
    var payType = e.currentTarget.dataset.type;
    // console.log(payType)
    this.setData({
      showFlag: true,
      payType:payType
    })
  },
  // 弹窗取消
  closeFun: function () {
    this.setData({
      showFlag: false,
      pid:''
    })
  },

  // 弹窗确定 修改尾款金额
  bindCodeFun: function (e) {
    let that = this;
    let p = that.data.pid
    let id = that.data.id
    var payType = that.data.payType
    if(p && p > 0){
      if(payType == 1){
        // console.log("追加尾款")
        var data2 = {
          orderId:id,
          balancePayment:p,
        }
        https.getJSON('/share/AgentOrder/additionalExpense', data2).then((res)=>{
          // console.log(res)
            if (res.data.code == 200) {
              wx.showToast({
                title: '提交成功',
                icon: 'none',
                mask: true,
                success: function () {
                  that.setData({
                    showFlag: false
                  })
                  that.getPage() 
                }
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mask: true,
              })
            }
          }).catch((res)=>{
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              mask: true,
            })
          })
      }else{
        var data1 = {
          id:id,
          balancePayment:p,
        }
        https.getJSON('/share/AgentOrder/balancePaymentChange', data1).then((res)=>{
        // console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              mask: true,
              success: function () {
                that.setData({
                  showFlag: false
                })
                that.getPage() 
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              mask: true,
            })
          }
        }).catch((res)=>{
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            mask: true,
          })
        })
      }  
    }    
  },

  // 付款 付尾款
  payFun2:function(){
    var that = this;
    let orderdetails = this.data.orderdetail;
    let type = that.data.type;
    if(orderdetails.id!==''){
      var data = {
        orderId:orderdetails.id,
        totalAmount:orderdetails.balancePayment,
        type:type,
        payStatus:4
      }
      https.payJSON('/share/pay/balancePaymentPrepay', data).then((res)=>{
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            duration:2000,
            success: function () {
              that.getPage()  
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
    }
  },
  // 付款 追加付尾款
  payFun3:function(){
    var that = this;
    let orderdetails = this.data.orderdetail;
    let type = that.data.type;
    if(orderdetails.id!==''){
      var data = {
        orderId:orderdetails.id,
        totalAmount:orderdetails.balancePayment,
        type:type,
        payStatus:5
      }
      https.payJSON('/share/pay/balancePaymentPrepay', data).then((res)=>{
        // console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            duration:2000,
            success: function () {
              that.getPage()  
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
    }
  },

  //订单确认 按钮
  confirmFun:function(e){
    // console.log(this.data.id)
    var that = this;
    var data = {
      id: that.data.id,
      userDisposeStatus:2
    }
    // console.log(data)
    https.getJSON('/share/AgentOrder/disposeStatusChange4User',data).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        wx.showToast({
          title: '确认成功',
          icon: 'none',
          mask: true,
          success: function () {
            that.getPage() 
          }
        })
      } else {
        wx.showToast({
          title: '确认失败',
          icon: 'none',
          mask: true,
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: '确认失败',
        icon: 'none',
        mask: true,
      })
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