const app = getApp();
const https = require("../../../utils/https")

// pages/personal/companyset/companyset.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.CdnUrl,
    url:wx.AppUrl,
    companyinfo:{
      id:'',
      companyName:'',
      chargePersonName:'',
      chargePersonPhone:'',
      businessLicenseUrl:'',
      legalPersonIdcardBackUrl:'',
      legalPersonIdcardFrontUrl:''
    },
    
    auth_a: '',
    auth_b: '',
    auth_c: ''
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPageinfo()
  },
  //页面获取
  getPageinfo:function(){
    https.getJSON('/share/AgentCompany/query/companyInfo').then((res) => {
      console.log(res)
      if(res.data.data.id){
        this.setData({
          companyinfo:res.data.data
        })
      }
      
    })
  },

  // 图片上传
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
    console.log(obj)
    let that = this;
    wx.uploadFile({
      url: wx.AppUrl + '/share/AgentCompany/uploadAgentCompany', 
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
            auth_a: obj.path,
            'companyinfo.legalPersonIdcardBackUrl': data.imgUrl
          })
        } else if (obj.type == 'cardFront') {
          that.setData({
            auth_b: obj.path,
            'companyinfo.legalPersonIdcardFrontUrl': data.imgUrl
          })
        } else if (obj.type == 'licenseImg') {
          that.setData({
            auth_c: obj.path,
           'companyinfo.businessLicenseUrl': data.imgUrl
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

  //输入信息
  inputFun: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var vl = e.detail.value;
    // console.info(e)
    if (idx == 1) {
      this.setData({
        'companyinfo.companyName': vl,
      })
    } else if (idx == 2) {
      this.setData({
        'companyinfo.chargePersonName': vl,
      })
    } else{
      this.setData({
        'companyinfo.chargePersonPhone': vl,
      })
    }
  },

  // 确认添加事件
  submintFun:function(e){
    var that  = this;
    // var userId = app.globalData.userId;
    var companyinfo = that.data.companyinfo;
    if(companyinfo.companyName.length == 0){
      wx.showToast({
        title: '请输入公司名称',
        icon:'none'
      })
    }else if(!companyinfo.businessLicenseUrl){
      wx.showToast({
        title: '请上传营业执照',
        icon:'none'
      })
    }else if(!companyinfo.legalPersonIdcardBackUrl){
      wx.showToast({
        title: '请上传身份证正反面',
        icon:'none'
      })
    }else if(!companyinfo.legalPersonIdcardFrontUrl){
      wx.showToast({
        title: '请上传身份证正反面',
        icon:'none'
      })
    }else if(companyinfo.chargePersonName.length == 0){
      wx.showToast({
        title: '请输入负责人姓名',
        icon:'none'
      })
    }else if(companyinfo.chargePersonPhone.length < 11){
      wx.showToast({
        title: '请输入负责人手机号码',
        icon:'none'
      })
    }else{
      console.log(companyinfo)
      // cardInfo.userId = userId;
      let data = {
        id:companyinfo.id,
        companyName:companyinfo.companyName,
        businessLicenseUrl:companyinfo.businessLicenseUrl,
        legalPersonIdcardFrontUrl:companyinfo.legalPersonIdcardFrontUrl,
        legalPersonIdcardBackUrl:companyinfo.legalPersonIdcardBackUrl,
        chargePersonName:companyinfo.chargePersonName,
        chargePersonPhone:companyinfo.chargePersonPhone
      }
      console.log(data)
      https.postJSON('/share/AgentCompany/addOrUpdate',data).then((res)=>{
        console.log(res)
        if(res.data.code==200){
          if(companyinfo.id){
            wx.showToast({
              title: '修改成功',
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
          } 
          }    
      }).catch((err) => {
        console.info(err)
      });
  }
},
// 图片预览
  previewImage:function(e){
    // console.log(e)
    var companyinfo = this.data.companyinfo
    var imgUrl = this.data.imgUrl
    var url1 = imgUrl + companyinfo.businessLicenseUrl
    var url2 = imgUrl + companyinfo.legalPersonIdcardBackUrl
    var url3 = imgUrl + companyinfo.legalPersonIdcardFrontUrl

    var url = e.target.dataset.src;
    wx.previewImage({
      current:url,
      urls: [url1,url2,url3]
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
  onShareAppMessage: function () {

  }
})