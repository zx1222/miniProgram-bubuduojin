#安牛小程序
##
###1.通过一个接口确定用户是否是首次登录
####接口请求地址：http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/user-info
####接口请求方式：get
####接口数据结构格式:json格式
####接口请求参数
####必须参数：
              * @param $data 数组
              *data里边包含用户信息
####接口返回结果举例
````php
{
    code：0
    firstLogin:1/0(1代表不是首次登录0代表首次登录)
}
````
###2.通过一个接口来获取openid和运动数据同时判断用户是否是当日首次进入
####接口请求地址：http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/identify
####接口请求方式：get
####接口数据结构格式:json格式
####接口请求参数
####必须参数：
              * @param $appid 小程序唯一标识
              * @param $secret 小程序的 app secret
              * @param $code 登录时获取的 code
              * @param $grant_type 填写为 authorization_code
              * @param $encryptedData string 加密的用户数据
              * @param $iv string 与用户数据一同返回的初始向量
####接口返回结果举例
````php
//请求成功
{
    code:0
    openid:'oZJcc0WwhZWuLFfeN-ETjLOwvcxI',
    stepInfoList : "{"stepInfoList":[{"timestamp":1503331200,"step":6069},{"timestamp":1503417600,"step":6404},{"timestamp":1503504000,"step":5210},{"timestamp":1503590400,"step":6998},{"timestamp":1503676800,"step":4035},{"timestamp":1503763200,"step":1285},{"timestamp":1503849600,"step":7090},{"timestamp":1503936000,"step":5162},{"timestamp":1504022400,"step":5233},{"timestamp":1504108800,"step":4952},{"timestamp":1504195200,"step":6113},{"timestamp":1504281600,"step":1434},{"timestamp":1504368000,"step":1607},{"timestamp":1504454400,"step":5964},{"timestamp":1504540800,"step":5106},{"timestamp":1504627200,"step":6238},{"timestamp":1504713600,"step":4902},{"timestamp":1504800000,"step":7179},{"timestamp":1504886400,"step":11568},{"timestamp":1504972800,"step":13161},{"timestamp":1505059200,"step":6778},{"timestamp":1505145600,"step":4818},{"timestamp":1505232000,"step":5907},{"timestamp":1505318400,"step":4831},{"timestamp":1505404800,"step":4835},{"timestamp":1505491200,"step":18243},{"timestamp":1505577600,"step":293},{"timestamp":1505664000,"step":5678},{"timestamp":1505750400,"step":4775},{"timestamp":1505836800,"step":3611},{"timestamp":1505923200,"step":2657}],"watermark":{"timestamp":1505985046,"appid":"wx66e4ec7b580c2658"}}",
    identification:"i18CsX21veDq2V5DBVq2VQ==oZJcc0WwhZWuLFfeN-ETjLOwvcxI"
}
//请求失败
{
    "code": 40063,
}
````
####返回结果说明code为0，请求成功，并返回openid，stepInfoList(运动数据),firstSign(是否为首次登录，0-代表每日首次登录，1-代表不是每日首次登录)
###
##3.用户当日首次进入活动，领取积分
####通过接口返回数据
####接口请求地址：http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/sports/default/settlement
####接口请求方式：get
####接口数据结构格式:json格式
####必须参数：
              * @param $user_id 用户的openid(加密)
              * @param $score_value 积分
            
####接口返回结果举例
数据包含所有分组对应的人员，以及分组对应的问诊时间,返回的结果数据如下
````
{
    "code": 1,
    "desc": {
        "user_id": [
            "用户不能为空"
        ],
        "score_value": [
            "积分不能为空"
        ]
    }
}
{
    "code": 0,
    "desc": '添加成功'
}
````
