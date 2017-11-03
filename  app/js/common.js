var commonObj = {
    // 获取当前月份天数
    mGetDate: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        return d.getDate();
        console.log('aaaa')
    },

    //带权重的数组取值
    weight_rand: function (arr) {
        //参数arr元素必须含有weight属性，参考如下所示  
        //var arr=[{name:'1',weight:1.5},{name:'2',weight:2.5},{name:'3',weight:3.5}];  
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
        return arr[index[rand]];
    },

    // 获取当前年月
    mGetMonth: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var yearAndmonth = year + '年' + month + '月'
        return yearAndmonth;
    },

    // 格式化日期(月▪日)
    formateDate: function (uData) {
        var myDate = new Date(uData * 1000);
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return month + '·' + day;
    }
}

module.exports = commonObj