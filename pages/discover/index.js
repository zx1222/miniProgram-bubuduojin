
Page({
  data: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 1000,
      indicatorColor:'#898888',
      activeIndicatorColor:'#d3d1d1'
  },

  onLoad: function (options) {
      var that= this
      wx.request({
          url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/banner',
          method:'GET',
          success:function(res){
            that.setData({
                imgUrls:res.data
            })
          }
      })
  },
})