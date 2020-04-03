//app.js
App({
  onLaunch: function() {
    if (!this.globalData.userInfo) {
      wx.getUserInfo({
        success: res => {
          this.globalData.userInfo = res.userInfo;
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
    var openId = (wx.getStorageSync('openId'));
    if (!openId) {
      wx.login({
        success: res => {
          if (res.code) {
            var that = this;
            //发起网络请求 
            wx.request({
              url: 'http://api.pet.com/api/pet/user/getOpenId',
              data: {
                code: res.code
              },
              success(res) {
                wx.setStorageSync('openId', res.data.data.openid)
                wx.request({
                  url: 'http://api.pet.com/api/pet/user/addUser',
                  data: {
                    openId: res.data.data.openid,
                    nickName: that.globalData.userInfo.nickName,
                    avatarUrl: that.globalData.userInfo.avatarUrl
                  },
                  success(res) {}
                })
              }
            })

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }

    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    host:'http://api.pet.com'
  }
})