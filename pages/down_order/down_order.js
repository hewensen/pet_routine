// pages/down_order/down_order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleType: ['快递￥12.00', '到店自提'],
    checkIndex: 0,
    goodsInfo: {},
    addressList: [],
    height: app.globalData.height+44,
    orderInfo: {},
    userWords: '',
    trade_no: '',
    activeIndex: 0,
    goodsNum: 0,
    showWrapper: false,
    showPayer: false,
    orderDone: false,
    dele_money: 12
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    this.setData({
      goodsNum: options.goodsNum,
      goodsId: options.goodsId
    })
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/downOrderInfo',
      data: {
        openid: openId,
        goodsId: options.goodsId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data.data;
        if (data.address_list.length == 0) {
          wx.showToast({
            title: '请添加收货地址',
            icon: 'none',
            duration: 1500,
            success: function() {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../address/address'
                })
              }, 2000)
            }
          })
        }
        that.setData({
          addressList: data.address_list,
          goodsInfo: data.goodsInfo
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
  bindPickerChange: function(e) {
    this.setData({
      checkIndex: e.detail.value,
      dele_money: e.detail.value == 0 ? 12 : 0
    })
  },
  getWordsInput: function(e) {
    this.setData({
      userWords: e.detail.value
    })
  },
  subOrder: function(e) {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.showLoading({})
    var data = this.data;
    var address = data.addressList;
    if (address.length == 0) {
      return;
    }
    var activeIndex = data.activeIndex;
    var orderInfo = {
      dele_name: address[activeIndex]['name'],
      dele_phone: address[activeIndex]['mobile'],
      dele_region: address[activeIndex]['province'] + address[activeIndex]['city'] + address[activeIndex]['region'],
      dele_detail: address[activeIndex]['detail'],
      goods_name: data.goodsInfo['name'],
      num: data.goodsNum,
      single_price: data.goodsInfo['price'],
      dele_type: parseInt(data.checkIndex) + 1,
      dele_money: data.dele_money,
      goods_img_url: data.goodsInfo['head_img_url'],
      message: data.userWords,
      openId: openId,
      goods_id: data.goodsId,
      all_price: data.dele_money + data.goodsInfo['price'] * data.goodsNum
    }

    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/downOrder',
      data: orderInfo,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        wx.hideLoading();
        if (data.code == 1) {
          that.showPayer();
          that.setData({
            orderDone: true,
            trade_no: data.data.trade_no
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
    if (data.showWrapper) {
      animation2.width("70%").left("15%").opacity(0).step();
      this.setData({
        fadeIn: animation.export(),
        BeBig: animation2.export()
      })
    } else if (data.showPayer) {
      animation2.bottom('-80rpx').step();
      this.setData({
        fadeIn: animation.export(),
        moveUp: animation2.export()
      })
    }


    setTimeout(function() {
      this.setData({
        showWrapper: false,
        showPayer: false
      })
    }.bind(this), 300)
  },
  showPayer: function(e) {
    this.setData({
      showPayer: true
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
    animation.backgroundColor("black").opacity(0.5).step();
    animation2.bottom('0').step();
    this.setData({
      fadeIn: animation.export(),
      moveUp: animation2.export()
    })
  },
  changeAddress: function(e) {
    this.setData({
      showWrapper: true
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
    animation.backgroundColor("black").opacity(0.5).step();
    animation2.width("90%").left("5%").opacity(1).step();
    this.setData({
      fadeIn: animation.export(),
      BeBig: animation2.export()
    })
  },
  choseChange: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    })
    this.hideWrapper();
  },
  payNow: function(e) {
    var trade_no = this.data.trade_no;
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
          setTimeout(()=>{
            var url ='../order/order?';
            wx.redirectTo({
              url: url
            })
          },1500);
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})