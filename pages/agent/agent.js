// pages/agent/agent.js
const app = getApp();
const https = require("../../utils/https");
var setInter = null;
const util= require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distime:259200,
    tabidx: '',
    tabsidx: '',
    years: [],
    days:[],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    searchDate: ['', '',''],
    tempDate: ['', '',''],
    loading: false,
    userInfo: {},
    conlist: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    company_id: '',
    tempindex: '',
    year: '',
    month: '',
    day:'',
    cyear: '',
    cmonth: '',
    userList:[],
    userIndex:'0',
    userTemp:[0],
    isFollow:false,
    fid:'',
    content:'',
    followTime:'',
    conObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var tabidx = options.tabidx || '';
    let company_id = options.cid || '';
    this.setData({
      company_id: company_id || '',
      tabsidx: tabidx
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
    let company_id = this.data.company_id;
    if(setInter){
      clearInterval(setInter);
      setInter=null;
    }
    var that = this;
    that.setData({
      conlist: [],
      pageNum: 1,
      total: 0
    })

    if(company_id){
      this.getYears();
      this.getUserList(company_id);
    }else{
      this.getCompanyInfo()
    }
  },
  getCompanyInfo:function(){
      var that = this;
      let userId = app.globalData.userId;
      if(userId){
        https.postJSON('/wx/api/partner/getData',{
          userId:userId
        }).then((res)=>{
          if(res.data.code==200){
            let com = res.data.data.company||'';
            that.setData({
              conObj:com,
              company_id:com.id
            })
            that.getUserList(com.id);
            that.getYears();
          }
        })
      }else{
        this.getUser();
      }
      
  },
  getYears: function () {
    var that = this;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var d = new Date(year,month+1,0);
    var tempday=d.getDate();
    var years = [],days = [];
    for (let i = 2000; i <= year; i++) {
      years.push(i)
    }
    for (let i = 1; i <= tempday; i++) {
      days.push(i)
    }
    that.setData({
      cyear: year,
      cmonth: month + 1,
      cday:day,
      year: year,
      month: month + 1,
      day:day,
      days:days,
      years: years,
      searchDate: [year - 2000, month,day-1],
        tempDate: [year - 2000, month,day-1]
    })
    this.getPageInfo();
  },

  getUser: function () {
    var that = this;
    let userId = app.globalData.userId;
    if (userId == "") {
      console.info("userId" + userId)
      wx.hideNavigationBarLoading();
      // that.shareFun();
      that.getYears();
    } else if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading();
      that.setData({
        userInfo: app.globalData.userInfo,
        userId: userId
      })
      // that.shareFun();
      // that.getImageFun();
      that.getCompanyInfo();
    } else {
      app.userInfoCallBack = res => {
        console.info('index-app.userInfoCallBack')
        wx.hideNavigationBarLoading();
        if (res && res.data && res.data.code == 200 && res.data.data) {
          that.setData({
            userInfo: res.data.data || null,
            userId: res.data.data.userId || ''
          })
          that.getCompanyInfo();
        }
        // that.shareFun();
        // that.getImageFun();
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.info('onHide')
    if(setInter){
      clearInterval(setInter);
    }
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
    if(setInter){
      clearInterval(setInter);
      setInter=null;
    }
    var that = this;
    that.setData({
      loading: true,
      conlist: [],
      pageNum: 1,
      total: 0
    })
    that.getPageInfo(function () {
      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.bindscrolltolower()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabsfun: function (e) {
    let idx = e.currentTarget.dataset.idx;
    if (idx != this.data.tabsidx) {
      this.setData({
        tabsidx: idx,
        searchDate: [this.data.cyear - 2000, this.data.cmonth-1,this.data.cday-1],
        tempDate: [this.data.cyear - 2000, this.data.cmonth-1,this.data.cday-1],
        year:this.data.cyear,
        month:this.data.cmonth,
        day:this.data.cday,
        conlist: [],
        pageNum: 1,
        tabidx: 0
      })
      this.getPageInfo();
    }
  },
  tabtap: function (e) {
    var idx = e.currentTarget.dataset.idx;
    let tabidx = this.data.tabidx;
    this.setData({
      tabidx: idx==tabidx?0:idx
    })
  },
  tabfun: function (e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      tempindex: idx
    })
  },
  bindChange: function (e) {
    var vl = e.detail.value;
    console.info(e)
    this.setData({
      tempDate: vl
    })
  },
  bindUserChange:function(e){
    var vl = e.detail.value;
    console.info(e)
    this.setData({
      userTemp: vl
    })
  },
  sureFun: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var date = that.data.tempDate;
    var years = that.data.years || [];
    var tabindex = that.data.tempindex;
    var userTemp = that.data.userTemp;
    if (idx == 1) {
      this.setData({
        searchDate: date,
        month: date[1] + 1,
        year: years[date[0]],
        day:date[2]+1
      })
    } else if (idx == 2) {
      this.setData({
        tabindex: tabindex || ''
      })
    } else if (idx == 3) {
      this.setData({
        userIndex: userTemp[0]
      })
    }
    this.setData({
      tabidx: 0,
      pageNum: 1,
      conlist: [],
    })
    this.getPageInfo();
  },
  toPage:function(e){
     var url = e.currentTarget.dataset.url;
    console.info(url)
    wx.navigateTo({
      url: url
    })
  },

  noticeCb:function(e){
    var that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  toPage1: function (e) {
    // 订阅消息
    console.log(e)
    var arg = arguments;
    var that = this;
    wx.getSetting({
      withSubscriptions: true, success: function (res) {
        console.log(res)
        if (res.subscriptionsSetting && res.subscriptionsSetting['mainSwitch']) {
          wx.requestSubscribeMessage({
            tmplIds: wx.noticesid,
            success(resp) {
              console.info(resp)
              var temp = resp[wx.noticesid[0]];
                try {
                  wx.setStorageSync('noticeflag', temp);
                } catch (error) {
                  console.info(error)
                }
                that.noticeCb(e,temp)
            },
            fail(resp) { 
              console.info(resp)
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(()=>{
                    that.noticeCb(e,'reject')
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
                that.noticeCb(e,'reject')
              },2000)
            }
          })
        }
      }
    })
  },
  bindscrolltolower: function () {
    let that = this;
    let total = that.data.total;
    let pageSize = that.data.pageSize;
    let pageNum = that.data.pageNum + 1
    if (!that.data.loading && Math.ceil(total / pageSize) >= pageNum) {
      that.setData({
        loading: true,
        pageNum: pageNum
      })
      this.getPageInfo(function () {
        that.setData({
          loading: false
        })
      })
    }
  },
  getPageInfo(cb) {
    wx.hideNavigationBarLoading()
    var that = this;
    var tab = that.data.tabsidx || '0';
    let state = that.data.tabindex || '';
    let index = that.data.userIndex || 0;
    let userList = that.data.userList||[];
    let userId = '';
    if(userList.length>0&&index>0){
      userId = userList[index].userId
    }
    let data = {
      querType: tab == 10 ? 1 : tab == 20 ? 2 : 0,
      receiveId: that.data.company_id,
      pageSize: that.data.pageSize,
      pageNum: that.data.pageNum,
      userId:userId
    }
    if (tab == 10) {
      data.year = that.data.year || '';
      data.month = that.data.month || '';
      data.type = state == 10 ? 1 : state == 20 ? 2 :state == 30 ? 3 : 0;
    } else if (tab == 20) {
      data.year = that.data.year || '';
      data.month = that.data.month || '';
      data.day = that.data.day || '';
    } else {
      data.year = that.data.cyear || '';
      data.month = that.data.cmonth || '';
    }
    if(setInter){
      clearInterval(setInter);
    }
    https.getJSON('/wx/api/customerSource/getList', data).then((res) => {
      console.info(res)
      if (res.data.code == 200) {
        let data = res.data.data;
        var conlist = that.data.conlist || [];
        var templist = conlist.concat(data.rows || [])||[];
        if(setInter){
          clearInterval(setInter);
        }
        console.info(data)
        that.dateformat(templist);
        that.setData({
          total: data.total || 0,
          data: data.data
        })
      }
      if (typeof cb == 'function') {
        cb(res)
      }
    }).catch(function onRejected(error) {
      console.info(error)
    });
  },

  // 时间格式转换
  dateformat: function (templist) {
    var that = this;
    that.setData({
      conlist:templist.map((x,a)=>{
        x.distime = countdown(util.getTime(x.receiveTime));
        return x ;
      })
    })
    setInter = setInterval(function () {
      that.setData({
        conlist:templist.map((x,a)=>{
          x.distime = countdown(util.getTime(x.receiveTime));
          return x ;
        })
      })
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

  // 上传申诉
  sureAppeal:function(){
    let that = this;
    let  id = this.data.fid;
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
          // 申述成功添加跟进记录
          https.postJSON('/wx/api/customerSource/addCusFollow',data).then((res)=>{
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
  inputFun:function(e){
    console.info(e)
    this.setData({
      content:e.detail.value
    })
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
  //     that.closeFun();
  //   })
  // },

  appeal: function(e) {
    //申诉
    let  idx = e.currentTarget.dataset.idx;
    let  id = e.currentTarget.dataset.id;
    let give = e.currentTarget.dataset.give;
    console.log(idx)
    console.log(give)
    if(give==1){
      wx.showToast({
        title: '赠送商机，无法进行申述哦~',
        icon:'none'
      })
    }else{
      if(idx==1){

        wx.navigateTo({
          url: './appeal/index?id='+ id,
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









  getUserList:function(companyId){
    var that = this;
    https.getJSON('/wx/api/customerSource/getUserList',{companyId:companyId}).then((res)=>{
      console.info(res)
      if(res.data.code==200){
        let conlist = res.data.data||[];
        let temp = {userId:'',nickName:'全部'}
        conlist.unshift(temp)
        that.setData({
          userList:conlist
        })
      }
    }).catch(()=>{
      let conlist =[];
        let temp = {userId:'',nickName:'全部'}
        conlist.unshift(temp)
        that.setData({
          userList:conlist
        })
    })
  },
  closeFun: function (e) {
    this.setData({
      isFollow: false,
      content:'',
      followTime:''
    })
  },
})