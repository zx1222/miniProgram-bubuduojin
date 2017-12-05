// pages/discover/idnex.js
Page({
    data: {
        questions: [ ]
    },
    onLoad: function (options) {
        var that=this
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/question/question/index',
            method:'GET',
            success:function(res){
                that.setData({
                    questions: res.data
                })
            }
        })
    },

    onReady: function () {

    },
    goQuiz:function(){
        wx.navigateTo({
            url: '../quiz/index',
        })
    }
})