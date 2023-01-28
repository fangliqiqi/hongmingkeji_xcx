// pages/form/index.js
const app = getApp();
const store = require("../../utils/store");
const utils = require("../../utils/util");
const https = require("../../utils/https");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    cardUrl: wx.cardUrl,
    userInfo: {},
    region: ['', '', ''],
    index: '',
    servers: wx.serlist.filter((e) => {
      return e != '';
    }),
    bannerList: [],
    msgList: [],
    msgobj: '',
    animation: '',
    obj: {},
    companyIndustry: '',
    idcardPositive: '',
    idcardReverse: '',
    dataTransfer:'10',
    companyType:'20',
    businessLicensePositive:'',
    comlist: [],
    comObj: '',
    auth_a: '',
    auth_b: '',
    cardInfo:{},//卡券详情,
    cardNum:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      success: (res) => { },
    })
    console.info(options)
    var that = this;
    let idx = options.idx || 10, item = '';
    if (options.obj) {
      item = JSON.parse(options.obj);
    }
    that.setData({
      idx: idx,
      obj: item
    })
    if (options.index) {
      let list = this.data.servers;
      let index = options.index - 1;
      this.setData({
        index: index + '',
        'share.category': list[index].id
      })
    }
    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getPageInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getUser();
    this.getCardInfo();
  },
  getUser: function (){
    var that = this;
    if (app.globalData.userId == '') {
      wx.hideNavigationBarLoading();
    } else if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        'share.recommendId': app.globalData.userInfo.userId
      })
      wx.hideNavigationBarLoading();
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          that.setData({
            userInfo: res.data.data || null,
            'share.recommendId': res.data.data.userId
          })
        }
        wx.hideNavigationBarLoading();
      }
    }
  },
  // 获取卡券信息
  getCardInfo(){
    let that =this;
    let data = {
      id:that.data.obj.id
    }
    if(that.data.idx==60){
      https.getJSON('/share/activity/getInfo',data).then(res=>{
        if(res.data.code==200){
          let datas = res.data.data
          if(datas.photoFlag=='yellow'){
            datas.cardColor='colorYellow'
          }else if(datas.photoFlag=='gray'){
            datas.cardColor='colorGray'
          }else if(datas.photoFlag=='cyan'){
            datas.cardColor='colorCyan'
          }else if(datas.photoFlag=='blue'){
            datas.cardColor='colorBlue'
          }
          that.setData({
            cardInfo:res.data.data
          })
          let num = res.data.data.businessList.length
          switch(num) {
            case 1:
              that.setData({
                cardNum:'一'
              })
               break;
            case 2:
              that.setData({
                cardNum:'二'
              })
               break;
               case 3:
              that.setData({
                cardNum:'三'
              })
               break;
               case 4:
              that.setData({
                cardNum:'四'
              })
               break;
               case 5:
              that.setData({
                cardNum:'五'
              })
               break;
             } 
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
    var userId = app.globalData.userId; //传的id
    let shareImg = this.data.shareImg;  //分享的时候展示的图片
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
      path: '/pages/index/index?recommendId=' + userId,
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
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let vl = e.detail.value;
    this.setData({
      region: vl,
      'share.prov': vl[0],
      'share.city': vl[1],
      'share.county': vl[2]
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    let list = this.data.comlist;
    this.setData({
      index: index,
      code: list[parseInt(index)].code
    })
  },
  inputfun: function (e) {
    var vl = e.detail.value;
    let idx = e.currentTarget.dataset.idx;
    if (idx == 1) {
      this.setData({
        username: vl
      })
    } else if (idx == 2) {
      this.setData({
        userPhone: vl
      })
    } else if (idx == 3) {
      this.setData({
        companyName: vl
      })
    }
  },
  formSubmit: utils.throttle(function (e) {
    this.subminfun(e);
  }, 3000),
  
  subminfun: function (e) {
    var that = this;
    let userId = app.globalData.userId || '';
    console.info(e);
    let idx = that.data.idx;
    let obj = that.data.obj;
    let item = e.detail.value;
    item.type = idx;
    item.activityId = obj.id;
    item.activityPrice = obj.activityPrice;
    item.paymentAmount = obj.activityPrice;
    item.activitySalesmanPhone = obj.salesmanPhone;
    if (!userId || userId == ''){
      wx.navigateTo({
        url: '/pages/login/login?cb=1'
      })
    } else if (idx!=60&&item.username.trim().length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    } else if (idx!=60&&item.userPhone.trim().length < 11) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else if (idx==50&&item.companyName.trim().length == 0) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      })
    }else if (idx==30&&item.companyName.trim().length == 0) {
      wx.showToast({
        title: '请输入公司名',
        icon: 'none'
      })
    } else if (idx==30&&item.companyIndustry.trim().length == 0) {
      wx.showToast({
        title: '请选择公司行业',
        icon: 'none'
      })
    } else if (idx==30&&item.legalPersonName.trim().length == 0) {
      wx.showToast({
        title: '请输入法人姓名',
        icon: 'none'
      })
    } else if (idx==30&&item.legalPersonPhone.trim().length == 0) {
      wx.showToast({
        title: '请输入法人手机号码',
        icon: 'none'
      })
    } else if (idx==30&&item.idcardPositive.trim().length == 0) {
      wx.showToast({
        title: '请上传身份证正面',
        icon: 'none'
      })
    } else if (idx==30&&item.idcardReverse.trim().length == 0) {
      wx.showToast({
        title: '请上传身份证反面',
        icon: 'none'
      })
    } else if (idx==40&&item.dataTransfer.trim().length == 0) {
      wx.showToast({
        title: '请选择是否需要交接资料',
        icon: 'none'
      })
    } else if (idx==40&&item.companyType.trim().length == 0) {
      wx.showToast({
        title: '请选择企业性质',
        icon: 'none'
      })
    } else if (idx==40&&item.businessLicensePositive.trim().length == 0) {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none'
      })
    }else if(idx==30){
      https.payJSON('/wx/api/fActivity/prepayCompanyRegister', item,'/wx/api/fActivity/notify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
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
    }else if(idx==40){
      https.payJSON('/wx/api/fActivity/prepayBookkeepingAgency', item,'/wx/api/fActivity/notify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
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
    }else if(idx==50){
      https.payJSON('/wx/api/fActivity/prepayExaminationAgency', item,'/wx/api/fActivity/notify').then((res)=>{
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg || '支付成功',
            icon: 'none',
            mask: true,
            success: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
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
    }else if(idx==60){
      let card = {
        cardId:that.data.cardInfo.id,
        cardNumber:1,
        cardPrice:that.data.cardInfo.activityPrice,
        payMoney:that.data.cardInfo.activityPrice,
        payType:1
      }
      https.postJSON('/share/cardOrder/add4Index',card).then(res=>{
        if(res.data.code==200){
          let orderId = res.data.data.idStr
           https.payJSON('/share/pay/cardOrderPrepay',{orderId:orderId},'/share/pay/cardNotify').then((res)=>{
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg || '支付成功',
                icon: 'none',
                mask: true,
                success: function () {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1,
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
        }
      })
    }
  },
  // 点击打电话
  toPhone(){
    var phone = wx.callPhone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },
  toPage: function () {
    var that = this;
    let item = {
      recommendId: app.globalData.userId,
      nickName: '',
      phonenumber: '',
      prov: '',
      city: '',
      county: '',
      remark: '',
      category: ''
    }
    this.setData({
      share: item,
      index: '',
      region: ['', '', ''],
      isRecommend: false
    })
  },

  closeFun: function () {
    this.setData({
      isRError: false
    })
  },
  getPageInfo: function () {
    var that = this;
    https.getJSON('/wx/api/industry/getMapIndustry').then((res) => {
      console.info(res)
      if (res.data.code == 200) {
        that.setData({
          comlist: res.data.data || []
        })
      }
    })
  },
  uploadtap: function (e) {
    console.info(e);
    var that = this;
    let obj = e.currentTarget.dataset;
    wx.chooseImage({
      success(res) {
        console.info(res)
        let path = res.tempFilePaths[0];
        obj.path = path;
        wx.showLoading({
          title: '上传中……',
          complete: function () {
            that.updataFun(obj);
          }
        })
      }
    })
  },
  updataFun: function (obj) {
    let that = this;
    wx.uploadFile({
      url: wx.AppUrl + '/wx/api/upload/materialUpload', //仅为示例，非真实的接口地址
      filePath: obj.path,
      name: 'file',
      formData: {
        'type': obj.type
      },
      success(res) {
        console.info(res)
        var data = res.data
        //do something
        data = JSON.parse(data)
        if (obj.type == 'cardReverse') {
          that.setData({
            auth_b: obj.path,
            idcardReverse: data.imgUrl
          })
        } else if (obj.type == 'cardFront') {
          that.setData({
            auth_a: obj.path,
            idcardPositive: data.imgUrl
          })
        } else if (obj.type == 'licenseImg') {
          that.setData({
            auth_a: obj.path,
            businessLicensePositive: data.imgUrl
          })
        }

        wx.showToast({
          icon: 'success',
          title: '上传成功',
        })
      }, fail: function (res) {
        console.info(res)
        wx.showToast({
          icon: 'success',
          title: '上传失败',
        })
      },
      complete: function () {
        wx.hideLoading({
          success: (res) => {
          },
        })
      }
    })
  },

  toIndustry: function (e) {
    var that = this;
    let comObj = that.data.comObj;
    wx.navigateTo({
      url: '/pages/form/industry/industry?obj=' + JSON.stringify(comObj),
      events: {
        acceptDataFromOpenedPage: function (res) {
          console.log(res)
          if (res.data) {
            that.setData({
              comObj: res.data || '',
              companyIndustry: res.data.id || ''
            })
          }
        },
      },
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: comObj })
      }
    })
  },
  radioChange:function(e){
    console.info(e)
    let idx = e.currentTarget.dataset.idx;
    let vl = e.detail.value;
    if(idx==10){
      this.setData({
        dataTransfer:vl
      })
    }else if(idx==20){
      this.setData({
        companyType:vl
      })
    }
  }
})