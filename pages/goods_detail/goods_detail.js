// pages/goods_detail/goods_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHider: false,
    type: '',
    goodsNum: 0,
    goodsId: 8,
    goodsInfo: {},
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var that = this;
    wx.request({
      url: app.globalData.host + '/api/pet/goods/getGoodsDetail',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var res = res.data;
        var orderList = res.data.order_list;
        orderList.forEach((item) => {
          item.dele_name = item.dele_name.substr(0, 1)
        });
        that.setData({
          goodsInfo: res.data.goods_info,
          orderList: orderList
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
  showHider: function(event) {
    var type = event.target.dataset.type;
    this.setData({
      showHider: true,
      type: type
    })
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
    animation.backgroundColor("black").opacity(0.7).step();
    animation2.bottom("0").step();
    this.setData({
      fadeIn: animation.export()
    })
    this.setData({
      moveUp: animation2.export()
    })
  },
  hideHider: function() {
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
    animation2.bottom("-100%").step();
    this.setData({
      fadeIn: animation.export()
    })
    this.setData({
      moveUp: animation2.export()
    })
    setTimeout(function() {
      this.setData({
        showHider: false
      })
    }.bind(this), 300)

  },
  buyNow() {
    var url = '../down_order/down_order?goodsNum=' + this.data.goodsNum + '&goodsId=' + this.data.goodsId;
    wx.navigateTo({
      url: url
    })
  },
  addToCar() {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/user/addToCar',
      data: {
        openid: openId,
        goodsId: that.data.goodsId,
        goodsNum: that.data.goodsNum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var res = res.data;
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
          that.hideHider();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  numChange: function(e) {
    var count = e.detail.count;
    this.setData({
      goodsNum: count
    })
  }
})