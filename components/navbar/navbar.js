const app = getApp();
Component({

  properties: {
    text: {
      type: String,
      value: 'Wechat'
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: app.globalData.height + 'px',
    navigationBarHeight: (app.globalData.height + 44) + 'px'
  },

  methods: {
    backHome: function() {
      wx.reLaunch({
        url: '../index/index',
      })
    },
    back: function() {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})