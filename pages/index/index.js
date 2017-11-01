//index.js
//获取应用实例
var fun_base64 = require('../../utils/base64.js');
var commonObj=require('../../ app/js/commo.js');
var lineChart=require('../../ app/js/lineChart.js');
var app = getApp()
// var lineChart = require('../../components/lineChart/index.js');

Page({
    data: {
        identification: null,
        userInfo: {},
        openid: null,
        stepInfoList: null,
        firstLogin: 1,
        chartOption:{},

        // 昨日结算积分  按前一天的步数计算得出
        daily: null,
        // 今日签到标识
        firstSign: wx.getStorageSync('firstSign'),
        //签到随机获得的积分
        signScore: 0,

        lottery: false,
        lotteryRun: false,
        // 已经点击翻牌子抽奖
        lotteryYet: false,
        activeIndex: null,
        windowWidth: wx.getSystemInfoSync().windowWidth,
        cardArr: [
            {
                id: 0,
                url: '../../assets/images/lottery-card.png'
            },
            {
                id: 1,
                url: '../../assets/images/lottery-card.png'
            },
            {
                id: 2,
                url: '../../assets/images/lottery-card.png'
            },
            {
                id: 3,
                url: '../../assets/images/lottery-card.png'
            },
            {
                id: 4,
                url: '../../assets/images/lottery-card.png'
            },
            {
                id: 5,
                url: '../../assets/images/lottery-card.png'
            }
        ],
        // 分享
        invite: false,
        historyShow: false,
        monthArr: [],
        yearAndmonth: '',
        signArr: [],
        // 连续签到的天数
        continuousLen: null
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        var that = this
        
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
                // openid:openid
            })
            // console.log(this.data.openid)
            // 给后端传用户信息
            var obj_base64 = new fun_base64.Base64();
            var openid = obj_base64.encode(that.data.openid);
            var data = {
                userInfo: userInfo,
                openid: openid,
                identification: that.data.identification
            }
            wx.request({
                url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/user-info',
                data: data,
                method: 'GET',
                success: function (res) {
                    if (res.data.code == 0) {
                        that.setData({
                            firstLogin: res.data.firstLogin
                        })
                    }
                }
            })
        })
        var openid = wx.getStorageSync('openid')
        var identification = wx.getStorageSync('identification')
        this.setData({
            openid: openid,
            identification: identification,
        })

        // 格式化日期
        var stepInfoList = JSON.parse(wx.getStorageSync('stepInfoList')).stepInfoList
        function formateDate(uData) {
            var myDate = new Date(uData * 1000);
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            return month + '·' + day;
        }
        for (var i = 0; i < stepInfoList.length; i++) {
            var time = stepInfoList[i].timestamp;
            stepInfoList[i].timestamp = formateDate(new Date(time + 1000))
        }
        this.setData({
            stepInfoList: stepInfoList,
        })

        //获取系统信息  
        wx.getSystemInfo({
            //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
            success: function (res) {
                that.width = res.windowWidth
                that.height = res.windowHeight
            }
        })
    },

    onReady: function () {
        console.log(this.data.stepInfoList)
        var options = {
            w: this.data.windowWidth,
            h: 200,
            id: 'canvas-line',
            stepList: this.data.stepInfoList,
            categories: [
                this.data.stepInfoList[23].timestamp,
                this.data.stepInfoList[24].timestamp,
                this.data.stepInfoList[25].timestamp,
                this.data.stepInfoList[26].timestamp,
                this.data.stepInfoList[27].timestamp,
                this.data.stepInfoList[28].timestamp,
                this.data.stepInfoList[29].timestamp
            ],
            steps: [
                this.data.stepInfoList[23].step,
                this.data.stepInfoList[24].step,
                this.data.stepInfoList[25].step,
                this.data.stepInfoList[26].step,
                this.data.stepInfoList[27].step,
                this.data.stepInfoList[28].step,
                this.data.stepInfoList[29].step
            ]
        }
        this.setData({
            daily: Math.floor(this.data.stepInfoList[29].step / 5000),
            chartOptions:options
        })
        lineChart(this.data.chartOptions.w, this.data.chartOptions.h, this.data.chartOptions.id, this.data.chartOptions.stepList, this.data.chartOptions.categories, this.data.chartOptions.steps);
    },

    // 收下昨日结算
    receiveLogIn: function () {
        this.setData({
            firstLogin: 1,
        })
        lineChart(this.data.chartOptions.w, this.data.chartOptions.h, this.data.chartOptions.id, this.data.chartOptions.stepList, this.data.chartOptions.categories, this.data.chartOptions.steps);

        var data = {
            score: this.data.daily,
            identification: this.data.identification
        }
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/settlement',
            data: data,
            method: 'GET',
            success: function (res) {
            }
        })
    },

    // 签到打卡
    sign: function (e) {
        var arr = [{ name: '1', weight: 2 }, { name: '2', weight: 2 }, { name: '3', weight: 2 }, { name: '4', weight: 2 }, { name: '5', weight: 2 }];
        this.setData({
            lottery: true,
            signScore: commonObj.weight_rand(arr).name
        })
        var data = {
            identification: this.data.identification,
            score: this.data.signScore
        }
        var identification = this.data.identification
        var that = this
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/sign',
            data: data,
            method: 'GET',
            success: function (res) {
                // 0是今天第一次签到 1是已经签到
                that.setData({
                    firstSign: 1
                })
            }
        })
    },

    // 点击抽奖
    lotteryRun: function (e) {
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/lottery',
            method: 'GET',
            success: function (res) {
                // 0是今天第一次签到 1是已经签到
                that.setData({
                    firstSign: 1
                })
            }
        })
        this.setData({
            activeIndex: e.target.dataset.key,
            lotteryRun: true
        })
        var that = this
        setTimeout(function () {
            that.setData({
                lotteryYet: true
            })
        }, 500)
    },

    // 关闭打卡抽奖
    closeLottery: function () {
        this.setData({
            activeIndex: null,
            lottery: false,
        })
        lineChart(this.data.chartOptions.w, this.data.chartOptions.h, this.data.chartOptions.id, this.data.chartOptions.stepList, this.data.chartOptions.categories, this.data.chartOptions.steps);
    },

    // 签到历史
    showHistory: function () {
        var that=this
        // 解决未签到先显示null再渲染的问题
        setTimeout(function(){
            that.setData({
                historyShow: true
            })
        },300)
    
        var monthArr = []
        var monthLength = commonObj.mGetDate()
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/sign-history',
            data: { identification: this.data.identification },
            method: 'GET',
            success: function (res) {
                if (res.data.sign_date != "" && res.data.sign_day != ""){
                    that.setData({
                        signArr: res.data.sign_date,
                        continuousLen: res.data.sign_day
                    })
                }
                else if (res.data.sign_date == "" && res.data.sign_day != ""){
                    that.setData({
                        signArr: [],
                        continuousLen: res.data.sign_day 
                    })
                }
                else if (res.data.sign_date == "" && res.data.sign_day == ""){
                    that.setData({
                        signArr:[],
                        continuousLen: 0
                    })
                }
                // 创建签到的数组
                if (res.data.sign_date!=""){
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
                else{
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

    // 邀请好友
    invite: function () {
        this.setData({
            invite: true
        })
    },

    // 关闭邀请好友遮罩
    closeInvite: function () {
        this.setData({
            invite: false
        })
        lineChart(this.data.chartOptions.w, this.data.chartOptions.h, this.data.chartOptions.id, this.data.chartOptions.stepList, this.data.chartOptions.categories, this.data.chartOptions.steps);
    }
})

