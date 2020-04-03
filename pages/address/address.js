// pages/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAddressList();
  },
  getAddressList: function(e) {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/user/getAddress',
      data: {
        openid: openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data.data;
        that.setData({
          list: data.list
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
  getAddress() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              that.addWechatAddress(res);
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {}
            })
          } else {
            wx.chooseAddress({
              success(res) {
                that.addWechatAddress(res);
              }
            })
          }
        }
      }
    })
  },
  addWechatAddress(address) {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host+'/api/pet/user/addAddress',
      data: {
        name: address.userName,
        mobile: address.telNumber,
        province: address.provinceName,
        city: address.cityName,
        region: address.countyName,
        detail: address.detailInfo,
        openid: openId,
        type: 'add',
        id: 0
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
            duration: 1000,
            success: function() {
              that.getAddressList();
            }
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'fail',
            duration: 1000
          })
        }
      }
    })
  }
})