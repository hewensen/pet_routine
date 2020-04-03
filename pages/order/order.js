// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    menuList: [{
        index: 0,
        content: '全部',
        type: 0
      },
      {
        index: 1,
        content: '待付款',
        type: 1
      },
      {
        index: 2,
        content: '待发货',
        type: 2
      },
      {
        index: 3,
        content: '待收货',
        type: 3
      },
      {
        index: 4,
        content: '已完成',
        type: 5
      }
    ],
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openId = (wx.getStorageSync('openId'));
    var type = 0;
    var index = 0;
    if (options.type) {
      type = options.type;
      index = options.index;
    }
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/getOrderList',
      data: {
        openId: openId,
        type: type
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        that.setData({
          orderList: data.data.order_list,
          activeIndex: index
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
  gotoDetail: function(e) {
    var status = e.currentTarget.dataset.status;
    var orderid = e.currentTarget.dataset.orderid;
    var url = '';
    switch (status) {
      case 1:
        url = '../order_detail_unpay/order_detail_unpay?id=' + orderid;
        break;
      case 2:
        url = '../order_detail_payed/order_detail_payed?id=' + orderid;
        break;
      case 3:
        url = '../order_detail_dele/order_detail_dele?id=' + orderid;
        break;
      case 4:
        url = '../order_detail_finish/order_detail_finish?id=' + orderid;
        break;
      case 5:
        url = '../order_detail_finish/order_detail_finish?id=' + orderid;
        break;
    }
    wx.navigateTo({
      url: url,
    })
  },
  changeActive(res) {
    var openId = (wx.getStorageSync('openId'));
    var index = res.currentTarget.dataset.index;
    var type = res.currentTarget.dataset.type;
    var that = this;
    this.setData({
      activeIndex: index
    });
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/getOrderList',
      data: {
        openId: openId,
        type: type
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        that.setData({
          orderList: data.data.order_list
        })
        wx.hideLoading();
      }
    })
  },
  cancel: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success: function(sm) {
        if (sm.confirm) {
          var trade_no = e.currentTarget.dataset.trade_no;
          var openId = (wx.getStorageSync('openId'));
          wx.showLoading();
          wx.request({
            method: 'POST',
            url: app.globalData.host + '/api/pet/order/cancelOrder',
            data: {
              openId: openId,
              trade_no: trade_no
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              wx.hideLoading();
              var data = res.data;
              if (data.code == 1) {
                wx.showToast({
                  title: data.msg,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function() {
                  that.getOrderInfo();
                }, 1500)

              } else {
                wx.showToast({
                  title: data.msg,
                  icon: 'noen',
                  duration: 2000
                })
              }
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },
  getOrderInfo: function() {
    var that = this;
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/getOrderList',
      data: {
        openId: openId,
        type: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        that.setData({
          orderList: data.data.order_list,
          activeIndex: 0
        })
      }
    })
  },
  goAsset: function(e) {
    var trade_no = e.currentTarget.dataset.trade_no;
    var url = '../evaluate/evaluate?trade_no=' + trade_no;
    wx.navigateTo({
      url: url,
    })
  },
  acceptGoods: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定已收到商品？',
      success: function(sm) {
        if (sm.confirm) {
          var trade_no = e.currentTarget.dataset.trade_no;
          var openId = (wx.getStorageSync('openId'));
          wx.showLoading();
          wx.request({
            method: 'POST',
            url: app.globalData.host + '/api/pet/order/acceptlOrder',
            data: {
              openId: openId,
              trade_no: trade_no
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              wx.hideLoading();
              var data = res.data;
              if (data.code == 1) {
                wx.showToast({
                  title: data.msg,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function() {
                  that.getOrderInfo();
                }, 1500)

              } else {
                wx.showToast({
                  title: data.msg,
                  icon: 'noen',
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