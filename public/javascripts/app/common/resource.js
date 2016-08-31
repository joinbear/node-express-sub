;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
'use strict';
//define a service module
angular.module('webapp.resource',['ngResource'])
//合同信息获取
//.factory('Trade', function($resource){
//    // $resource(url, paramDefaults, actions)
//    return $resource("http://10.63.0.86:8888/phone/trade.json",{
//        contractNum : "@contractNum",
//        contractType : "@contractType"
//    },{});
//})
//登录
.factory('Login',function($resource,HttpHost){
    return $resource(HttpHost.host + "/ekp/app/public/action.do?method=loginTest2", {}, {
        check : {
            method : "post"
        }
    });
})
.factory('LoginSecond',function($resource,HttpHost){
    return $resource(HttpHost.host + "/ekp/app/public/action.do?method=loginTest2", {}, {
        check : {
            method : "post"
        }
    });
})
//注销
.factory('LoginOut',function($resource,HttpHost){
    return $resource(HttpHost.host + "/ekp/app/public/action.do?method=loginOut",{},{});
});
