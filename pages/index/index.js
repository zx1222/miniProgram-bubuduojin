//index.js
//获取应用实例
var fun_base64 = require('../../utils/base64.js')
var app = getApp()

Page({
    data: {
        userInfo: {},
        openid: null,
        stepInfoList: null,
        firstLogin: 1,

        logIn: false,
        // 昨日结算积分
        yesterdayScore: null,
        //签到随机获得的积分
        signScore: null,

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
        showHistory: false,
        monthArr: [],
        yearAndmonth: '',
        signArr: [1, 3, 4, 5, 7, 8, 9, 10, 14, 15],
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
        var openid = wx.getStorageSync('openid')
        this.setData({
            openid: openid,
        })
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
            })
            // 给后端传用户信息
            var obj_base64 = new fun_base64.Base64();
            var openid = obj_base64.encode(that.data.openid);
            var data = {
                userInfo: userInfo,
                openid: openid
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
        this.drawLineChart(options.w, options.h, options.id, options.stepList, options.categories, options.steps);
        this.setData({
            logIn: true,
            yesterdayScore: Math.floor(this.data.stepInfoList[29].step / 5000)
        })
    },

    // 绘制最近七天运动数据的折线图
    // 传入的参数  (画布宽度.画布高度,画布ID,运动数据列表(包括时间戳和步数),横坐标数组,步数数组)
    drawLineChart: function (w, h, id, stepList, categories, steps) {
        // 获取绘图上下文 context
        var context = wx.createContext();
        // 设置线宽
        context.setLineWidth(2);


        var opts = {
            width: w,
            height: h,
            categories: categories,
            steps: steps
        }
        // 根据坐标分组计算每个区域的长度
        var eachSpacing = (opts.width - 20) / opts.categories.length;


        // 绘制区域背景色
        context.beginPath();
        var my_gradient = context.createLinearGradient(0, 0, 0, 170);
        my_gradient.addColorStop(0, 'white');
        my_gradient.addColorStop(1, '#f9ebeb');
        context.setFillStyle(my_gradient);
        context.fillRect(10, 0, eachSpacing, 200);
        context.fillRect(10 + eachSpacing * 2, 0, eachSpacing, 200);
        context.fillRect(10 + eachSpacing * 4, 0, eachSpacing, 200);
        context.fillRect(10 + eachSpacing * 6, 0, eachSpacing, 200);
        context.closePath();


        //获取最近7天的最大步数作为绘制canvas的浮动参考 
        var max_step = this.data.stepInfoList[30].step;
        for (var i = 0; i < 7; i++) {
            if (max_step < this.data.stepInfoList[30 - i].step) {
                max_step = this.data.stepInfoList[30 - i].step
            }
        }
        //对当前路径进行描边
        //将绘制折线图的区域设置高度为130 也就是上面留30 下面40
        context.beginPath()
        // 设置描边颜色
        context.setStrokeStyle("#db493a");
        opts.categories.forEach(function (item, index) {
            if (index == 0) {
                context.moveTo(eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23].step / (max_step + 6000)));
            }
            else {
                context.lineTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)));
            }
        });
        context.stroke();
        // 绘制折线投影
        context.beginPath();
        context.setStrokeStyle("#faeded");

        opts.categories.forEach(function (item, index) {
            if (index == 0) {
                context.moveTo(eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23].step / (max_step + 6000)) + 12);
            }
            else {
                context.lineTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)) + 12);
            }
        });
        context.stroke();


        //绘制节点圆点 
        context.beginPath();
        // 设置描边颜色
        // context.setStrokeStyle("#db493a");
        // 设置填充颜色
        context.setStrokeStyle("#db493a");
        context.setFillStyle("#db493a");
        // 绘制节点圆形区域
        opts.categories.forEach(function (item, index) {
            context.moveTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)));
            context.arc(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)), 4, 0, 2 * Math.PI, false);
        });
        context.closePath();
        context.fill();
        context.stroke();

        //绘制节点投影
        context.beginPath();
        context.setStrokeStyle("#fae4e4");
        context.setFillStyle("#fae4e4");
        opts.categories.forEach(function (item, index) {
            context.moveTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)) + 12);
            context.arc(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)) + 12, 3.5, 0, 2 * Math.PI, false);
        });
        context.closePath();
        context.fill();
        context.stroke();



        //  //小程序中没提供获文本宽度的方法 判断各种字符宽度 返回字符串总宽度
        function mesureText(text) {
            var text = text.split('');
            var width = 0;
            text.forEach(function (item) {
                if (/[a-zA-Z]/.test(item)) {
                    width += 14;
                } else if (/[0-9]/.test(item)) {
                    width += 11;
                } else if (/\./.test(item)) {
                    width += 5.4;
                } else if (/-/.test(item)) {
                    width += 6.5;
                } else if (/[\u4e00-\u9fa5]/.test(item)) {
                    width += 20;
                }
            });
            return width;
        }


        // 绘制坐标数据
        var points = [];
        // 起始点x坐标
        var startX = 10;
        // 起始点y坐标
        var startY = opts.height - 30;
        // 终点x坐标
        var endX = opts.width - 10;
        // 终点y坐标
        var endY = opts.height;

        // 计算每个分类的起始点x坐标
        opts.categories.forEach(function (item, index) {
            points.push(startX + index * eachSpacing);
        });
        points.push(endX);

        // 绘制横坐标
        context.beginPath();
        context.setStrokeStyle("#cccccc");
        context.setLineWidth(1);
        context.closePath();
        context.stroke();

        // 折线图日期坐标
        context.beginPath();
        // 设置字体大小
        context.setFontSize(12);
        context.font = "bold";
        // 设置字体填充颜色
        context.setFillStyle('#e43738');
        opts.categories.forEach(function (item, index) {
            var offset = eachSpacing / 2 - mesureText(item) / 2;
            context.fillText(item, points[index] - 5 + offset + 10, startY + 20);
        });
        context.closePath();
        context.stroke();


        // 折线图步数数据
        context.beginPath();
        // 设置字体大小
        context.setFontSize(12);
        context.font = "bold";
        // 设置字体填充颜色
        context.setFillStyle('#e43738');
        opts.steps.forEach(function (item, index) {
            item = item.toString()

            var offset = eachSpacing / 2 - mesureText(item) / 2;
            context.fillText(item, points[index] - 3 + offset + 10, 30);
        });
        context.closePath();
        context.stroke();


        //绘制1W步标准的蚂蚁线
        //没个单独的蚂蚁线长10 一共的数量用宽度/10向上取整 中间位置不绘制
        for (var i = 0; i < Math.ceil(opts.width / 10); i++) {
            if (i % 2 == 0 && i != Math.ceil(opts.width / 10) / 2 && i != Math.ceil(opts.width / 10) / 2 + 1 && i != Math.ceil(opts.width / 10) / 2 - 1) {
                context.setStrokeStyle("#f6a9ae");
                context.moveTo(10 * i, opts.height - 40 - 130 * (10000 / (max_step + 6000)) - 5);
                context.lineTo(10 * (i + 1), opts.height - 40 - 130 * (10000 / (max_step + 6000)) - 5);
            }
        }

        context.setFontSize(12);
        context.font = "bold";
        context.setFillStyle("#f6a9ae");
        var offset = mesureText('1W') / 2;
        // 10是两边留白
        context.fillText('1W', opts.width / 2 - offset, opts.height - 40 - 130 * (10000 / (max_step + 6000)))
        context.stroke();


        wx.drawCanvas({
            canvasId: id,
            actions: context.getActions()
        });
    },

    // 收下昨日结算
    receiveLogIn: function () {
        this.setData({
            logIn: false,
        })
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/settlement',
            data: this.data.yesterdayScore,
            method: 'GET',
            success: function (res) {
            }
        })
    },

    //带权重的数组取值
    weight_rand: function (arr) {
        //参数arr元素必须含有weight属性，参考如下所示  
        //var arr=[{name:'1',weight:1.5},{name:'2',weight:2.5},{name:'3',weight:3.5}];  
        //var arr=[{name:'1',weight:'15%'},{name:'2',weight:'25%'},{name:'3',weight:'35%'}];  
        //求出最大公约数以计算缩小倍数，perMode为百分比模式  
        var per;
        var maxNum = 0;
        var perMode = false;
        //自定义Math求最小公约数方法  
        Math.gcd = function (a, b) {
            var min = Math.min(a, b);
            var max = Math.max(a, b);
            var result = 1;
            if (a === 0 || b === 0) {
                return max;
            }
            for (var i = min; i >= 1; i--) {
                if (min % i === 0 && max % i === 0) {
                    result = i;
                    break;
                }
            }
            return result;
        };

        //使用clone元素对象拷贝仍然会造成浪费，但是使用权重数组对应关系更省内存  
        var weight_arr = new Array();
        for (i = 0; i < arr.length; i++) {
            if ('undefined' != typeof (arr[i].weight)) {
                if (arr[i].weight.toString().indexOf('%') !== -1) {
                    per = Math.floor(arr[i].weight.toString().replace('%', ''));
                    perMode = true;
                } else {
                    per = Math.floor(arr[i].weight * 100);
                }
            } else {
                per = 0;
            }
            weight_arr[i] = per;
            maxNum = Math.gcd(maxNum, per);
        }
        //数字比模式，3:5:7，其组成[0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]  
        //百分比模式，元素所占百分比为15%，25%，35%  
        var index = new Array();
        var total = 0;
        var len = 0;
        if (perMode) {
            for (var i = 0; i < arr.length; i++) {
                //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度  
                len = weight_arr[i];
                for (var j = 0; j < len; j++) {
                    //超过100%跳出，后面的舍弃  
                    if (total >= 100) {
                        break;
                    }
                    index.push(i);
                    total++;
                }
            }
            //使用最后一个元素补齐100%  
            while (total < 100) {
                index.push(arr.length - 1);
                total++;
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度  
                len = weight_arr[i] / maxNum;
                for (var j = 0; j < len; j++) {
                    index.push(i);
                }
                total += len;
            }
        }
        //随机数值，其值为0-11的整数，数据块根据权重分块  
        var rand = Math.floor(Math.random() * total);
        //console.log(index);  
        return arr[index[rand]];
    },

    // 最近连续打卡天数
    continuous_len: function (arr) {
        var nowLength = 1
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == arr[i - 1] + 1) {
                nowLength++
            }
            else {
                nowLength = 1
            }
        }
        return nowLength
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
    },

    // 点击今日打卡
    signIn: function () {
        var arr = [
            {
                num: 1,
                weight: 20
            }, {
                num: 2,
                weight: 20
            }, {
                num: 3,
                weight: 20
            }, {
                num: 4,
                weight: 20
            }, {
                num: 5,
                weight: 20
            }];
        var obj = this.weight_rand(arr)

        var num = obj.num
        console.log(num)
        this.setData({
            lottery: true,
            signScore: num
        })
    },

    // 点击抽奖
    lotteryRun: function (e) {
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
    },

    /*签到历史  */
    showHistory: function () {
        this.setData({
            showHistory: true
        })
        // 获取当前月份天数
        function mGetDate() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var d = new Date(year, month, 0);
            return d.getDate();
        }
        function mGetMonth() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var yearAndmonth = year + '年' + month + '月'
            return yearAndmonth;
        }
        var monthLength = mGetDate()
        var monthArr = []
        for (var i = 0; i < monthLength; i++) {
            var obj = {
                day: i + 1,
                sign: false,
                last: false
            }
            for (var j = 0; j < this.data.signArr.length; j++) {
                if (i + 1 == this.data.signArr[j] && j == this.data.signArr.length - 1) {
                    var obj = {
                        day: i + 1,
                        sign: true,
                        last: true
                    }
                }
                else if (i + 1 == this.data.signArr[j]) {
                    var obj = {
                        day: i + 1,
                        sign: true,
                        last: false
                    }
                }
            }
            monthArr.push(obj);
        }
        console.log(this.data.monthArr)
        var continuousLen = this.continuous_len(this.data.signArr)
        this.setData({
            monthArr: monthArr,
            yearAndmonth: mGetMonth(),
            continuousLen: continuousLen
        })
    },
})

