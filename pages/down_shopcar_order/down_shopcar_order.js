// pages/down_order/down_order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleType: ['快递￥12.00', '到店自提'],
    checkIndex: 0,
    sumAll: 0,
    addressList: [],
    orderListInfo: [],
    activeIndex: 0,
    height: app.globalData.height + 44,
    showWrapper: false,
    showPayer: false,
    orderDone: false,
    trade_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var goodsList = options.goodsList;
    var list = JSON.parse(goodsList);
    var idList = []; 
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    for (var i = 0; i < list.length; i++) {
      idList.push(list[i].goods_id);
    }
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/downOrderInfo_car',
      data: {
        openid: openId,
        goodsId: JSON.stringify(idList)
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

        var goods_list = data.goods_list;
        var orderList = [];
        for (var i = 0; i < goods_list.length; i++) {
          var orderItem = {
            goods_id: goods_list[i].id,
            car_id: list[i].car_id,
            goods_count: list[i].goods_count,
            deleType: 1,
            dele_money: 12,
            userWords: '',
            head_img_url: goods_list[i].head_img_url,
            name: goods_list[i].name,
            price: goods_list[i].price,
          }
          orderList.push(orderItem);
        } 

        that.setData({
          addressList: data.address_list,
          orderListInfo: orderList
        })
        that.getAllPrice();
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
    var index = e.currentTarget.dataset.index;
    var list = this.data.orderListInfo;
    list[index].dele_money = e.detail.value == 0 ? 12 : 0;
    list[index].deleType = e.detail.value == 0 ? 1 : 2;
    this.setData({
      orderListInfo: list
    })
    this.getAllPrice();
  },
  getWordsInput: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.orderListInfo;
    list[index].userWords = e.detail.value;
    this.setData({
      orderListInfo: list
    })
  },
  subOrder: function(e) {
    var that =this;
    var openId = (wx.getStorageSync('openId'));
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
      goodsList:JSON.stringify(data.orderListInfo),
      openId: openId
    }

    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/downOrderCar',
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
            trade_list: data.data.trade_list
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
      animation2.bottom('-100rpx').step();
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
  showPayer: function (e) {
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
  choseChange: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    })
    this.hideWrapper();
  },
  getAllPrice: function(e) {
    var list = this.data.orderListInfo;
    var price = 0;
    for (var i = 0; i < list.length; i++) {
      price += list[i].price * list[i].goods_count + list[i].dele_money;
    }
    this.setData({
      sumAll: price
    })
  },
  payNow: function (e) {
    var trade_list = this.data.trade_list;
    wx.showLoading({});
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/order/payCarOrder',
      data: {
        trade_list: JSON.stringify(trade_list),
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
  }
})