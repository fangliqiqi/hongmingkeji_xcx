//app.js
wx.AppUrl = 'https://www.gongxiangkuaiji.cn';
// wx.AppUrl = 'http://localhost:8080';
// wx.AppUrl = 'http://192.168.1.249:8080';
wx.AppUrl = 'http://192.168.1.143:8080';
// wx.AppUrl = 'http://192.168.1.175:8080';
// wx.AppUrl = 'http://192.168.1.120:8091';
// wx.AppUrl = 'http://127.0.0.1:8080';
// wx.CdnUrl = 'http://192.168.1.236:8080';
wx.CdnUrl = wx.AppUrl+'/prod-api';
wx.AppealUrl = wx.AppUrl + '/profile'; //申诉图片的地址
wx.cardUrl = wx.AppUrl; //卡券图片地址 线上
// wx.cardUrl = "http://192.168.1.252"; //卡券图片地址 线下
wx.openId = '';
wx.uId = '';//当前用户id 
wx.callPhone = '';//客服电话
wx.merchantsPhone = '';//招商电话
wx.serlist = ['', '会计上门', '财务外包', '税务筹划', '注册注销', '记账报税', '工商变更'];
wx.noticesid = ['A6Sr0YTD2Tfytqcqf9h1Tbxb65QPu8D5Ef4gdg2oH2U'];// 活动消息id
wx.appealid = ['lL369wdSd_i7hy85dBWaVVK561P4iZ9pFmnGLeVwC9M'];// 申诉审核结果订阅消息id
const store = require("./utils/store");
App({
  onLaunch: function (opt) {
    console.info("options....")
    console.info(opt)
    //p 海报id
    //r 推荐人id
    console.info("options....")
    if (opt.query&&opt.query.scene) {
      const scene = decodeURIComponent(opt.query.scene);
      console.info("scene....")
      console.info(scene)
      console.info("scene....")
      var sceneArr = scene.split('&');
      if (sceneArr.length > 0) {
        sceneArr.forEach(e => {
          var key = e.split("=")[0], val = e.split("=")[1];
          if(key=='r'){
            wx.setStorageSync('recommendId', val)
          }
          if(key=='p'){
            wx.setStorageSync('posterId', val)
          }
          if(key=='t'){
            wx.setStorageSync('posterType', val)
          }
          if(key=='c'){
            wx.setStorageSync('orderId', val)
          }
        })
      }
    }else if (opt.query.recommendId) {
      wx.setStorage({
        data: opt.query.recommendId,
        key: 'recommendId',
      })
    }else if (opt.query.rid) {
      wx.setStorage({
        data: opt.query.rid,
        key: 'recommendId',
      })
    }



    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })


    var that = this;


    // 登录
    console.info("onLaunch")
    store.loginFun({
      success: function (res) {
        console.info(res)
        if (res.data.code == 200) {
          that.globalData.userId = res.data.userId||'';
          if(res.data.userId){
            that.getUser(res.data.userId,function(res){
              console.log(res)
              let data = res.data.data || "";
              if (data) {
                that.globalData.userInfo = data;
                wx.uId = data.userId || '';
                that.globalData.userId = data.userId;
              } else {
                that.globalData.userId = "";
                wx.uId = '';
                that.globalData.userInfo = null;
              }
              if (that.userInfoCallBack) {
                that.userInfoCallBack(res)
              }
              let userId = data.userId
              let roles = data.roles
              console.log(roles)
              that.getAgentist(userId,roles)
            })
          }else if (that.userInfoCallBack) {
            that.userInfoCallBack(res)
          }
          // wx.getStorage({
          //   key: 'userId',
          //   success: function (ress) {
          //     that.getUser(ress.data)
          //     that.globalData.userId = ress.data || '';
          //     wx.uId = ress.data || '';
          //   }, fail: function (ress) {
          //     that.globalData.userId = "";
          //     wx.uId = '';
          //     if (that.userInfoCallBack) {
          //       that.userInfoCallBack(ress)
          //     }
          //   }
          // })
        } else {
          that.globalData.userId = "";
          if (that.userInfoCallBack) {
            that.userInfoCallBack(res)
          }
        }

      }, fail: function (res) {
        console.log("fail:function")
        that.globalData.userId = "";
        if (that.userInfoCallBack) {
          that.userInfoCallBack()
        }
      }
    })
  },
  onShow: function (res) {
    console.info(res)
  },
  globalData: {
    userId: null,
    userInfo: null
  },
  userInfoCallBack: function () {
  },
  getUser: function (userId, cb) {
    var that = this;
    store.getJSON("/share/user/" + userId, {}, function (res) {
      if (typeof cb == "function") {
        cb(res)
      }else if (res.data.code == 200) {
        let data = res.data.data || "";
        if (data) {
          that.globalData.userInfo = data;
          wx.uId = data.userId || '';
          that.globalData.userId = data.userId;
        } else {
          that.globalData.userId = "";
          wx.uId = '';
          that.globalData.userInfo = null;
        }
        if (that.userInfoCallBack) {
          that.userInfoCallBack(res)
        }
      }
    });
  },

   //获取佣金规则信息
   getAgentist(user,roles){
    console.log(roles)
    let roleFlag = false;
    roles.map(items=>{
      if(items.roleId>=109 && items.roleId <= 113){
        roleFlag=true
      }else{
        roleFlag=false
      }
    })
    console.log(roleFlag)
  //  let roleId = role;
   var data={
     agentId:user
   }
   if(roleFlag){
     store.getJSON("/share/AgentSubProportionSettings/agent/list",data, function (res) {
       console.log(res)
      let rows = res.data.rows;
      rows.map(item=>{
        if(item.level ==0){
          // console.log(parseInt(item.agentProportion) + parseInt(item.costProportion))
          if(item.agentProportion + item.costProportion !=100){
            wx.showModal({
              title: '温馨提示',
              content: '您还没有设置佣金规则，请去佣金规则页面进行设置',
              showCancel:false,
              confirmText:'好的',
              success (res) {
                if (res.confirm){
                  wx.reLaunch({
                    url: '/pages/personal/commission/index',
                  })
                } 
              }
            })
          }
        }
      })
    })
   }
  },
   
  noticefun: function (func, flag) {
    var that = this;
    var noticeflag = wx.getStorageSync('noticeflag');
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
              if (typeof func == "function") {
                func(temp)
              }
            },
            fail(resp) { 
              console.info(resp)
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000,
                success: function () {
                  if (typeof func == "function") {
                    func('reject')
                  }
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
              if (typeof func == "function") {
                func('reject')
              }
            }
          })
        }
      }
    })
  },
  // msgFun:function(msgList,cb){
  //   var that = this;
  //   var idx = 0;
  //   var anim = wx.createAnimation({duration:1000});
  //   var leng = msgList.length;
  //   setInterval(()=>{
  //     if(idx%2==1){
  //       anim.opacity(0).step();
  //     }else{
  //       anim.opacity(1).step();
  //     }
  //     let index = Math.floor(idx>=leng*2?idx=0:idx++/2);
  //     console.info(index)
  //     if(typeof cb == 'function'){
  //       cb({
  //         msgobj:msgList[index],
  //         animation:anim.export()
  //       })
  //     }
  //   },2000)
  // },
  msgFun:function(msgList,cb){
    var that = this;
    var idx = 0;
    var anim = wx.createAnimation({duration:1000});
    var leng = msgList.length;
    var timer = setInterval(()=>{
      if(idx%2==1){
        anim.opacity(0).translateY('40rpx').step().translateY('0px').step();
      }else{
        anim.opacity(1).translateY('20rpx').step();
      }
      let index = Math.floor(idx>=leng*2?idx=0:idx++/2);
      // console.info(index)
      if(typeof cb == 'function'){
        cb({
          msgobj:msgList[index],
          animation:anim.export(),
          timer:timer
        })
      }
    },2000)
  },
})