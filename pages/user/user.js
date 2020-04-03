// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authed: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: '15711590630', //此号码并非真实电话号码，仅用于测试
      success: function() {},
      fail: function() {}
    })
  },
  getUserInfo() {
    var that = this;

    //获取用户信息
    wx.getUserInfo({
      success: function(res) {
        that.data.userInfo = res.userInfo;
        that.setData({
          userInfo: that.data.userInfo,
          authed: true
        })
      },
      fail: function(error) {
        that.setData({
          authed: false
        })
      }
    })
  }
})