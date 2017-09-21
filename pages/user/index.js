// idnex.js
var app=getApp()
Page({
        data: {
                userInfo: {},
                badgeCount:5,
                scoreCount:10,
                detailsList:[
                    {
                        name:'大转盘',
                        time:'2017.08.12 13:45',
                        score:'5',
                        state:0
                        // 0是加1是减
                    },
                     {
                        name: '大转盘',
                        time: '2017.08.12 13:45',
                        score: '5',
                        state: 1
                        // 0是加1是减
                    },
                     {
                         name: '大转盘',
                         time: '2017.08.12 13:45',
                         score: '5',
                         state: 1
                         // 0是加1是减
                     },
                     {
                         name: '大转盘',
                         time: '2017.08.12 13:45',
                         score: '5',
                         state: 0
                         // 0是加1是减
                     },
                     {
                         name: '大转盘',
                         time: '2017.08.12 13:45',
                         score: '5',
                         state: 0
                         // 0是加1是减
                     }
                ],
                // 正在加载的隐藏
                hideLoadMore:true,
                // 分页和每次加载显示的个数
                PageNum: 1,   // 设置加载的第几次，默认是第一次  
                callbackcount: 5,
                // 全部加载标识
                LoadingComplete: false
        },
  onLoad: function (options) {
          var that=this;
          app.getUserInfo(function (userInfo) {
                  //更新数据
                  that.setData({
                          userInfo: userInfo,
                  })
          })
  },
  onReady: function () {
  
  },
  onShareAppMessage: function () {
  
  },
// 请求返回列表数据
  getDetailsList:function(){
    
    //   wx.request({
    //       url: '',
    //       data:'',
    //       success(res){
    //       }
    //   })

  },
  loadMore:function(){

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
//     //上拉加载更多   
  onReachBottom: function () {
      var that=this
      this.setData({
          hideLoadMore: false
      })
     setTimeout(function(){
       
         var arr = that.data.detailsList;
         console.log(arr)
         arr.push(arr[1])
         that.setData({
             detailsList: arr,
             hideLoadMore: true
         })
     },1500) 
  }
})