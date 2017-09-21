// idnex.js
var app=getApp()
Page({
        data: {
                userInfo: {},
                badgeCount:5,
                scoreCount:10,
                dedailsList:[
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
                     },
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
                     },
                ]
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
  
  }
})