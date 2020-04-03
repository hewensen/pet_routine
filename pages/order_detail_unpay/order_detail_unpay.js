// pages/order_detail_unpay/order_detail_unpay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    showPayer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openId = (wx.getStorageSync('openId'));
    var id = options.id;
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/getOrderInfo',
      data: {
        openId: openId,
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        that.setData({
          orderInfo: data.data.order_info
        })
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

  hideWrapper: function(e) {
    var data = this.data;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    });
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    });
    animation.backgroundColor("black").opacity(0).step();
    animation2.bottom('-80rpx').step();
    this.setData({
      fadeIn: animation.export(),
      moveUp: animation2.export()
    })

    setTimeout(function() {
      this.setData({
        showPayer: false
      })
    }.bind(this), 300)
  },
  payNow: function(e) {
    var trade_no = this.data.orderInfo.trade_no;
    wx.showLoading({});
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/payOrder',
      data: {
        trade_no: trade_no,
        openId: openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        wx.hideLoading();
        if (data.code == 1) {
          wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            var url = '../order/order?';
            wx.redirectTo({
              url: url
            })
          }, 1500);
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  showPayer: function(e) {
    var that = this;
    this.setData({
      showPayer: true
    }, () => {
      setTimeout(function() {
        var animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
          delay: 0
        });
        var animation2 = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
          delay: 0
        });
        animation.backgroundColor("black").opacity(0.5).step();
        animation2.bottom('0').step();
        that.setData({
          fadeIn: animation.export(),
          moveUp: animation2.export()
        })
      }, 10)

    })

  }
})