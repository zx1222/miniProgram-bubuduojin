//app.js
var Promise = require('plugins/es6-promise.js');
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.getUserData()
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(that.globalData.userInfo)
        } else {
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    getUserData: function () {
        var that = this;
        var promise = new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    var code = res.code
                    var appid = 'wx66e4ec7b580c2658'
                    var secret = 'd96fa2a84185d0eb2d782a38533fd850'
                    if (res.code) {
                        // 获取微信运动的数据
                        wx.getWeRunData({
                            success(res) {
                                var encryptedData = res.encryptedData
                                var iv = res.iv
                                var data = {
                                    appid: appid,
                                    secret: secret,
                                    code: code,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                    grant_type: 'authorization_code'
                                }
                                wx.request({
                                    //获取用户数据接口
                                    url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/identify',
                                    data: data,
                                    method: 'GET',
                                    success: function (res) {
                                        resolve(res);
                                        console.log(res)
                                        wx.setStorageSync(
                                            'identification', res.data.identification
                                        )
                                        wx.setStorageSync(
                                            'openid', res.data.openid
                                        )
                                        wx.setStorageSync(
                                            'stepInfoList', res.data.stepInfoList
                                        )
                                        wx.setStorageSync(
                                            'firstSign', res.data.firstSign
                                        )
                                    }
                                })
                            }
                        })
                    }
                },
            })
        })
        return promise;
    },
    globalData: {
        userInfo: null,
    }
})