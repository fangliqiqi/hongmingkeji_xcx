// pages/partner/recharge/index.js
const app = getApp();
const store = require('../../../utils/store')
const https = require('../../../utils/https')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    typelist: [],
    castindex: 0,
    typeindex: 0,
    tempidx:0,
    castobj:{id:1, icon: '/resource/image/icon-66.png', text: '微信充值' },
    castlist: [{id:1, icon: '/resource/image/icon-66.png', text: '微信充值' }, {id:2, icon: '/resource/image/icon-67.png', text: '对公转账' }],
    amount: '',
    typeid: '',
    typeids:[],
    isShow:-1,
    bannerList:[],
    hasOld:[],
    first:false
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
    this.getPageInfo()
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
  payFun: function () {
    var that = this;
    let amount = that.data.amount||0;
    let typeindex = that.data.typeindex;
    // console.log(typeindex)
    if(typeindex!==''&&(typeindex||typeindex==0)){
      if(amount>0){
        let typeobj = that.data.typelist[typeindex];
        let tempAmount = typeobj.startCondition*typeobj.categoryPrice;
        // console.log(tempAmount)
        if(that.data.first && amount<tempAmount){
          wx.showToast({
            title: '首次充值金额，不能低于套餐金额'+tempAmount+'元',
            icon:'none'
          })
        }else{
          let id = typeobj.id||'';
          let castindex = that.data.castobj.id;
          if(castindex==2){
            //对公转账
            // wx.reLaunch({
            //   url: '/pages/partner/recharge/public/index?id='+id+'&amount='+amount,
            // })
            wx.navigateTo({
              url: '/pages/partner/recharge/public/index?typeId='+id+'&amount='+amount,
            })
          }else{
            //微信转账
            var data = {
              totalAmount: amount,
              givenAmount: 0,
              sourceTypeId: '1'
            }
            https.wxPay(data).then((res) => {
              console.info(res)
              if(res.data.code==200){
                // wx.showToast({
                //   title: res.data.msg||'支付成功',
                //   icon:'none',
                //   mask:true,
                //   success:function(){
                //     setTimeout(()=>{
                //       wx.navigateBack({
                //         delta: 1,
                //       })
                //     },1500)
                //   }
                // })
                wx.redirectTo({
                  url: '/pages/partner/recharge/success/index?amount='+amount,
                })
              }
            }).catch((err)=>{
              console.info(err)
            })
          }
        }
      }else{
        wx.showToast({
          title: '请填写充值金额',
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title: '请选择充值商机',
        icon:'none'
      })
    }
    
  },
  getPageInfo: function (cb) {
    var that = this;
    https.getJSON('/wx/api/apiPay/indexPay').then((res) => {
      console.info(res)
      if (res.data.code == 200) {
        that.setData({
          typelist: res.data.data.newList || [],
          hasOld: res.data.data.firstCharge,
          payWallet: res.data.data.payWallet || {}
        })
      }
    })
 
    console.info('获取Banner')
    wx.request({
      url: wx.AppUrl + '/share/banner/getBanner',
      data:{
        type:30
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == 200) {
          that.setData({
            bannerList: res.data.bannerList || []
          })
        }
      },
      fail: function (res) {
        console.info(res)
      },
      complete:function(res){
        wx.stopPullDownRefresh();
      }
    })
  },

  bindPicker(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      isShow:idx
    })
  },
  radioChange(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      castindex: e.detail.value
    })
  },

  bindChange(e){
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      tempidx: e.detail.value[0]
    })
  },

  // 判断是否是第一次充值 
  hasFirst(e){
    let data = this.data.typelist[e]
    let id = data.id;
    console.log(id)
    let hasOld = this.data.hasOld
    console.log(hasOld)
    if(hasOld.includes(id)){
      this.setData({
        first:false
      })
    }else{
      this.setData({
        first:true
      })
    }
    // console.log(this.data.first)
  },

  suretap:function(e){
    console.log()
    let typeindex = this.data.typeindex;
    let tempidx = this.data.tempidx;
    let typeid = this.data.typeid;
    this.setData({
      typeindex: tempidx,
      isShow:-1,
      typeid:tempidx==typeindex?typeid:''
    })
    this.hasFirst(this.data.typeindex)

  },
  
  inputfun: function (e) {
    console.info(e)
    this.setData({
      amount: e.detail.value || ''
    })
  },
  amtap: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    let amt = e.currentTarget.dataset.amt;
    if (idx == -1 ) {
      this.setData({
        amount: amt,
        typeid:''
      })
    }else{
      this.setData({
        amount: amt,
        typeid:id,
        typeindex:idx,
        tempidx:idx
      })
    }
  },

  msgfun:function(e){
    let msg = e.currentTarget.dataset.msg;
    let idx = e.currentTarget.dataset.idx;
    if(idx==1){
      if(this.data.first){
        wx.showToast({
          title: msg,
          icon:'none'
        })
      }
    }else if(idx==2){
      wx.showToast({
        title: msg,
        icon:'none'
      })
    }else if(idx==3){
      let typeindex = this.data.typeindex;
      if(typeindex!==''&&(typeindex||typeindex==0)){
        let typeobj = this.data.typelist[typeindex];
        let amount = this.data.amount;
        let tempAmount = typeobj.startCondition*typeobj.categoryPrice;
        if(typeobj.payCount==0&&amount<tempAmount){
          wx.showToast({
            title: '首次充值金额，不能低于套餐金额'+tempAmount+'元',
            icon:'none'
          })
        }
        
      }else{
        wx.showToast({
          title: '请选择充值商机',
          icon:'none'
        })
      }
      
    }
    
  },
  closeFun: function (e) {
    this.setData({
      isShow: -1
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var castlist = this.data.castlist;
    var id = e.detail.value;
    var cast = castlist.filter((e, i) => {
      return id == e.id
    })
    this.setData({
      castobj: cast[0]
    })
    this.closeFun();
  },
  toPage: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let idx = e.currentTarget.dataset.idx;
    let url = e.currentTarget.dataset.url;
    let web = e.currentTarget.dataset.web;
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login?idx=' + idx,
      })
    } else if (idx == -1) {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      })
    } else if (url) {
      if (web == 1) {
        wx.navigateTo({
          url: '/pages/web/web?url=' + url,
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    }

  },
})