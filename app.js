//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
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
                                // 获取用户信息
                                wx.getUserInfo({
                                    success: function (res) {
                                        that.globalData.userInfo = res.userInfo
                                        typeof cb == "function" && cb(that.globalData.userInfo)
                                        var data = {
                                            appid: appid,
                                            secret: secret,
                                            code: code,
                                            encryptedData: encryptedData,
                                            iv: iv,
                                            grant_type: 'authorization_code'
                                        }
                                        console.log(data)
                                        wx.request({
                                            //获取openid接口
                                            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/identify',
                                            data: data,
                                            method: 'GET',
                                            success: function (res) {
                                                console.log(res)
                                                // that.globalData.openid = res.data.openid
                                                // that.globalData.firstLogin = res.data.firstLogin
                                                that.globalData.stepInfoList = res.data.stepInfoList
                                                that.globalData.identification = res.data.identification
                                                wx.setStorageSync(
                                                    'openid', res.data.openid
                                                )
                                                wx.setStorageSync(
                                                    'stepInfoList', res.data.stepInfoList
                                                )
                                                wx.setStorageSync(
                                                    'identification', res.data.identification
                                                )
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                },
            })
        }
    },
    globalData: {
        userInfo: null,
        openid: null,
        stepInfoList: null,
        identification: null
    }
})