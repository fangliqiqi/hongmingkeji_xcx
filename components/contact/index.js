// components/contact/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    open:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openFun:function(){
      this.setData({
        open:!this.data.open
      })
    },
    callFun:function(e){
      var idx = e.currentTarget.dataset.idx;
      var phone =idx==1? wx.merchantsPhone:wx.callPhone;
      var that = this;
      console.info(phone);
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone,
          complete: function () {
            that.setData({
              open: false
            })
          }
        })
      }
    },
    bindcontact:function(e){
      console.info(e)
      var that = this;
      that.setData({
        open: false
      })
    }
  }
})
