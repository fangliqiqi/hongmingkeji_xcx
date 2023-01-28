
const app = getApp();
const https = require("../../../utils/https");

// pages/personal/commission/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentId:'',
    userInfo:null,
    roleIds:[],//多重身份数组
    myroleFlag:false, //是不是等于114 进行判断
    roleFlag:false,//判断在不在109~113之间
    levelList:[],
    level0:{},
    level1:{},
    level2:{},
    level3:{},
    level4:{}
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
    wx.hideHomeButton({
      success:function(){
        console.log("隐藏成功！")
      }
    })
    this.getUserInfo()
    var Id = app.globalData.userId;
    // console.log(Id)
    this.setData({
      agentId:Id
    })
    this.getPageinfo()
  },
  // 判断多重身份角色是否在109 113中间  判断是不是等于114
  decideRoles(arr){
    arr.map(items=>{
      if(items.roleId>=109 && items.roleId <= 113){
        this.setData({
          roleFlag:true
        })
      }else{
        this.setData({
          roleFlag:false
        })
        if(items.roleId==114){
            this.setData({
              myroleFlag:true
            })
        }else{
          this.setData({
            myroleFlag:false
          })
        }
      }
    })
  },
  // 获取用户信息
  getUserInfo: function () {
    var that = this;
    var userId = app.globalData.userId;
    app.getUser(userId);
    app.userInfoCallBack = (res) => {
      // console.info(res)
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data,
          roleIds:res.data.data.roles
        })
        that.decideRoles(that.data.roleIds)
      }
    }
  },

  // 获取页面 佣金详情 信息
  getPageinfo:function(){
    // console.log(this.data.agentId)
    var data={
      agentId:this.data.agentId
    }
    // console.log(data)
    https.getJSON('/share/AgentSubProportionSettings/agent/list',data).then((res) => {  
      if(res.data.code == 200){
        let rows = res.data.rows;
        rows.map(item=>{
          // console.log(item)
          if(item.level == 0){
            this.setData({
              level0:item
            })
          }else if(item.level ==1){
            this.setData({
              level1:item
            })
          }else if(item.level ==2){
            this.setData({
              level2:item
            })
          }else if(item.level ==3){
            this.setData({
              level3:item
            })
          }else{
            this.setData({
              level4:item
            })
          }
        })
        console.log(this.data.level0)
      }  
    })
  },
  // 输入框聚焦事件
  focusFun:function(e){
    // console.log(e)
    var level0 = this.data.level0
    var level1 = this.data.level1
    var level2 = this.data.level2
    var level3 = this.data.level3
    var level4 = this.data.level4
    var value = e.detail.value;
    var vtype = e.target.dataset.vl;
    if(value == 0){
      if( vtype == 'level0'){
        this.setData({
          'level0.agentProportion':''
        })
      }else if(vtype == 'level1'){
        this.setData({
          'level1.agentProportion':''
        })
      }else if(vtype == 'level1sales'){
        this.setData({
          'level1.salesmanProportion':''
        })
      }else if(vtype == 'level2'){
        this.setData({
          'level2.agentProportion':''
        })
      }else if(vtype == 'level2sales'){
        this.setData({
          'level2.salesmanProportion':''
        })
      }else if(vtype == 'level2fx1'){
        this.setData({
          'level2.fx1':''
        })
      }else if(vtype == 'level3'){
        this.setData({
          'level3.agentProportion':''
        })
      }else if(vtype == 'level3sales'){
        this.setData({
          'level3.salesmanProportion':''
        })
      }else if(vtype == 'level3fx1'){
        this.setData({
          'level3.fx1':''
        })
      }else if(vtype == 'level3fx2'){
        this.setData({
          'level3.fx2':''
        })
      }else if(vtype == 'level4'){
        this.setData({
          'level4.agentProportion':''
        })
      }else if(vtype == 'level4sales'){
        this.setData({
          'level4.salesmanProportion':''
        })
      }else if(vtype == 'level4fx1'){
        this.setData({
          'level4.fx1':''
        })
      }else if(vtype == 'level4fx2'){
        this.setData({
          'level4.fx2':''
        })
      }else if(vtype == 'level4fx3'){
        this.setData({
          'level4.fx3':''
        })
      }
    } 
  },
  //失去焦点事件
  blurFun:function(e){
    // console.log(e)
    var level0 = this.data.level0
    var level1 = this.data.level1
    var level2 = this.data.level2
    var level3 = this.data.level3
    var level4 = this.data.level4
    var value = e.detail.value;
    var vtype = e.target.dataset.vl;
    if(!value){
      if( vtype == 'level0'){
        this.setData({
          'level0.agentProportion':0
        })
      }else if(vtype == 'level1'){
        this.setData({
          'level1.agentProportion':0
        })
      }else if(vtype == 'level1sales'){
        this.setData({
          'level1.salesmanProportion':0
        })
      }else if(vtype == 'level2'){
        this.setData({
          'level2.agentProportion':0
        })
      }else if(vtype == 'level2sales'){
        this.setData({
          'level2.salesmanProportion':0
        })
      }else if(vtype == 'level2fx1'){
        this.setData({
          'level2.fx1':0
        })
      }else if(vtype == 'level3'){
        this.setData({
          'level3.agentProportion':0
        })
      }else if(vtype == 'level3sales'){
        this.setData({
          'level3.salesmanProportion':0
        })
      }else if(vtype == 'level3fx1'){
        this.setData({
          'level3.fx1':0
        })
      }else if(vtype == 'level3fx2'){
        this.setData({
          'level3.fx2':0
        })
      }else if(vtype == 'level4'){
        this.setData({
          'level4.agentProportion':0
        })
      }else if(vtype == 'level4sales'){
        this.setData({
          'level4.salesmanProportion':0
        })
      }else if(vtype == 'level4fx1'){
        this.setData({
          'level4.fx1':0
        })
      }else if(vtype == 'level4fx2'){
        this.setData({
          'level4.fx2':0
        })
      }else if(vtype == 'level4fx3'){
        this.setData({
          'level4.fx3':0
        })
      }
    }
  },
  // 输入框事件
  inputFun:function(e){
    // console.log(e)
    var level0 = this.data.level0
    var level1 = this.data.level1
    var level2 = this.data.level2
    var level3 = this.data.level3
    var level4 = this.data.level4
    var value = e.detail.value;
    var vtype = e.target.dataset.vl;
    // console.log(value)
    // console.log(vtype)
    
    if( vtype == 'level0'){
      this.setData({
        'level0.agentProportion':Number(value)
      })
    }else if(vtype == 'level1'){
      this.setData({
        'level1.agentProportion':Number(value)
      })
    }else if(vtype == 'level1sales'){
      this.setData({
        'level1.salesmanProportion':Number(value)
      })
    }else if(vtype == 'level2'){
      this.setData({
        'level2.agentProportion':Number(value)
      })
    }else if(vtype == 'level2sales'){
      this.setData({
        'level2.salesmanProportion':Number(value)
      })
    }else if(vtype == 'level2fx1'){
      this.setData({
        'level2.fx1':Number(value)
      })
    }else if(vtype == 'level3'){
      this.setData({
        'level3.agentProportion':Number(value)
      })
    }else if(vtype == 'level3sales'){
      this.setData({
        'level3.salesmanProportion':Number(value)
      })
    }else if(vtype == 'level3fx1'){
      this.setData({
        'level3.fx1':Number(value)
      })
    }else if(vtype == 'level3fx2'){
      this.setData({
        'level3.fx2':Number(value)
      })
    }else if(vtype == 'level4'){
      this.setData({
        'level4.agentProportion':Number(value)
      })
    }else if(vtype == 'level4sales'){
      this.setData({
        'level4.salesmanProportion':Number(value)
      })
    }else if(vtype == 'level4fx1'){
      this.setData({
        'level4.fx1':Number(value)
      })
    }else if(vtype == 'level4fx2'){
      this.setData({
        'level4.fx2':Number(value)
      })
    }else if(vtype == 'level4fx3'){
      this.setData({
        'level4.fx3':Number(value)
      })
    }
  },
  // 修改佣金提交
  comFun:function(e){
    var that = this;
    var level0 = that.data.level0;
    var level1 = that.data.level1;
    var level2 = that.data.level2;
    var level3 = that.data.level3;
    var level4 = that.data.level4;
    if(level0.costProportion + level0.agentProportion != 100 ){
        wx.showToast({
          title: '第一阶段成本和分成比例不成百',
          icon:'none'
        })   
    }else if(level1.costProportion + level1.agentProportion + level1.salesmanProportion != 100 ){
      wx.showToast({
        title: '第二阶段成本和分成比例不成百',
        icon:'none'
      }) 
    }else if(level2.costProportion + level2.agentProportion + level2.salesmanProportion + level2.fx1 != 100 ){
      wx.showToast({
        title: '第三阶段成本和分成比例不成百',
        icon:'none'
      })
    }else if(level3.costProportion + level3.agentProportion + level3.salesmanProportion + level3.fx1 + level3.fx2 != 100 ){
      wx.showToast({
        title: '第四阶段成本和分成比例不成百',
        icon:'none'
      })
    }else if(level4.costProportion + level4.agentProportion + level4.salesmanProportion + level4.fx1 + level4.fx2+ level4.fx3  != 100 ){
      wx.showToast({
        title: '第五阶段成本和分成比例不成百',
        icon:'none'
      })
    }else if(level4.agentProportion < 3){
      wx.showToast({
        title: '第五阶段中我的分成比例不能低于3',
        icon:'none'
      })
    }else{
      var rows = [level0,level1,level2,level3,level4]
      console.log(rows)
      https.putJSON('/share/AgentSubProportionSettings',rows).then((res)=>{
        // console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
              //  wx.navigateBack({
              //    delta: 0,
              //  })
              wx.reLaunch({
                url: '/pages/personal/personal',
              })
              // wx.switchTab({
              //   url: '/pages/personal/personal'
              // })
              }, 2000) //延迟时间
            }    
          })
        } else {
          wx.showToast({
            title:  '提交失败',
            icon: 'none',
            mask: true,
          })
        }
      }).catch((res)=>{
        wx.showToast({
          title:  '提交失败',
          icon: 'none',
          mask: true,
        })
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
  onShareAppMessage: function () {

  }
})