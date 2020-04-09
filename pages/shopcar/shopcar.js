// pages/shopcar/shopcar.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
    goodsList:[],
    toTalPrice: 0,
    allChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
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
    this.getCars();
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
  getCars:function(){
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/user/getShopCar',
      data: {
        openId: openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var list = res.data.data.list;
        var goods_list = res.data.data.goodsList;
        var data = [];
        list.forEach(item => {
          let message = {
            selected: false,
            ...item
          }
          data.push(message);
        })
        that.setData({
          carList: data,
          goodsList: goods_list
        })
      }
    })
  },
  numChange: function(e) {
    var count = e.detail.count;
    var id = e.detail.id;
    var index = e.detail.index;
    var carts = this.data.carList;
    console.log(carts)
    carts[index].goods_count = count;
    this.setData({
      carList: carts
    })
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    this.getTotalPrice();
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/user/updateCar',
      data: {
        openId: openId,
        id: id,
        count: count
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        wx.hideLoading();
      }
    })
  },
  handleTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var carList = this.data.carList;
    carList[index].selected = !carList[index].selected;
    var flag = true;
    for (var i = 0; i < carList.length; i++) {
      if (!carList[i].selected) {
        flag = false;
        break;
      }
    }
    this.setData({
      carList: carList,
      allChecked: flag
    })

    this.getTotalPrice();
  },
  getTotalPrice: function(e) {
    var carts = this.data.carList;
    var price = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        price += carts[i].price * carts[i].goods_count;
      }
    }
    this.setData({
      toTalPrice: price.toFixed(2)
    })
  },
  checkAll: function(e) {
    var flag = this.data.allChecked;
    var carts = this.data.carList;
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = !flag;
    }
    this.setData({
      carList: carts,
      allChecked: !flag
    })
    this.getTotalPrice();
  },
  buyNow: function(e) {
    var carts = this.data.carList;
    var goodsList = [];
    for (var i = 0; i < carts.length; i++) {
      if (carts[i]['selected']) {
        var item = {
          goods_id: carts[i]['goods_id'],
          goods_count: carts[i]['goods_count'],
          car_id: carts[i]['id']
        };
        goodsList.push(item);
      }
    }
    var url = '../down_shopcar_order/down_shopcar_order?goodsList=' + JSON.stringify(goodsList);
    wx.navigateTo({
      url: url
    })
  },
  touchStart:function(e){
    var index =e.currentTarget.dataset.index;
    var carList = this.data.carList;
    carList[index].startPoint = [e.touches[0].pageX,e.touches[0].pageY];
    carList[index].showDelete=false;
    this.setData({
      carList: carList
    })
  },
  touchMove:function(e){
    var index = e.currentTarget.dataset.index;  
    var carList = this.data.carList;
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    var startpoint = carList[index].startPoint;
    if (curPoint[0] < startpoint[0]){
      carList[index].showDelete = true;
    } 
    this.setData({
      carList:carList
    })
  },
  deleteCar:function(e){
    var id = e.currentTarget.dataset.id;
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    wx.showLoading();
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/user/deleteCar',
      data: {
        openid: openId,
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        wx.hideLoading();
        var data = res.data;
        if (data.code == 1) {
         
          setTimeout(function () {
            that.getCars();
          }, 500)

        } else {
          wx.showToast({
            title: data.msg,
            icon: 'noen',
            duration: 2000
          })
        }
      }
    })
  }
})