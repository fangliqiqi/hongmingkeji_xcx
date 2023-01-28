// pages/agent/appeal/index.js
const app = getApp();
const https = require("../../../utils/https");
var setInter = null;
const util= require("../../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: wx.AppealUrl,
    isShow:false,
    id:'',
    //申诉原因下拉选择
    reasonIndex:0,
    reasonOptions:['同行','电话为空号/不接电话/微信未通过 ','城市地域不符','重复推送'],
    reason:'',
    content:'',
    followTime:'',
    textFilePath:'',
    imgList:[],
    audioList:[],
    imgListshow:[],
    audioListshow:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var reasonOptions = this.data.reasonOptions
    var reasonIndex = this.data.reasonIndex
    this.setData({
      id:options.id,
      reason:reasonOptions[reasonIndex]
    })
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
  // 文件上传
  fileUp(){
    var that  = this;
    var imgList = that.data.imgList
    var audioLiat = that.data.audioList
    // console.log(imgList.length + audioLiat.length)  因为一开始要求上传音频 所以有这个 暂时不改
    wx.chooseImage({
      count: 1,
      success (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths[0]
        let testmsg = tempFilePaths.substring(tempFilePaths.lastIndexOf('.')+1)
        let arr = ['mp3','wav','mp4','jpeg','png','jpg']
      if (arr.indexOf(testmsg) == -1) {
        wx.showToast({
          icon: 'none',
          title: '格式上传错误',
        })
          return false;
        }else if(imgList.length + audioLiat.length>4){
          wx.showToast({
            icon: 'none',
            title: '文件最多上传5个',
          })
           return false
        }else{
          wx.showLoading({
            title: '上传中……',
            complete: function () {
              that.updataFun(tempFilePaths);
            }
          })
        }
        // console.log(tempFilePaths.path)  
      }
    })
  },

  // 上传
  updataFun: function (obj) {
    console.log(obj)
    let that = this;
    wx.uploadFile({
      url: wx.AppUrl + '/share/follow/uploadFile', 
      filePath: obj,
      name: 'file',
      // formData: {
      //   'type': obj.type
      // },
      success(res) {
        console.info(res)
        var data = res.data
        //do something
        data = JSON.parse(data)
        var imgList = that.data.imgList
        var audioList = that.data.audioList
        var imgListshow = that.data.imgListshow
        var audioListshow = that.data.audioListshow
        let msg = data.imgUrl.substring(data.imgUrl.lastIndexOf('.')+1)
        if (msg == 'jpg' || msg == 'png' ) {
          // console.log('上传的是图片')
          imgList.push(data.imgUrl)
          imgListshow.push(obj)
          that.setData({
            imgList:imgList,
            imgListshow:imgListshow
          })  
        // } else if (msg == 'mp3' || msg == 'wav'|| msg == 'mp4' ){
        //   // console.log('上传的是音频')
        //   audioList.push(data.imgUrl)
        //   audioListshow.push(obj)
        //   that.setData({
        //     audioList:audioList,
        //     audioListshow:audioListshow
        //   })
        //   // console.log(that.data.audioList) 
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

  // 删除文件
  clearFiled(e){
    console.log(e)
    var that = this;
    let type =  e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    console.log(index)
    let imgList = that.data.imgList
    let audioList = that.data.audioList
    let imgListshow = that.data.imgListshow
    let audioListshow = that.data.audioListshow
    if(type == 'image'){
       imgList.splice(index,1)
       imgListshow.splice(index,1)
       that.setData({
         imgList:imgList,
         imgListshow:imgListshow
       })
      console.log('删除的是图片')
    }else if(type == 'audio'){
       audioList.splice(index,1)
       audioListshow.splice(index,1)
      console.log('删除的是音频')
      that.setData({
        audioList:audioList,
        audioListshow:audioListshow
      })
    }
  },

  // 选择缘由 下拉展示
  bindPicker(e) {
    this.setData({
      isShow:true
    })
  },
  // 输入缘由
  inputFun(e){
    this.setData({
      content:e.detail.value
    })
  },

// 关闭申述原因
  closeFun: function (e) {
    this.setData({
      isShow: false
    })
  },
  // 选择申述原因
  bindChange(e){
    console.log(e)
    let index = e.detail.value[0]
    // console.log(index)
    this.setData({
      reasonIndex:index
    })
    // console.log(this.data.reasonIndex)
  },

// 确定申诉原因
  suretap:function(e){
    let index = this.data.reasonIndex;
    console.log(index)
    let reasonOptions = this.data.reasonOptions
    this.setData({
      reasonIndex:index,
      reason:reasonOptions[index],
      isShow:false
    })
    // console.log(this.data.reasonIndex)
  },

  // 取消申诉
  cacelAppeal(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 订阅消息
  subscription(){
      var arg = arguments;
      var that = this;
      wx.getSetting({
        withSubscriptions: true, success: function (res) {
          console.log(res)
          if (res.subscriptionsSetting && res.subscriptionsSetting['mainSwitch']) {
            wx.requestSubscribeMessage({
              tmplIds: wx.appealid,
              success(resp) {
                console.info(resp)
                var temp = resp[wx.noticesid[0]];
                  try {
                    wx.setStorageSync('noticeflag', temp);
                  } catch (error) {
                    console.info(error)
                  }
                  // that.noticeCb(e,temp)
                  that.appeal()
              },
              fail(resp) { 
                console.info(resp)
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    setTimeout(()=>{
                      // that.noticeCb(e,'reject')
                      that.appeal()
                    },2000)
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '用户已关闭消息推送',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(()=>{
                  // that.noticeCb(e,'reject')
                  that.appeal()
                },2000)
              }
            })
          }
        }
      })
  },

  // 申诉提交 封装
  appeal(){
    var that = this
    var reasonIndex = that.data.reasonIndex
    var imgList = that.data.imgList
    var audioList = that.data.audioList
    var arr = imgList.concat(audioList)
    var textFilePath = arr.toString()
    var data = {
      customerId:that.data.id,
      reason:that.data.reason,
      content:that.data.content,
      textFilePath:textFilePath,
      followTime:util.formatDate(new Date())
    }
    https.getJSON('/wx/api/customerSource/upCustomer',{
      id:that.data.id
    }).then((res)=>{
      if(res.data.code==200){
        wx.showToast({
          title: '我司已收到您的申诉，将于24h内进行处理',
          icon:'none',
          success: function () {
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }
        })
        // 申述成功添加跟进记录
        https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
          if(res.data.code==200){
            console.log('添加跟进成功')
            var data = res.data.data;
          }
        })
      }else{
        wx.showToast({
          title: '已经过了申述有效期',
          icon:'none',
          success: function () {
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }
        })
      }
    })
  },

  submitAppwal:util.throttle(function(e){
    var that = this;
    var reasonIndex = that.data.reasonIndex
    var imgList = that.data.imgList
    var audioList = that.data.audioList
    var arr = imgList.concat(audioList)
    var textFilePath = arr.toString()
    var data = {
      customerId:that.data.id,
      reason:that.data.reason,
      content:that.data.content,
      textFilePath:textFilePath,
      followTime:util.formatDate(new Date())
    }
    if(that.data.reason.length == 0){
      wx.showToast({
        title: '请选择申诉原因',
        icon:'none'
      })
    }else if(that.data.content.length ==0){
      wx.showToast({
        title: '请输入申诉缘由',
        icon:'none'
      })
    }else if(reasonIndex==0&&textFilePath.length==0){
      wx.showToast({
        title: '请上传申诉文件',
        icon:'none'
      })
    }else{
      that.subscription()
    }
  },2000),
  

  // 提交申诉
  submitAppwal(){
    var that = this;
    var reasonIndex = that.data.reasonIndex
    var imgList = that.data.imgList
    var audioList = that.data.audioList
    var arr = imgList.concat(audioList)
    var textFilePath = arr.toString()
    var data = {
      customerId:that.data.id,
      reason:that.data.reason,
      content:that.data.content,
      textFilePath:textFilePath,
      followTime:util.formatDate(new Date())
    }
    if(that.data.reason.length == 0){
      wx.showToast({
        title: '请选择申诉原因',
        icon:'none'
      })
    }else if(that.data.content.length ==0){
      wx.showToast({
        title: '请输入申诉缘由',
        icon:'none'
      })
    }else if(reasonIndex==0&&textFilePath.length==0){
      wx.showToast({
        title: '请上传申诉文件',
        icon:'none'
      })
    }else{
      that.subscription()
      // https.getJSON('/wx/api/customerSource/upCustomer',{
      //   id:that.data.id
      // }).then((res)=>{
      //   if(res.data.code==200){
      //   that.subscription()
      //     wx.showToast({
      //       title: '我司已收到您的申诉，将于24h内进行处理',
      //       icon:'none'
      //     })
      //     // 申述成功添加跟进记录
      //     https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
      //       if(res.data.code==200){
      //         var data = res.data.data;
      //       }
      //     })
      //   }else{
      //     wx.showToast({
      //       title: '已经过了申述有效期',
      //       icon:'none'
      //     })
      //   }
      //     // that.cacelAppeal();
      //     // that.setData({
      //     //   pageNum: 1,
      //     //   conlist: [],
      //     // })
      //     // that.getPageInfo(function () {
      //     //   that.setData({
      //     //     loading: false
      //     //   })
      //     // })
      //   // console.info(res)
      // }).catch((err)=>{ 
      //   // that.closeFun();
    //   })
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

  }
})