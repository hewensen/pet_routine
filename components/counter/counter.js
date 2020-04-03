// components/counter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: {
      type: Number
    },
    cid: {
      type: Number,
      value: 0
    },
    index: {
      type: Number,
      value: -1
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
    countUp() {
      var count = this.data.count + 1;
      var id = this.data.cid;
      var index = this.data.index;
      if (count <= 20) {
        this.setData({
          count: count
        });
        this.triggerEvent('numChange', {
          count: count,
          id: id,
          index: index
        });
      }
    },
    countDown() {
      var count = this.data.count - 1;
      var id = this.data.cid;
      var index = this.data.index;
      if (count >= 1) {
        this.setData({
          count: count
        });
        this.triggerEvent('numChange', {
          count: count,
          id: id,
          index: index
        });
      }

    }
  }
})