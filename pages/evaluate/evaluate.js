// pages/evaluate/evaluate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {},
    evaluInfo: {
      rank: 5,
      comment: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var trade_no = options.trade_no; 
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    this.setData({
      trade_no: trade_no
    })
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/getValueInfo',
      data: {
        openid: openId,
        trade_no: trade_no
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data.data;
        that.setData({
          goodsInfo: data.info
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
  rankChange: function(e) {
    var rank = e.detail.rank;
    var data = this.data.evaluInfo;
    data.rank = rank;
    this.setData({
      evaluInfo: data
    })
  },
  getDetailInput: function(e) {
    var old_data = this.data.evaluInfo;
    old_data.comment = e.detail.value;
    this.setData({
      evaluInfo: old_data
    })
  },
  submit: function(e) {
    var evalueInfo = this.data.evaluInfo;
    evalueInfo.goods_id = this.data.goodsInfo.goods_id;
    var openId = (wx.getStorageSync('openId'));
    evalueInfo.openId = openId;
    evalueInfo.trade_no = this.data.trade_no;
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/subEvaluate',
      data: evalueInfo,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        if (data.code == 1) {
          wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            var url = '../order/order';
            wx.redirectTo({
              url: url
            })
          }, 500);
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    console.log(evalueInfo);
  }
})