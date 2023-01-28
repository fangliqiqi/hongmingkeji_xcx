// pages/detail/detail.js
const app = getApp();
const store = require("../../utils/store");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    url:wx.CdnUrl,
    idx: '',
    serlist: wx.serlist,
    isShow: false,
    toHome:false,
    callPhone: wx.callPhone,
    posterindex:1,
    canvas:{
      pix:1,
      ww:646,
      hh:1100,
      hbw:646,
      hbh:851,
      codew:184,
      codeh:184,
    },hbflag:0,
    scanCode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.info(options)
    let idx =  options.idx||1
    that.setData({
      idx: idx,
      posterindex:idx
    })
    wx.setNavigationBarTitle({
      title: that.data.serlist[idx],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var pages =  getCurrentPages();
    console.info(pages)
    if(pages.length==1){
      wx.hideHomeButton({
        success: (res) => {},
      })
      this.setData({
        toHome:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    // this.setData({
    //   posterindex:Math.round(Math.random()*1+2)
    // })
    this.getUser();
  },
  getUser: function () {
    var that = this;
    if(app.globalData.userId==''){
      wx.hideNavigationBarLoading()
      that.setData({
        userInfo: null
      })
      that.shareFun()
    }else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
      wx.hideNavigationBarLoading()
      that.shareFun()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
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
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage'],
        success: function (res) {
          console.info(res);
        },
        fail: function (res) {
          console.info(res);
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
  onShareAppMessage: function (e) {
    console.info(e)
    var share_title = "共享会计 · 莫的问题"; //分享名称
    var userId = wx.uId; //传的id
    var posterindex = this.data.posterindex;
    var idx = this.data.idx||1;
    let shareImg = wx.CdnUrl+'/profile/static/images/poster-'+posterindex+'.jpg';//this.data.shareImg;  //分享的时候展示的图片
    var that = this;
    if (!userId || userId == '') {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else if (e.from === 'button') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    var shareObj = {
      title: share_title,
      path: '/pages/detail/detail?rid=' + userId+'&idx=' + idx,
      imageUrl: shareImg ? shareImg : "/resource/image/share.jpg",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    console.info(shareObj)
    return shareObj
  },
  // onShareTimeline: function (e) {
  //   console.info(e)
  //   var share_title = "共享会计 · 莫的问题"; //分享名称
  //   var userId = wx.uId; //传的id
  //   let shareImg = this.data.shareImg;  //分享的时候展示的图片
  //   let idx = this.data.idx;
  //   var that = this;
  //   var shareObj = {
  //     title: share_title,
  //     query: 'rid='+userId+'&idx='+idx,
  //     imageUrl: shareImg ? shareImg : "/resource/image/share.jpg",
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  //   return shareObj;
  // },
  callPhone: function () {
    var phone = wx.callPhone;
    var that = this;
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
  toPage: function (e) {
    var that = this;
    let userId = app.globalData.userId;
    console.info(e);
    let idx = e.currentTarget.dataset.idx;
    let url = e.currentTarget.dataset.url;
    let web = e.currentTarget.dataset.web;
    let show = e.currentTarget.dataset.show || '';
    if (!userId) {
      wx.navigateTo({
        url: '/pages/login/login?idx=' + idx,
      })
    } else if (show) {
      that.setData({
        isShare: show == 2,
        isShow: show == 1,
        callPhone: wx.callPhone
      })
    } else if (idx == -1) {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      })
    } else if (idx >= 1) {
      wx.reLaunch({
        url: url + idx,
        success:function(){
          that.closeFun();
        }
      })
    } else if (url) {
      wx.navigateTo({
        url: url,
        success:function(){
          that.closeFun();
        }
      })
    }

  },
  toHome:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  closeFun: function (e) {
    this.setData({
      isShow: false,
      isShare: false
    })
  },
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
    var path = e.detail.path || '';
    if (path) {
      wx.reLaunch({
        url: path,
      })
    }
    this.closeFun();
  },
  // 图片合成
  drawCanvasFun:function(item){
    wx.showLoading({
      title: '生成中…',
      complete: (res) => {},
      fail: (res) => {},
      mask: true,
      success: (res) => {},
    })
    
    var that =this;
    var scanCode = that.data.scanCode;
    that.setData({
      hbflag:0
    })
    //海报背景
    var hbsrc = wx.CdnUrl+'/profile/static/images/'+item+'.jpg?v='+new Date().getTime();
    //头像
    var userInfo = app.globalData.userInfo;
    
    //保存分享图片=======e

    that.downLoadImg(hbsrc,'postersrc',function(){
      that.drawFun(1)
    })
    if(scanCode){
      console.log("scanCode")
      that.downLoadImg(scanCode,'codesrc',function(){
        that.drawFun(2)
      })
    }else{
      that.getScanCodeFun(function(res){
        console.log("getScanCodeFun")
        console.log(res)
        if(res.data.code==200){
          that.downLoadImg(that.data.scanCode,'codesrc',function(){
            that.drawFun(2)
          })
        }else{
          wx.hideLoading();
        }
      })
    }
    if(userInfo&&userInfo.avatar){
      var hdsrc = wx.AppUrl+userInfo.avatar+'?v='+new Date().getTime();
      that.downLoadImg(hdsrc,'headersrc',function(){
        that.drawFun(3)
      })
    }
  },
  
  drawFun:function(count){
    console.info(count)
    var that = this;
    var hbflag = count + that.data.hbflag||0;
    var userInfo = that.data.userInfo;
    that.setData({
      hbflag:hbflag
    })
    console.info(count)
    if((hbflag==3&&!(userInfo&&userInfo.avatar))||(hbflag==6&&userInfo&&userInfo.avatar)){
      console.info(count)
      that.drawCanvas();
    }
  },
  drawCanvas:function(){
    console.log("drawCanvas")
    const ctx = wx.createCanvasContext('evinCanvas')
    var that = this;
    var userInfo = that.data.userInfo;
    var pix = that.data.canvas.pix;
    var cvs = that.data.canvas;
    // var postersrc = wx.getStorageSync("");
    // var codesrc = wx.getStorageSync("codesrc");
    var cw = cvs.ww*pix,
        ch = cvs.hh*pix,
        ww = cw,
        hh = ch,
        hbw = cvs.hbw*pix,
        hbh = cvs.hbh*pix,
        ccw = cvs.codew*pix,
        cch = cvs.codeh*pix;

    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, ww, hh)
    ctx.draw()
    try {
      ctx.drawImage('../../resource/image/text02.png',40,982, 317, 92);
    } catch (error) {
      console.info(error)
      ctx.font = 'SIMHEI';
      ctx.setFillStyle('#737278')
      ctx.setFontSize(25);
      ctx.fillText('莫的问题 共享会计',40,77 + hbh)
      ctx.fillText('企业财税服务领先品牌', 40,117 + hbh)
      ctx.fillText('长按识别二维码 快速找到好服务', 40, 157 + hbh)
    }
    // ctx.draw(true)
    ctx.setFillStyle('#eeeeee')
    ctx.fillRect(38, 960, 76, 3)
    //用户名
    ctx.setFillStyle("#212429")
    ctx.setFontSize(28);
    ctx.fillText(userInfo.nickName,140,915)
    ctx.draw(true,()=>{ 
      wx.getStorage({
        key: 'postersrc',
        success:function(res){
          console.info(res)
          ctx.drawImage(res.data,0,0, hbw, hbh);
          ctx.beginPath()
          ctx.arc(20,852,20,0, 2 * Math.PI);
          ctx.setFillStyle('#ffffff')
          ctx.fill()
          ctx.beginPath()
          ctx.fillRect(20, 832, hbw-40, 20);
          ctx.setFillStyle('#ffffff')
          ctx.fill()
          ctx.beginPath()
          ctx.arc(hbw-20,852,20,0, 2 * Math.PI);
          ctx.setFillStyle('#ffffff')
          ctx.fill()
          ctx.draw(true,()=>{ 
            wx.getStorage({
              key: 'codesrc',
              success:function(resd){
                console.log(resd.data)
                ctx.drawImage(resd.data, cw - ccw - 32 ,880, ccw, cch);
                ctx.draw(true,()=>{ 
                  ctx.save();
                  ctx.beginPath() //开始创建一个路径
                  ctx.arc(71, 905, 30, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
                  // ctx.stroke();
                  ctx.clip() //裁剪
                  if(userInfo&&userInfo.avatar){
                    wx.getStorage({
                      key: 'headersrc',
                      success:function(resh){
                        ctx.drawImage(resh.data, 40, 874, 60, 60) //绘制图片
                        ctx.restore() //恢复之前保存的绘图上下文
                        ctx.draw(true,()=>{ 
                          that.saveImagefun();
                        })
                      },
                      fail:function(){
                        ctx.drawImage("../../resource/image/header.png", 40, 874, 60, 60) //绘制图片
                        ctx.restore() //恢复之前保存的绘图上下文
                        that.saveImagefun();
                      }
                    })
                  }else{
                    ctx.drawImage("../../resource/image/header.png", 40, 874, 60, 60) //绘制图片
                    ctx.restore() //恢复之前保存的绘图上下文
                    that.saveImagefun();
                  }
                })
              },
              fail:function(){
                wx.hideLoading();
              }
            })
          })
        },
        fail:function(){
          wx.hideLoading();
        },
        complete:function(){
          console.info("背景画完")
        }
      })
    })
  },

  // 图片授权
  authSettingFun:function(e){
    var that = this;
    var item = 'poster-bg-'+that.data.posterindex;
    var carOwner = app.globalData.carOwner;
    // 分享页面（选择分享方式）=======s==用户点击某一分享方式时触发
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.writePhotosAlbum']==undefined){
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              that.drawCanvasFun(item);
            },
            fail: function (err) {
              console.log('授权失败')
             
            }
          })
        }else if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.openSetting({'withSubscriptions':true,
            success (ress) {
              console.log(ress)
              if (ress.authSetting['scope.writePhotosAlbum']) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                //图片保存到本地
                that.drawCanvasFun(item);
              } else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                wx.showModal({
                  title: '警告',
                  content: '获取权限失败，无法正常使用',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
            }
          })
        } else {
          console.log('已经授权成功')
          //图片保存到本地
          that.drawCanvasFun(item);
        }
      }
    })
  },
  // 保存canvas
  saveImagefun: function () {
    var that = this;
    console.log("saveImagefun")
    wx.canvasToTempFilePath({ //生成图片
      canvasId: 'evinCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({  //保存生成的图片到手机相册里
          filePath: res.tempFilePath,
          success(res) {
            console.info(res)
            that.setData({
              isShare: false
            })
            wx.hideLoading();
            wx.showToast({
              title: '海报生成成功，已保存至您的手机相册',
              icon:'none',
              duration:2000
            })
          }, 
          fail: function (err) {
            console.log(err);
            wx.hideLoading();
          },
          complete:function(res){
            
            console.info(res)
          }
        })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '生成海报失败',
          icon:'none'
        })
      },
      complete:function(res){
        console.info(res)
      }
    })
  },
  // 下载网络图片
  downLoadImg: function (netUrl, storageKeyUrl,callback) {
    var that = this;
    console.info(netUrl)
    wx.getImageInfo({
      src: netUrl, //请求的网络图片路径 
      success: function (res) { //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中 
        wx.setStorage({ key: storageKeyUrl, data: res.path });
        if(typeof callback == 'function'){
          callback(res)
        }
      },
      fail:function(res){
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '获取二维码失败',
              icon:'none'
            })
          },
        })
      }
    })
  },
  getScanCodeFun:function(func){
    var that = this;
    var userInfo = app.globalData.userInfo;
    var userId = app.globalData.userId;
    var idx = that.data.idx;
    var posterCode = ''
    var sharescene = 'r=' + (userId || '')+'&idx='+idx;
    if(userInfo&&userInfo.userId){
      that.getScanCode(sharescene,function(ress){
        if(typeof func == 'function'){
          func(ress);
        }
      })
    }else if(userId){
      app.getUser(userId,function(res){
        let data = res.data.data || "";
        if(res.data.code=='200'&&data){
          sharescene = 'r=' + (data.userId || '')+'&idx='+idx;
        }
        that.getScanCode(sharescene,function(ress){
          if(typeof func == 'function'){
            func(ress);
          }
        })
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  getScanCode:function(scene,func){
    var that = this;
    store.getJSON("/share/user/wxcode", {
      secene: scene,
      page: 'pages/detail/detail'
    },
    function (res) {
      console.info(res)
      if (res.data.code == "200") {
        that.setData({
          scanCode:wx.CdnUrl+res.data.img_url
        })
      }
      if(typeof func == 'function'){
        func(res);
      }
    })
  },
})