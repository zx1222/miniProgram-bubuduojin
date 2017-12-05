var app = getApp()

Page({
    data: {
        user_mobile: '',
        question_title: ''
    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    binduser_mobile: function (e) {
        this.setData({
            user_mobile: e.detail.value
        })
    },
    bindquestion_title: function (e) {
        this.setData({
            question_title: e.detail.value
        })
    },
    checkMobile: function () {
        var telCheck = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!telCheck.test(this.data.user_mobile)) {
            wx.showToast({
                title: '请输入正确手机号',
                image: '../../assets/images/icon-warn.png'
            })
            return false
        }
        else return true
    },
    checkQuestion: function () {
        if (this.data.question_title == '') {
            wx.showToast({
                title: '请输入问题',
                image: '../../assets/images/icon-warn.png'
            })
            return false
        }
        else return true
    },
    submit: function () {
        if (this.checkMobile() && this.checkQuestion()) {
            var data = {
                openid: wx.getStorageSync('openid'),
                phone: this.data.user_mobile,
                question: this.data.question_title
            }
            wx.request({
                url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/question/question/create',
                data: data,
                method: 'GET',
                success: function (res) {
                    if (res.data.code == 0) {
                        wx.navigateTo({
                            url: '../questions/index',
                        })
                    }
                }
            })
        }
        else {
        }
    }
})