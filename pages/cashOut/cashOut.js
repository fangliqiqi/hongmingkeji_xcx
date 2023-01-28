// pages/cashOut/cashOut.js
const app = getApp();
const utils = require("../../utils/util");
const store = require("../../utils/store");
const https = require("../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.AppUrl,
    codeCount: 61,
    userInfo: {},
    amount: '',
    isShow: false,
    isOut: false,
    banklist: [],
    cashOut: {
      id: '',
      bankCode: '',
      bankName: '',
      bankNumber: '',
      phoneNumber: ''
    },
    bankCard: null,
    code: '',
    // data:{
    //   canCarry:0,
    //   stayOut:0,
    //   dealAmont:0
    // },
    data:{
      canWithdrawCommission:0,
      freezeCommission:0,
      totalCommission:0
    },
    accountWay:1,
    isShowtext:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
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
  onShow: function () {
    this.getUser();
    this.setData({
      code:'',
      codeCount:61
    })
    console.log(this.data.accountWay)
  },
  getUser: function () {
    var that = this;
    if (app.globalData.userId == '') {
      wx.hideNavigationBarLoading()
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      this.getPageInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data || null
          })
        }
        this.getPageInfo();
      }
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
  onShareAppMessage: function () {

  },
  //提示弹窗
  showText(e){
    this.setData({
      isShowtext:true
    })
  },
  //关闭提示弹窗
  bindCodeFun(e){
    this.setData({
      isShowtext:false
    })
  },

  showCardFun: function (e) {
    console.info(e)
    var banklist = this.data.banklist || [];
    if (banklist.length > 0) {
      this.setData({
        isShow: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/bankCard/add/add',
      })
    }

  },
  // 单选框 选择到账方式
  radioChange1:function(e){
    // console.log(e)
    var value = e.detail.value;
    this.setData({
      accountWay:value
    }) 
    // console.log(this.data.accountWay)
  },

  // 提现到余额
  cashOutFun1:function(e){
    var that = this;
    var withdrawMoney = that.data.amount || 0;
    var data = {
      withdrawMoney:withdrawMoney
    }
    // console.log(withdrawMoney)
    if (withdrawMoney <=  0) {
        wx.showToast({
          title: '请填写提现金额',
          icon: 'none'
        })
      } else {
        https.getJSON('/share/AgentUserWallet/withdraw/balance',data).then((res) =>{
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              title: '提现成功',
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
          } else {
            wx.showToast({
              title: res.data.msg || '提现失败',
              icon: 'none',
              mask: true,
            })
          }
        }).catch((res)=>{
          wx.showToast({
            title: res.data.msg || '提现失败',
            icon: 'none',
            mask: true,
          })
      })
    }
  },

  // 确认提现到银行卡 按钮
  cashOutFun: function (e) {
    var that = this;
    var amount = that.data.amount || 0;
    var bankCard = that.data.bankCard;
    var d = that.data.data;
      if (amount <= 0) {
        wx.showToast({
          title: '请填写提现金额',
          icon: 'none'
        })
      } else if (amount > d.canCarry) {
        wx.showToast({
          title: '输入金额超过余额',
          icon: 'none'
        })
      } else if (bankCard == null) {
        wx.showToast({
          title: '请选择银行卡',
          icon: 'none'
        })
      } else {
        this.setData({
          isOut: true
        })
      }
      
  },

  closeFun: function (e) {
    this.setData({
      isShow: false,
      isOut: false
    })
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var banklist = this.data.banklist;
    var id = e.detail.value;
    var bankCard = banklist.filter((e, i) => {
      return id == e.id
    })
    this.setData({
      bankCard: bankCard[0]
    })
    this.closeFun();
  },

  toPage: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let url = e.currentTarget.dataset.url;
    if (!userId) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else if (url == "-1") {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      })
    } else if (url) {
      wx.navigateTo({
        url: url,
      })
    }

  },

  getPageInfo: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    https.getJSON('/share/AgentProportionLog/commission/description').then((res) => { 
      wx.hideNavigationBarLoading() 
      // console.log(res)
      var  data = res.data.rows[0]
      // console.log(data)
      if (res.data.code == 200){
        that.setData({
          data:data
        })
      }else{
        console.log('err')
      }
    }).catch((err) => {
      console.info(err)
    });

    // store.getJSON('/share/order/amount', {
    //   userId: userId,
    //   pageSize: 1,
    //   pageNum: 1
    // }, function (res) {
    //   console.info(res)
    //   wx.hideNavigationBarLoading()
    //   if (res.data.code == 200) {
    //     that.setData({
    //       data: res.data.data||{
    //         canCarry:0,
    //         stayOut:0,
    //         dealAmont:0
    //       }
    //     })
    //   }
    // })

    store.getJSON('/share/bank/list', {
      userId: userId,
      pageSize: 100,
      pageNum: 1
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          banklist: res.data.rows
        })
      }
    })
  },
  amountFun: function (e) {
    console.log(e)
    var vl = e.currentTarget.dataset.vl || '';
    this.setData({
      amount: vl
    })
  },
  inputFun: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var vl = e.detail.value;
    if (idx == 2) {
      this.setData({
        code: vl
      })
    } else {
      this.setData({
        amount: vl
      })
    }

  },
  //验证码
  codeTap: utils.throttle(function (e) {
    var that = this;
    if (this.data.codeCount == 61) {
      this.sendCode(e);
    } else {

    }
  }, 3000),
//验证码
  sendCode: function (e) {
    var that = this;
    var phone = that.data.bankCard.phoneNumber;
    // var userphone = that.data.userInfo.phonenumber;
    utils.countFun(function (res) {
      console.info(res)
      that.setData({
        codeCount: res <= 0 ? 61 : res
      })
    }, 61)

    store.getJSON("/share/user/sendCode", {
      phone:phone
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          isDisabled: false
        })
      }
    })
 
  },
  //提现 
  submintFun: function (e) {
    var that = this;
    var amount = that.data.amount||0;
    var canCarry = that.data.data.canWithdrawCommission||0
    if(amount>0&&amount<=canCarry){
      store.getJSON('/share/draw/addDraw', {
        userId: app.globalData.userId,
        drawBankId: that.data.bankCard.id,
        drawRealityTotal: that.data.amount,
        code: that.data.code
      }, function (res) {
        console.info(res)
        if(res.data.code==200){
          wx.navigateTo({
            url: '/pages/cashOut/cashSuccess/cashSuccess?drawOrder='+JSON.stringify(res.data.detail),
            complete:function(){
              that.closeFun()
            }
          })
        }
      });
    }else{
      wx.showToast({
        title: '请正确输入提现金额',
        icon:'none'
      })
    }
  }
})