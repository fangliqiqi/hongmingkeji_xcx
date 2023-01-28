const https = require("../../../utils/https");
const util= require("../../../utils/util")
// pages/agent/detail/index.js
var setInter = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.AppealUrl,
    callPhone: wx.callPhone,
    distime:259200,
    isFollow: false,
    isAppeal:false,//申述
    showFlag:false,
    nowDate: null,
    id:'',
    conlist:[],
    source:{},
    content:'',
    followTime:'',
    turnover:'',
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var date = new Date();
    let  m = date.getMonth()+1;
    let d = date.getDate();
    let nowDate = date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)
    this.setData({
      id:options.id||'',
      nowDate: nowDate,
      now:date.getTime()
    })
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
    this.getPageInfo();
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
    if(setInter){
      clearInterval(setInter);
    }
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
  closeFun: function (e) {
    this.setData({
      isAppeal:false,
      isFollow: false,
      showFlag:false,
      pid:'',
      content:'',
      followTime:''
    })
  },
  showFollowTap: function (e) {
    let state = e.currentTarget.dataset.state;
    let deal = e.currentTarget.dataset.deal;
    if(state==10&&deal!=10){
      this.setData({
        isFollow: true
      })
    }
  },
  stopfun:function(){
    console.info("stopfun")
    return false;
  },
  
  getPageInfo:function(cb){
    var that = this;
    https.getJSON('/wx/api/customerSource/getInfo',{id:that.data.id}).then((res)=>{
      console.info(res)
      if(res.data.code==200){
        var data = res.data.data;
        if(setInter){
          clearInterval(setInter);
        }
        if(data.customerSource.dealState==10){
          that.setData({
            source: data.customerSource
          })
        }else{
          that.dateformat(data.customerSource);
        }
        let imgList = [];
        let audioList = [];
        data.custFollowList.map(items=>{
          if(items.textFilePath &&items.textFilePath.length>0){
            items.textFilePath = items.textFilePath.split(',')
            
            items.textFilePath.forEach(item=>{
              let testmsg = item.substring(item.lastIndexOf('.')+1);
              if(testmsg=='jpg'||testmsg=='png'){
                imgList.push(item)
                items.img = imgList
              }
              if(testmsg =='mp3'|| testmsg == 'wav'){
                console.log('是音乐啊')
                audioList.push(item)
                items.audio = audioList
              }
            })
          }
          imgList = []
          audioList = []
          return items
        })
        console.log(data.custFollowList)
        that.setData({
          conlist:data.custFollowList||[],
        })
        
      }
    }).catch((err)=>{
      console.info(err)
    })
  },
  // 时间格式转换
  dateformat: function (source) {
    var that = this;
    var distime = that.data.distime||1800;
    source.distime = countdown(util.getTime(source.receiveTime));
    
    that.setData({
      source: source
    })
    setInter = setInterval(function () {
      source.distime = countdown(util.getTime(source.receiveTime));
      if(distime>=source.distime){
        that.setData({
          source: source
        })
      }else{
        clearInterval(setInter);
      }
      
    }, 1000);
    //倒计时的时间
    function countdown(date) {
      let atime = new Date(date).getTime();
      let now = new Date().getTime(); //现在的时间
      let time = now - atime;
      if (time >= 0) {
        return parseInt(time / 1000)
      }else{
        return 0
      }
    }
  },
  callPhone: function () {
    var that = this;
    var phone = that.data.source.customerPhone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        complete: function () {
          that.setData({
            isShow: false
          })
        }
      })
    }
  },

  // 提交跟进记录
  // sureFun:function(e){
  //   // console.log('123456')
  //   var that = this;
  //   var data = {customerId:that.data.id, content:that.data.content,followTime:that.data.followTime}
  //   if(data.content.trim()==''||data.content.length==0){
  //     wx.showToast({
  //       title: '请录入跟进内容',
  //       icon:'none'
  //     })
  //   }else if(data.followTime.trim()==''||data.followTime.length==0){
  //     wx.showToast({
  //       title: '请选择下次跟进时间',
  //       icon:'none'
  //     })
  //   }else if(data.customerId){
      
  //     https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
  //       console.info(res)
  //       if(res.data.code==200){
  //         var data = res.data.data;
  //         that.getPageInfo();
  //       }
  //       that.closeFun();
  //     }).catch((err)=>{
  //       that.closeFun();
  //       console.info(err)
  //     })
  //   }
  // },

  sureFun:util.throttle(function(e){
    var that = this;
    var data = {customerId:that.data.id, content:that.data.content,followTime:that.data.followTime}
    if(data.content.trim()==''||data.content.length==0){
      wx.showToast({
        title: '请录入跟进内容',
        icon:'none'
      })
    }else if(data.followTime.trim()==''||data.followTime.length==0){
      wx.showToast({
        title: '请选择下次跟进时间',
        icon:'none'
      })
    }else if(data.customerId){
      that.addFollow(e)
    }
  },2000),

  

  // 跟进记录
  addFollow(){
    var that = this;
    var data = {customerId:that.data.id, content:that.data.content,followTime:that.data.followTime}
    https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
      console.info(res)
      if(res.data.code==200){
        var data = res.data.data;
        that.getPageInfo();
      }
      that.closeFun();
    }).catch((err)=>{
      that.closeFun();
      console.info(err)
    })
  },



  bindDateChange:function(e){
    this.setData({
      followTime:e.detail.value
    })
  },
  inputFun:function(e){
    console.info(e)
    this.setData({
      content:e.detail.value
    })
  },
  // 
  submintTap:function(e){
    let that = this;
    this.setData({
      showFlag:true
    })
    // wx.showModal({
    //   content:'是否确定成交sss？',
    //   confirmColor:'#0155fe',
    //   cancelColor: '#212429',
    //   success:function(res){
    //     if(res.confirm){
    //       that.submintFun(e)
    //     }
    //   }
    // })
  },
  
  submintFun:function(e){
    var that = this;
    let id = that.data.id;
    let turnover = that.data.turnover;
    var data = {
      id:id,
      turnover:turnover
    }
    if(!turnover){
      wx.showToast({
        title: '请输入成交金额',
        icon:'none'
      })
    }else{
      if(id){
        https.getJSON('/wx/api/customerSource/upDealState',data).then((res)=>{
          if(res.data.code==200){
            wx.showToast({
              title: '提交成功',
              duration:1000,
              success:function(){
                setTimeout(function(){
                  that.setData({
                    showFlag:false
                  })
                  that.getPageInfo();
                },1500)
              }
            }) 
          }else{
            wx.showToast({
              title: '提交失败',
              icon:'none'
            })
          }
        }).catch((err)=>{
          wx.showToast({
            title: '提交失败',
            icon:'none'
          })
        })
      }
    }
  },


  appeal: function(e) {
    //申诉
    let  idx = e.currentTarget.dataset.idx;
    let  id = e.currentTarget.dataset.id;
    let give =  e.currentTarget.dataset.give;
    if(give==1){
      wx.showToast({
        title: '赠送商机，无法进行申述哦~',
        icon:'none'
      })
    }else{
      if(idx==1){
        // this.setData({
        //   isAppeal:true
        // })
        wx.navigateTo({
          // url: './appeal/index?id='+ id,
          url: '../appeal/index?id='+id
        })
      }else if(idx==2){
        wx.showToast({
          title: '申诉审核中',
          icon:'none'
        })
      }else if(idx==3){
        wx.showToast({
          title: '无法提起申诉',
          icon:'none'
        })
      }
    }
    
  },
  sureAppeal:function(){
    let that = this;
    let  id = this.data.id;
    var data = {customerId:id, content:that.data.content,followTime:util.formatDate(new Date())}
    if(data.content.trim()==''||data.content.length==0){
      wx.showToast({
        title: '请录入申述缘由',
        icon:'none'
      })
    }else if(data.customerId){
      https.getJSON('/wx/api/customerSource/upCustomer',{
        id:id
      }).then((res)=>{
        if(res.data.code==200){
          wx.showToast({
            title: '申诉提交成功',
            icon:'none'
          })
          https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
            // console.info(res)
            if(res.data.code==200){
              var data = res.data.data;
            }
          })
        }else{
          wx.showToast({
            title: '已经过了申述有效期',
            icon:'none'
          })
        }
        that.closeFun();
          that.setData({
            pageNum: 1,
            conlist: [],
          })
          that.getPageInfo(function () {
            that.setData({
              loading: false
            })
          })
        // console.info(res)
      }).catch((err)=>{ 
        that.closeFun();
      })
    }
  },
  
  // upCustomer:function(id){
  //   let  that =this;
  //   https.getJSON('/wx/api/customerSource/upCustomer',{
  //     id:id
  //   }).then((res)=>{
  //     if(res.data.code==200){
  //       wx.showToast({
  //         title: '申诉提交成功',
  //         icon:'none'
  //       })
  //       https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
  //         console.info(res)
  //         if(res.data.code==200){
  //           var data = res.data.data;
  //         }
  //       }).catch((err)=>{
  //         console.info(err)
  //       })
  //     }
  //     that.closeFun();
  //     that.setData({
  //       pageNum: 1,
  //       conlist: [],
  //     })
  //     that.getPageInfo(function () {
  //       that.setData({
  //         loading: false
  //       })
  //     })
  //     // console.info(res)
  //   }).catch((err)=>{ 
  //     console.log(',,,,,')
  //     wx.showToast({
  //       title: '已经过了申述有效期',
  //       icon:'none'
  //     })
  //     that.closeFun();
  //   })
  // },
})