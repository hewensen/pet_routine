//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    notice: '',
    banners: [],
    tips: [],
    height: app.globalData.height + 44,
    userInfo: {},
    checkTip: {},
    showTip: false,
    hasUserInfo: false
  },
  clickMe: function() {},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/api/pet/common/getCommonInfo',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var res = res.data;
        that.setData({
          notice: res.data.info.notice,
          banners: res.data.info.banner_imgs,
          tips: res.data.tips
        })
      }
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showTip: function(e) {
    var index = e.currentTarget.dataset.index;
    var tip = this.data.tips[index];
    var that = this;
    this.setData({
      checkTip: tip,
      showTip: true
    }, () => {
      setTimeout(function() {
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
          delay: 0
        });
        animation.height('calc( 100% - ' + (that.data.height) + 'px )').bottom("0").step();
        that.setData({
          big: animation.export()
        })
      }, 10)
    })

  },
  close_tip: function(e) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    animation.bottom("-100%").step();
    this.setData({
      big: animation.export()
    })
  }
})