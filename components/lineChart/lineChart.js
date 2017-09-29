// components/lineChart.js
var app = getApp()
var pageObj=({
  data: {
      stepInfoList: null,
      windowWidth:0
  },

  bindViewTap: function () {
      wx.navigateTo({
          url: '../logs/logs'
      })
  },

  onLoad: function () {
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
      this.drawLineChart(options.w, options.h, options.id, options.stepList, options.categories, options.steps)
  },

  // 绘制最近七天运动数据的折线图
  // 传入的参数  (画布宽度.画布高度,画布ID,运动数据列表(包括时间戳和步数),横坐标数组,步数数组)
  drawLineChart: function (w, h, id, stepList, categories, steps) {
      // 获取绘图上下文 context
      var context = wx.createContext();

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

      context.fill();
      // context.stroke();
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
      // 设置线宽
      context.setLineWidth(2);
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
      context.closePath();
      // 绘制折线投影
      context.beginPath();
      context.setLineWidth(2);
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
      context.closePath();

      //绘制节点圆点 
      context.beginPath();

      // 设置填充颜色

      context.setStrokeStyle("#db493a");
      context.setFillStyle("#db493a");
      // 绘制节点圆形区域
      opts.categories.forEach(function (item, index) {
          context.moveTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)));
          context.arc(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)), 3, 0, 2 * Math.PI, false);
      });
      context.fill();
      context.stroke();
      context.closePath();

      //绘制节点投影
      context.beginPath();
      context.setStrokeStyle("#fae4e4");
      context.setFillStyle("#fae4e4");
      opts.categories.forEach(function (item, index) {
          context.moveTo(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)) + 12);
          context.arc(eachSpacing * index + eachSpacing / 2 + 10, opts.height - 40 - 130 * (stepList[23 + index].step / (max_step + 6000)) + 12, 2.5, 0, 2 * Math.PI, false);
      });
      context.fill();
      context.stroke();
      context.closePath();



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
      points.push(offset);

      // 折线图日期坐标
      context.beginPath();
      // 设置字体大小
      context.setFontSize(12);
      context.font = "bold";
      // 设置字体填充颜色
      context.setFillStyle("#db493a");
      opts.categories.forEach(function (item, index) {
          var offset = eachSpacing / 2 - mesureText(item) / 2;
          context.fillText(item, points[index] - 5 + offset + 10, startY + 20);
      });
      //步数数据 
      opts.steps.forEach(function (item, index) {
          item = item.toString()
          var offset = eachSpacing / 2 - mesureText(item) / 2;
          context.fillText(item, points[index] - 3 + offset + 10, 30);
      });
      context.fill()
      context.stroke();
      context.closePath();


      //绘制1W步标准的蚂蚁线
      //没个单独的蚂蚁线长10 一共的数量用宽度/10向上取整 中间位置不绘制
      context.beginPath();
      for (var i = 0; i < Math.ceil(opts.width / 10); i++) {
          if (i % 2 == 0 && i != Math.ceil(opts.width / 10) / 2 && i != Math.ceil(opts.width / 10) / 2 + 1 && i != Math.ceil(opts.width / 10) / 2 - 1 && i != Math.ceil(opts.width / 10) / 2 - 3) {
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
      context.fill()
      context.stroke();
      context.closePath();


      wx.drawCanvas({
          canvasId: id,
          actions: context.getActions()
      });
  },
})
module.exports={
    pageObj:pageObj
    }