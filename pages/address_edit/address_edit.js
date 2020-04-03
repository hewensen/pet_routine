// pages/address_edit/address_edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    type: 'add',
    id: 0,
    barText: '',
    addressInfo: {
      name: '',
      mobile: '',
      region: [],
      detail: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type; 
    this.setData({
      type: type
    });

    this.setData({
      barText: type == 'add' ? '新增地址' : '编辑地址'
    })

    if (type == 'edit') {
      var id = options.id;
      this.setData({
        id: id
      });
      var that = this;
      wx.request({
        method: 'POST',
        url: app.globalData.host +'/api/pet/user/getAddressInfo',
        data: {
          id: id,
          openid: wx.getStorageSync('openId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res) {
          var data = res.data.data.info;
          var addressInfo = {
            name: data.name,
            mobile: data.mobile,
            region: [data.province, data.city, data.region],
            detail: data.detail
          }
          that.setData({
            addressInfo: addressInfo
          })
        }
      })
    }
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
  bindRegionChange: function(e) {
    var old_data = this.data.addressInfo;
    old_data.region = e.detail.value;
    this.setData({
      addressInfo: old_data
    })
  },
  getNameInput: function(e) {
    var old_data = this.data.addressInfo;
    old_data.name = e.detail.value;
    this.setData({
      addressInfo: old_data
    })
  },
  getMobileInput: function(e) {
    var old_data = this.data.addressInfo;
    old_data.mobile = e.detail.value;
    this.setData({
      addressInfo: old_data
    })
  },
  getDetailInput: function(e) {
    var old_data = this.data.addressInfo;
    old_data.detail = e.detail.value;
    this.setData({
      addressInfo: old_data
    })
  },
  deleteItem:function(e){
    var id = this.data.id;
    wx.request({
      method: 'POST',
      url: app.globalData.host +'/api/pet/user/deleteAddress',
      data: {
        id: id,
        openid: wx.getStorageSync('openId')
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
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../address/address'
                })
              }, 1500)
            }
          })

        }
      }
    })
  },
  setDefault: function (e) {
    var id = this.data.id;
    wx.request({
      method: 'POST',
      url: app.globalData.host +'/api/pet/user/defaultAddress',
      data: {
        id: id,
        openid: wx.getStorageSync('openId')
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
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../address/address'
                })
              }, 1500)
            }
          })

        }
      }
    })
  },
  addItem: function(e) {
    var openId = (wx.getStorageSync('openId'));
    var address = this.data.addressInfo;
    var type = this.data.type;
    var id = this.data.id;
    if (address.name == '' || address.mobile == '' || address.detail == '' || address.region.length == 0) {
      wx.showToast({
        title: '请完整填写地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(address.mobile))){
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      method: 'POST',
      url: app.globalData.host +'/api/pet/user/addAddress',
      data: {
        name: address.name,
        mobile: address.mobile,
        province: address.region[0],
        city: address.region[1],
        region: address.region[2],
        detail: address.detail,
        openid: openId,
        type: type,
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
              setTimeout(function(){
                wx.redirectTo({
                  url: '../address/address'
                })
              },1500)
            }
          })

        } else {
          wx.showToast({
            title: data.msg,
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  }
})