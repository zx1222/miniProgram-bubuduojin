//index.js
//获取应用实例
var fun_base64 = require('../../utils/base64.js');
var commonObj = require('../../ app/js/common.js');
var lineChart = require('../../ app/js/lineChart.js');
var app = getApp()

Page({
    data: {
        identification: wx.getStorageSync('identification'),
        monthArr: [],
        yearAndmonth: '',
        signArr: [],
        // 连续签到的天数
        continuousLen: 0
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {
        var that = this

        var data = {
            identification: that.data.identification
        }
        var identification = wx.getStorageSync('identification')

        this.setData({
            identification: identification,
        })
    },

    onReady: function () {
        var that=this
        setTimeout(function () {
            that.setData({
                historyShow: true
            })
        }, 300)

        var monthArr = []
        var monthLength = commonObj.mGetDate()
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/sign-history',
            data: { identification: this.data.identification },
            method: 'GET',
            success: function (res) {
                if (res.data.sign_date != "" && res.data.sign_day != "") {
                    that.setData({
                        signArr: res.data.sign_date,
                        continuousLen: res.data.sign_day
                    })
                }
                else if (res.data.sign_date == "" && res.data.sign_day != "") {
                    that.setData({
                        signArr: [],
                        continuousLen: res.data.sign_day
                    })
                }
                else if (res.data.sign_date == "" && res.data.sign_day == "") {
                    that.setData({
                        signArr: [],
                        continuousLen: 0
                    })
                }
                // 创建签到的数组
                if (res.data.sign_date != "") {
                    for (var i = 0; i < monthLength; i++) {
                        var obj = {
                            day: i + 1,
                            sign: false,
                            last: false
                        }
                        for (var j = 0; j < that.data.signArr.length; j++) {
                            // 判断是最后签到的一天 因为是倒叙所以是0 
                            if (i + 1 == parseInt(that.data.signArr[j]) && j == 0) {
                                var obj = {
                                    day: i + 1,
                                    sign: true,
                                    last: true
                                }
                            }
                            else if (i + 1 == parseInt(that.data.signArr[j])) {
                                var obj = {
                                    day: i + 1,
                                    sign: true,
                                    last: false
                                }
                            }
                        }
                        monthArr.push(obj);
                    }
                }
                else {
                    for (var i = 0; i < monthLength; i++) {
                        var obj = {
                            day: i + 1,
                            sign: false,
                            last: false
                        }
                        monthArr.push(obj);
                    }
                }

                that.setData({
                    monthArr: monthArr,
                    yearAndmonth: commonObj.mGetMonth(),
                })
                console.log(that.data.monthArr)
            }
        })
    },
})

