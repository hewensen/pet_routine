// components/switcher/switcher.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: {
      type: Array,
      value: []
    },
    imgList: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeActive: function(res) {
      var index = res.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      });
    }
  }
})