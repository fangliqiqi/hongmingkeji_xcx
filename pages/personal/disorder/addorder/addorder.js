// pages/personal/disorder/addorder/addorder.js
const app = getApp();
// const utils = require("../../../utils/util");
const store = require("../../../../utils/store")
const https = require("../../../../utils/https");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderTypeList:[],
    index: '',
    region: ['', '', ''],
    orderInfo: {
      userName: '',
      userPhone: '',
      orderType:'',
      province:'',
      city:'',
      county:'',
      downPayment:'',
      paidAmount:0, 
      orderContent:''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    https.postJSON('/share/AgentBusinessType/list4Order').then((res) => {
      console.log(res)
      this.setData({
        orderTypeList:res.data.data
      })     
    }).catch((err) => {
      console.info(err)
    });
  },
//选择订单类型
  bindPickerChange: function (e) {
    // console.log(e)
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var orderTypeList = this.data.orderTypeList || [];
    var value = e.detail.value;
    this.setData({
      index: value,
      'orderInfo.orderType': orderTypeList[value].id
    })
  },
//选择省市区
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var vl = e.detail.value;
    this.setData({
      region: vl,
      'orderInfo.province': vl[0],
      'orderInfo.city': vl[1],
      'orderInfo.county': vl[2]
    })
  },
//输入框输入信息
inputFun: function (e) {
  var idx = e.currentTarget.dataset.idx;
  var vl = e.detail.value;
  // console.info(e)
  if (idx == 1) {
    this.setData({
      'orderInfo.userName': vl,
    })
  } else if (idx == 2) {
    this.setData({
      'orderInfo.userPhone': vl,
    })               
  } else if (idx == 3) {
    this.setData({
      'orderInfo.downPayment': vl,
    })
  }else if (idx == 4) {
    this.setData({
      'orderInfo.paidAmount': vl,
    })
  }else if (idx == 5) {
    this.setData({
      'orderInfo.orderContent': vl
    })
  }
},

// 提交新增
submintFun:function(e){
  // console.info(e)
  var that  = this;
  var orderInfo = this.data.orderInfo;
  if(orderInfo.userName.length==0){
    wx.showToast({
      title: '请输客户姓名',
      icon:'none'
    })
  }else if(orderInfo.userPhone.length<=10){
    wx.showToast({
      title: '请输入联系方式',
      icon:'none'
    })
  }else if(orderInfo.orderType.length == 0){
    wx.showToast({
      title: '请选择订单类型',
      icon:'none'
    })
  }else if(orderInfo.province.length == 0){
    wx.showToast({
      title: '请选择省市区',
      icon:'none'
    })
  }else if(orderInfo.downPayment.length == 0){
    wx.showToast({
      title: '请输入定金金额',
      icon:'none'
    })
  }else{ 
    https.getJSON('/share/AgentOrder/agent/add4Api',orderInfo).then(res=>{
      if(res.data.code==200){
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            setTimeout(function () {
              //要延时执行的代码
             wx.navigateBack({
               delta: 0,
             })
            }, 2000) //延迟时间
          }    
        })
      }else{
        console.log('提交失败')
      }
    })
  }
}
})