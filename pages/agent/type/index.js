// pages/agent/type/index.js
const app = getApp();
const store = require("../../../utils/store");
const https = require("../../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: false,
    conlist: [],
    sellist:[],
    objlist: [],
    company_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = options.obj || '';
    let company_id = options.cid || '';
    if (obj || company_id) {
      this.setData({
        objlist: JSON.parse(obj) || [],
        company_id: company_id || ''
      })
    }
    this.getPageInfo();
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
  getPageInfo: function (cb) {
    var that = this;
    store.postJSON('/wx/api/partner/getSourceList', {
      companyId: that.data.company_id || ''
    }, function (res) {
      console.info(res)
      if(res.data.code==200){
        var conlist = res.data.data.newList||[];
        var sellist = res.data.data.oldList||[];
        var temlist = [];
        temlist = conlist.map((x,a)=>{
          let temp =  x.cateTypeLv ;
          sellist.forEach((y,b)=>{
            if(temp==y.cateTypeLv){
              x.select = 1;
            }
          })
          return x;
        })


        that.setData({
          conlist:temlist,
          sellist:sellist
        })
      }
    })
  },
  addtap:function(e){
    let  tid = e.currentTarget.dataset.tid||'';
    let id = e.currentTarget.dataset.id||'';
    let sellist = this.data.sellist||[];
    let conlist = this.data.conlist||[];
    if(id){
      this.setData({
        sellist:sellist.concat(conlist.filter((x,a)=>{
          return x.cateTypeLv==tid
        })),
        conlist:conlist.map((x,a)=>{
          if(x.cateTypeLv==tid){
            x.select = 1;
          }
          return x;
        })
      })
    }
  },
  deltap:function(e){
    let  tid = e.currentTarget.dataset.tid||'';
    let id = e.currentTarget.dataset.id||'';
    let sellist = this.data.sellist||[];
    let conlist = this.data.conlist||[];
    if(id){
      this.setData({
        sellist:sellist.filter((x,a)=>{
          return x.cateTypeLv!=tid
        }),
        conlist:conlist.map((x,a)=>{
          if(x.cateTypeLv==tid){
            x.select = 0;
          }
          return x;
        })
      })
    }
  },
  submintFun: function () {
    var that = this;
    var sellist = this.data.sellist||[]
    
    https.postJSON('/wx/api/partner/updateSource', { 
      companyId: that.data.company_id || '',
      sourceTypeOptions: sellist.map((x,a)=>{
        return x.cateTypeLv
      }).join(',')||''
  }).then((res)=> {
      if(res.data.code==200){
        that.setData({
          isSuccess:true
        })
      }
      console.info(value)
    }).catch(function onRejected(error) {
      console.info(error)
    });
  },
  closeFun:function(e){
    let back = e.currentTarget.dataset.back||'';
    this.setData({
      isSuccess:false
    })
    if(back==1){
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})