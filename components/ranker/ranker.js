// components/ranker/ranker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeIndex: function(e) {
      var index = e.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      })
      var rank = 0;
      if (index == 0) {
        rank = 1;
      } else if (index == 1) {
        rank = 3;
      } else if (index == 2) {
        rank = 5;
      }
      this.triggerEvent('rankChange', {
        rank: rank
      });
    }
  }
})