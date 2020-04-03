// pages/my_appoint/my_appoint.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBooks();
  },
  getBooks: function(e) {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/common/getBookList',
      data: {
        openId: openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        that.setData({
          appoList: data.data.list
        })
        wx.hideLoading();
      }
    })
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
  cancelBook: function(e) {
    var openId = (wx.getStorageSync('openId'));
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消预约吗？',
      success: function(sm) {
        if (sm.confirm) {
          wx.request({
            method: 'POST',
            url: app.globalData.host + '/api/pet/common/cancelBook',
            data: {
              openId: openId,
              id: id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              var data = res.data;
              if (data.code == 1) {
                wx.showToast({
                  title: data.msg,
                  icon: 'success',
                  duration: 2000,
                  success: function() {
                    that.getBooks();
                  }
                })
              } else {
                wx.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (sm.cancel) {}
      }
    })
  }
})