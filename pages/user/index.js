// idnex.js
var app = getApp()
Page({
    data: {
        identification: wx.getStorageSync('identification'),
        isScroll:true,
        userInfo: {},
        // 徽章总数量
        badgeCount: 0,
        // 积分总数量
        scoreCount: 0,
        // 收支明细
        detailsList: [ ],
        // 正在加载的隐藏
        hideLoadMore: true,
        // 分页和每次加载显示的个数
        currentPage: 1,   // 设置加载的第几次，默认是第一次  
        pageCount: 0,
        // 全部加载标识
        LoadingComplete: false,

        // 隐藏徽章悬浮窗
        hideBadge: true,
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
        hideBadgeDetail:true,
        currentBadge:{
            name: '',
            content: '',
            url: '',
            id: null
        },
        badgeArr:[],
        badgeIndex:0,

        hideQuestion:true
    },
    onLoad: function (options) {
        var that = this;
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
            })
        })
        var data={
            identification: this.data.identification,
            currentPage:this.data.currentPage
        }
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/my/score-record',
            data:data,
            success:function(res){
                that.setData({
                    detailsList:res.data.items,
                    badgeCount: res.data.items[0].badge,
                    scoreCount: res.data.items[0].scores,
                    currentPage:res.data._meta.currentPage,
                    pageCount: res.data._meta.pageCount
                })
                console.log(res.data)
            }
        })
    },
    onReady: function () {

    },
    onShareAppMessage: function () {

    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading() //在标题栏中显示加载

        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
    //    上拉加载更多   
    onReachBottom: function () {
        var that = this
        this.setData({
            hideLoadMore: false,
            currentPage:this.data.currentPage+1
        })
        var data={
            identification: this.data.identification,
            currentPage: this.data.currentPage
        }
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/my/score-record',
            data: data,
            success: function (res) {
                if(that.data.currentPage<that.data.pageCount){
                    var arr = that.data.detailsList;
                    arr = arr.concat(res.data.items)
                    that.setData({
                        detailsList: arr,
                        hideLoadMore: true
                    })
                }
                console.log(arr)
            }
        })
        // setTimeout(function () {
        //     var arr = that.data.detailsList;
        //     console.log(arr)
        //     arr.push(arr[1],arr[2])
        //     that.setData({
        //         detailsList: arr,
               
        //     })
        // }, 1500)
    },
    showQuestions:function(){
        wx, wx.navigateTo({
            url: '../questions/index'
        })
    },
    // 全部徽章悬浮窗
    showBadge: function () {
        wx.navigateTo({
            url: '../badge/index',
        })
    },
    // 点击徽章显示详情
    showBadgeDetail:function(e){
        this.setData({
            hideBadgeDetail:false
        })
        var arr =[]
        var badgeArr=[]
        for (var i = 0; i < this.data.badgeList.length;i++){
            for (var j = 0; j < this.data.badgeList[i].list.length;j++){
                arr.push(this.data.badgeList[i].list[j].id)
                badgeArr.push({
                    name: this.data.badgeList[i].list[j].name,
                    content: this.data.badgeList[i].list[j].content,
                    url: this.data.badgeList[i].list[j].url,
                    desc: this.data.badgeList[i].list[j].desc,
                    id: this. data.badgeList[i].list[j].id
                })
            }
        }
        console.log(badgeArr)
        var index = arr.indexOf(e.target.dataset.key)
       this.setData({
           currentBadge: badgeArr[index],
           badgeArr: badgeArr,
           badgeIndex:index
       })
    },
    slideRight:function(){
        if (this.data.badgeIndex == this.data.badgeArr.length){
        }
        else{
            this.setData({
                currentBadge: this.data.badgeArr[this.data.badgeIndex + 1],
                badgeIndex:this.data.badgeIndex+1
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
    closeBadgeDetail:function(){
        this.setData({
            hideBadgeDetail: true
        })
    }
})