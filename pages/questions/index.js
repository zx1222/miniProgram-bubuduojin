// pages/discover/idnex.js
Page({
    data: {
        questions: [
            {
                title: 'aaaaaa',
                content: 'aaa'
            },
            {
                title: 'aaaaaa',
                content: 'aaa'
            },
            {
                title: 'aaaaaa',
                content: 'aaa'
            }
        ]
    },
    onLoad: function (options) {

    },

    onReady: function () {

    },
    goQuiz:function(){
        wx.navigateTo({
            url: '../quiz/index',
        })
    }
})