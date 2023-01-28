// pages/bankCard/add.js
const app = getApp();
const utils = require("../../../utils/util");
const store = require("../../../utils/store")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: false,
    
    isEdit: false,
    codeCount: 61,
    bankList: [
      { bankCode: 'ICBC', bankName: '工商银行' },
      { bankCode: 'ABC', bankName: '农业银行' },
      { bankCode: 'BOC', bankName: '中国银行' },
      { bankCode: 'CCB', bankName: '建设银行' },
      { bankCode: 'HSBANK', bankName: '徽商银行' }
    ],
    index: '',
    bankCode: '',
    cardInfo: {
      bankName: '',
      bankCode: '',
      bankNumber:'',
      cname:'',
      phoneNumber:'',
      delFlag:''
    },
    phoneNumber:'',
    code:'',
    codeCount:61
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.info(options)
    if (options.item) {
      var cardJson = JSON.parse(options.item);
      var index = '';
      this.data.bankList.map(function (item, idx) {
        if (item.bankCode == cardJson.bankCode) {
          index = idx;
        }
      })
      var cardInfo ={
        id:cardJson.id||'',
        bankName: cardJson.bankName,
        bankCode: cardJson.bankCode,
        bankNumber:cardJson.bankNumber,
        cname:cardJson.cname||'',
        phoneNumber:cardJson.phoneNumber||'',
        delFlag:''
      }
      this.setData({
        cardInfo: cardInfo,
        index: index
      })
    }
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
  inputFun: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var vl = e.detail.value;
    console.info(e)
    if (idx == 1) {
      this.setData({
        'cardInfo.cname': vl,
      })
    } else if (idx == 2) {
      if(e.type=='blur'){
        this.checkBankFun(vl)
      }else{
        this.setData({
          'cardInfo.bankNumber': vl,
        })
      }
    } else if (idx == 3) {
      this.setData({
        'cardInfo.phoneNumber': vl,
      })
    }else if (idx == 4) {
      this.setData({
        phoneNumber: vl,
      })
    }else if (idx == 5) {
      this.setData({
        code: vl,
      })
    }
  },
  
  checkBankFun: function (cardNo) {
    var that = this;
    wx.request({
      url: 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json',
      data: {
        _input_charset: 'utf-8',
        cardNo: cardNo,
        cardBinCheck: true
      },
      method: 'GET',
      success: (res) => {
        console.info(res)
        if (res.data.validated) {
          if (res.data.cardType == 'DC') {

            var bankList = that.data.bankList;
            var bankCode = res.data.bank;
            var index = '';
            bankList.map(function (item, idx) {
              if (item.bankCode == bankCode) {
                index = idx;
              }
            })
            that.setData({
              'cardInfo.bankCode': bankCode,
              bankCode: bankCode,
              index: index,
            })
          } else {
            wx.showToast({
              title: '请填写储蓄卡卡号',
              icon: 'none'
            })
          }

        }else{
          wx.showToast({
            title: '请填写正确的银行卡卡号',
            icon: 'none'
          })
        }
      },
      fail: (res) => { },
      complete: (res) => { },
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var bankList = this.data.bankList || [];
    var value = e.detail.value;
    this.setData({
      index: value,
      'cardInfo.bankCode': bankList[value].bankCode,
      'cardInfo.bankName': bankList[value].bankName
    })
  },
  submintFun:function(e){
    console.info(e)
    var that  = this;
    var cardInfo = this.data.cardInfo;
    var userId = app.globalData.userId;
    var del = e.currentTarget.dataset.del||'';
    if(del==10&&cardInfo.id){
      that.setData({
        isEdit:true
      })
    }else if(cardInfo.cname.length==0){
      wx.showToast({
        title: '请输入持卡人',
        icon:'none'
      })
    }else if(cardInfo.bankCode.length==0){
      wx.showToast({
        title: '请选择银行',
        icon:'none'
      })
    }else if(cardInfo.bankNumber.length<16){
      wx.showToast({
        title: '请输入银行卡卡号',
        icon:'none'
      })
    }else if(cardInfo.phoneNumber.length<10){
      wx.showToast({
        title: '请输入银行卡预留手机号',
        icon:'none'
      })
    }else{
      cardInfo.userId = userId;
      store.postJSON('/share/bank/add',cardInfo,function(res){
        if(res.data.code==200){
          that.setData({
            isSuccess:true
          })
        }else{
          wx.navigateTo({
            url: '/pages/bankCard/add/error/error',
          })
        }
      })
    }
   
  },
  codeTap:utils.throttle(function(e){
    var that = this;

    if(that.data.phoneNumber.length!=11){
      wx.showToast({
        title: '请正确填写手机号',
        icon:'none'
      })
    }else if(this.data.codeCount==61){
      this.sendCode(e);
    }else{

    }
  },3000),
  
  sendCode:function(e){
    var that = this;
    var phone = that.data.phoneNumber;
    utils.countFun(function(res){
      console.info(res)
      that.setData({
        codeCount:res<=0?61:res
      })
    },61)
    store.getJSON("/share/user/sendCode",{
      phone:phone
    },function(res){
      if(res.data.code==200){
        that.setData({
          isDisabled:false
        })
      }
    })
  },
  callBackTap:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  closeFun:function(){
    this.setData({
      isSuccess:false,
      isEdit:false
    })
  },
  unbindFun:function(){
    var that  = this;
    var cardInfo = this.data.cardInfo;
    var userId = app.globalData.userId;
    if(cardInfo.id){
      cardInfo.userId = userId;
      var phoneNumber = that.data.phoneNumber;
      if(cardInfo.phoneNumber != phoneNumber){
        wx.showToast({
          title: '请填写预留手机号',
          icon:'none'
        })
      }
      cardInfo.phoneNumber = phoneNumber;
      cardInfo.code = that.data.code;
      cardInfo.delFlag = 10;
      store.postJSON('/share/bank/add',cardInfo,function(res){
        if(res.data.code==200){
          wx.showToast({
            title: '解绑成功',
            icon:'none',
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },2000)
            }
          })
        }else{
          wx.showToast({
            title: '解绑失败',
            icon:'none'
          })
        }
      })
    }
    
  }
})