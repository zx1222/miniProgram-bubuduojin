// idnex.js
var app = getApp()
Page({
    data: {
        identification: wx.getStorageSync('identification'),
        isScroll: true,

        // 隐藏徽章悬浮窗
        badgeList: [
            {
                categoryName: '步数徽章',
                list: [
                    {
                        name: '始于足下1',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 0
                    },
                    {
                        name: '始于足下2',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 1
                    },
                    {
                        name: '始于足下3',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 2
                    }
                ]
            },
            {
                categoryName: '打卡徽章',
                list: [
                    {
                        name: '始于足下4',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 3
                    },
                    {
                        name: '始于足下5',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 4
                    },
                    {
                        name: '始于足下6',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 5
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 6
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 7
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 8
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 9
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 10
                    },
                    {
                        name: '始于足下',
                        content: '开启第一天计步',
                        url: '../../assets/images/badge.png',
                        desc: '我已达成了开启第一天记步的目标获得了“始于足下”徽章。',
                        id: 11
                    }
                ]
            }
        ],
        // 隐藏徽章详情
        hideBadgeDetail: true,
        currentBadge: {
            name: '',
            content: '',
            url: '',
            id: null
        },
        badgeArr: [],
        badgeIndex: 0,
    },
    onLoad: function (options) {
        var that = this;
        var data = {
            identification: this.data.identification
        }
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/my/score-record',
            data: data,
            success: function (res) {
                that.setData({
                    detailsList: res.data.data,
                    badgeCount: res.data.total.badge,
                    scoreCount: res.data.total.scores
                })
                console.log(res.data)
            }
        })
    },
    onReady: function () {

    },
    onShareAppMessage: function () {

    },
    loadMore: function () {

    },
    // 点击徽章显示详情
    showBadgeDetail: function (e) {
        this.setData({
            hideBadgeDetail: false
        })
        var arr = []
        var badgeArr = []
        for (var i = 0; i < this.data.badgeList.length; i++) {
            for (var j = 0; j < this.data.badgeList[i].list.length; j++) {
                arr.push(this.data.badgeList[i].list[j].id)
                badgeArr.push({
                    name: this.data.badgeList[i].list[j].name,
                    content: this.data.badgeList[i].list[j].content,
                    url: this.data.badgeList[i].list[j].url,
                    desc: this.data.badgeList[i].list[j].desc,
                    id: this.data.badgeList[i].list[j].id
                })
            }
        }
        console.log(badgeArr)
        var index = arr.indexOf(e.target.dataset.key)
        this.setData({
            currentBadge: badgeArr[index],
            badgeArr: badgeArr,
            badgeIndex: index
        })
    },
    slideRight: function () {
        if (this.data.badgeIndex == this.data.badgeArr.length) {
        }
        else {
            this.setData({
                currentBadge: this.data.badgeArr[this.data.badgeIndex + 1],
                badgeIndex: this.data.badgeIndex + 1
            })
        }
    },
    slideLeft: function () {
        if (this.data.badgeIndex == 0) {
        }
        else {
            this.setData({
                currentBadge: this.data.badgeArr[this.data.badgeIndex - 1],
                badgeIndex: this.data.badgeIndex - 1
            })
        }
    },
    closeBadgeDetail: function () {
        this.setData({
            hideBadgeDetail: true
        })
    }
})