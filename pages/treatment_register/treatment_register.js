// pages/treatment_register/treatment_register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkIndex: 0,
    checkedIndex: 0,
    checkedList: [],
    dateList: [],
    servList: [],
    activeTime: -1,
    deleType: [],
    boook_time: '请选择预约时间',
    appoInfo: {
      name: '',
      mobile: '',
      type: 0,
      appo_date: '',
      appo_time: '',
      pet_sort:'',
      pet_age:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/common/getTreatAppoTimes',
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        var deletypes = [];
        deletypes.push('请选择预约科室');
        for (var i = 0; i < data.data.serv_list.length; i++) {
          deletypes.push(data.data.serv_list[i].name);
        }
        var defauult = {
          id: 0,
          name: '请选择服务项目',
          price: 0,
          status: 1
        };
        var serv_list = data.data.serv_list;
        serv_list.unshift(defauult);
        that.setData({
          checkedList: data.data.list[0]['times'],
          dateList: data.data.list,
          servList: serv_list,
          deleType: deletypes
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindPickerChange: function (e) {
    var appoInfo = this.data.appoInfo;
    appoInfo.type = this.data.servList[e.detail.value].id;
    this.setData({
      checkIndex: e.detail.value,
      appoInfo: appoInfo
    })
  },
  changeIndex: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      checkedIndex: index,
      activeTime: -1,
      checkedList: this.data.dateList[index]['times']
    })
  },
  getNameInput: function (e) {
    var appoInfo = this.data.appoInfo;
    appoInfo.name = e.detail.value;
    this.setData({
      appoInfo: appoInfo
    })
  },
  getPetSortInput: function (e) {
    var appoInfo = this.data.appoInfo;
    appoInfo.pet_sort = e.detail.value;
    this.setData({
      appoInfo: appoInfo
    })
  },
  getPetAgeInput: function (e) {
    var appoInfo = this.data.appoInfo;
    appoInfo.pet_age = e.detail.value;
    this.setData({
      appoInfo: appoInfo
    })
  },
  getMobileInput: function (e) {
    var appoInfo = this.data.appoInfo;
    appoInfo.mobile = e.detail.value;
    this.setData({
      appoInfo: appoInfo
    })
  },
  appointNow: function (e) { 
    var openId = (wx.getStorageSync('openId')); 
    var info = this.data.appoInfo;
    info.openId = openId;
    if (info.type == 0) {
      wx.showToast({
        title: '请选择预约科室',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (info.appo_date == '' || info.appo_time == '') {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (info.name == '' || info.mobile == '') {
      wx.showToast({
        title: '请填写联系人信息',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (info.pet_sort == '' || info.pet_age == '') {
      wx.showToast({
        title: '请填写宠物信息',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    
    if (!(/^1[3456789]\d{9}$/.test(info.mobile))) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 1500
      })
       return;
    } 
    console.log(info);
    wx.request({
      method: 'POST',
      url: app.globalData.host + '/api/pet/common/appointTreatNow',
      data: info,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) { 
        var data = res.data;
        if (data.code == 1) {
          wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../my_treatment/my_treatment'
                })
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  checkTime: function (e) {
    var enable = e.currentTarget.dataset.enable;
    var data = this.data;
    if (enable) {
      var date = data.dateList[data.checkedIndex].date;
      var text = data.dateList[data.checkedIndex].text;
      var time = e.currentTarget.dataset.time;
      var appoInfo = data.appoInfo;
      appoInfo.appo_date = date;
      appoInfo.appo_time = time;
      this.setData({
        activeTime: e.currentTarget.dataset.index,
        boook_time: text + ' ' + time,
        appoInfo: appoInfo
      })
    }
  }
})