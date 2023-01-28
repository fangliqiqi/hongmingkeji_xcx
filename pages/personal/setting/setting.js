const store = require("../../../utils/store");
const https = require("../../../utils/https");
// pages/personal/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.AppUrl,
    isSuccess: false,
    userInfo: {},
    region: ['', '', ''],
    avatar: '',
    showFlag: false,
    pid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.info(options)
    if (options.avatar) {
      this.setData({
        avatar: options.avatar || ''
      })
      this.getUserInfo();
    }
    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (opt) {
    console.info(opt)
    this.getUser()
    console.log(this.data.userInfo)
  },
  getUser: function () {
    var that = this;
    let userInfo = app.globalData.userInfo;
    if (app.globalData.userId == '') {
      wx.hideNavigationBarLoading()
    } else if (userInfo) {
      that.setData({
        userInfo: userInfo,
        region: [userInfo.prov || '', userInfo.city || '', userInfo.county || '']
      })
      wx.hideNavigationBarLoading()
    } else {
      app.userInfoCallBack = res => {
        console.info(res)
        if (res.data && res.data.code == 200) {
          let data = res.data.data || null;
          that.setData({
            userInfo: data,
            region: [data.prov || '', data.city || '', data.county || '']
          })
        }
        wx.hideNavigationBarLoading()
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
  logoutTap: function () {
    this.setData({
      isSuccess: true
    })
  },
  // logoutFun: function () {
  //   var that = this;
  //   wx.clearStorage({
  //     success: function () {
  //       app.globalData.userId = '';
  //       app.globalData.userInfo = null;
  //       that.setData({
  //         userInfo: null,
  //         isSuccess: false
  //       })
  //       setTimeout(function () {
  //         wx.navigateBack({
  //           delta: 1
  //         })
  //       }, 500)
  //     }
  //   })
  // },
  logoutFun: function () {
    var that = this;
    https.postJSON('/wx/api/dismissWx').then((res) => {
      if (res.data.code == 200) {
        app.globalData.userId = '';
        wx.uId = '';
        app.globalData.userInfo = null;
        that.setData({
          userInfo: null,
          isSuccess: false
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }
    }).catch((err) => {
      console.info(err)
    });
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
  closeFun: function () {
    this.setData({
      isSuccess: false,
      showFlag: false
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var vl = e.detail.value;
    this.setData({
      region: vl
    })
    this.updateUser(vl)
  },
  takephoto() {
    var userInfo = this.data.userInfo;
    if (userInfo && userInfo.userId) {

      wx.chooseImage({
        count: 1,//选择数量
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const src = res.tempFilePaths[0]
          wx.redirectTo({
            url: `/pages/upload/upload?src=${src}`,
          })
        },
      })
    }
  },
  getUserInfo: function () {
    var that = this;
    var userId = app.globalData.userId;
    app.getUser(userId);
    app.userInfoCallBack = (res) => {
      console.info(res)
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data
        })
      }
    }
  },
  updateUser: function (vl) {
    var that = this;
    var userInfo = that.data.userInfo;
    store.putJSON('/share/user/profile', {
      userId: app.globalData.userId,
      prov: vl[0],
      city: vl[1],
      county: vl[2]
    }, function (res) {
      if (res.data.code == 200) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        that.getUserInfo();
      }
    })
  },
  getPhoneNumber: function (e) {
    console.info(e)
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      https.postJSON('/wx/api/getPhoneNumber', e.detail).then((res) => {
        console.info(res)
        if (res.data.code == 200 && res.data.userId) {
          wx.uId = res.data.userId;
          app.getUser(wx.uId, function (resp) {
            console.info(resp)
            if (resp.data.code == 200) {
              let userInfo = resp.data.data;
              app.globalData.userId = userInfo.userId;
              wx.uId = userInfo.userId;
              app.globalData.userInfo = userInfo;
              that.setData({
                userInfo: userInfo
              })
              wx.showToast({
                title: resp.data.msg,
                icon: 'none'
              })
            }
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch((res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      })
    }
  },
  ptotap: function () {
    this.setData({
      showFlag: true
    })
  },
  bindCodeFun: function (e) {
    // console.log(e)
    let p = e.currentTarget.dataset.pid;
    let pid = this.data.pid;
    let that = this;
    if (!p) {
      https.getJSON('/share/AgentOrder/binding', { pid: pid }).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            success: function () {
              that.setData({
                showFlag: false
              })
              that.getUser()
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '绑定失败',
          icon: 'none'
        })
      })
    }
  }
})