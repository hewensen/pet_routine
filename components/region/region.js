// components/region/region.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    needtitle:{
     type:Boolean,
     value:false
    },
    text: {
      type: String,
      value: "宠物用品专区"
    },
    color: {
      type: String,
      value: "red"
    },
    text_eng: {
      type: String,
      value: "PETUSER AREA"
    },
    iconUrl: {
      type: String,
      value: "/images/use.png"
    },
    goodsList: {
      type: Array,
      value: [{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }, {
        id: 4
      }, {
        id: 5
      }, {
        id: 6
      }]
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

  }
})