Component({
  data: {
    selected: 0,
    "selectedColor": "#212429",
    "color": "#9d9da6",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/resource/image/tabBar-01.png",
        "selectedIconPath": "/resource/image/tabBar-02.png"
      },
      {
        "pagePath": "/pages/share/share",
        "text": "推荐",
        "iconPath": "/resource/image/share.png",
        "selectedIconPath": "/resource/image/share.png",
        "mid":true
      },
      {
        "pagePath": "/pages/personal/personal",
        "text": "我的",
        "iconPath": "/resource/image/tabBar-41.png",
        "selectedIconPath": "/resource/image/tabBar-42.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})