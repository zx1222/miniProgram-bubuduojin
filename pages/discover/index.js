
Page({
    data: {
        // swiper
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        indicatorColor: '#898888',
        activeIndicatorColor: '#d3d1d1',

        activities:{},
        title: '积分换丸'
    },

    onLoad: function (options) {
        var that = this
        // banner
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/banner',
            method: 'GET',
            success: function (res) {
                that.setData({
                    imgUrls: res.data
                })
            }
        })

        //活动 
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/activity',
            method: 'GET',
            success: function (res) {
                var data=res.data
                for(var i=0;i<data.length;i++){
                    data[i].group_name = that.formatName(data[i].group_name)
                }
                that.setData({
                    activities: data
                })
            }
        })
    },
    formatName: function (data) {
        var newStr = ''
        for (var i = 0; i < data.length; i++) {
            var tmp = data.charAt(i)
            if (i < data.length - 1) {
                newStr += tmp + '/'
            }
            else newStr += tmp
        }
        return newStr
    }
})
