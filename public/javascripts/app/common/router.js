;
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
//'use strict';
//angular.module("webapp")
//.config(function($stateProvider, $urlRouterProvider,$requireProvider){
//$urlRouterProvider.when("", "ekp/list");
////首页路由
//$stateProvider.state('ekp',{
//    url: "/ekp",
//    abstract: true,
//    templateUrl: "/phone/templates/index.html",
//    controller: 'IndexController',
//    resolve:{
//        deps : $requireProvider.requireJS([
//            '/phone/javascript/controller.min.js',
//            '/phone/javascript/app/services/trade-service.js'
//        ])
//    }
//})
////首页入口列表
//.state('ekp.list',{
//    url: "/list",
//    templateUrl: "/phone/templates/list.html",
//    controller: 'ListController',
//    resolve:{
//        deps : $requireProvider.requireJS([
//            '/phone/javascript/controller.min.js',
//            '/phone/javascript/app/services/trade-service.js'
//        ])
//    }
//})
//////--------------------交易过户路由开始--------------------------
//////交易过户index页面
////.state('ekp.trade',{
////    url: "/index",
////    templateUrl: "/ekpPhone/templates/trade/trade_index.html",
////    controller: 'TradeIndexController'
////})
//////交易用户信息页面
////.state('ekp.trade.info',{
////    url: "/info",
////    templateUrl: "/ekpPhone/templates/trade/trade_info.html",
////    controller: 'TradeInfoController'
////})
//////交易贷款页面
////.state('ekp.trade.loan',{
////    url: "/loan",
////    templateUrl: "/ekpPhone/templates/trade/trade_loan.html",
////    controller: 'TradeLoanController'
////})
//////交易进度页面
////.state('ekp.trade.progress',{
////    url: "/progress",
////    templateUrl: "/ekpPhone/templates/trade/trade_progress.html",
////    controller: 'TradeProgressController'
////})
//////--------------------交易过户路由结束--------------------------
//////登录页面
////.state('ekp.login',{
////    url: "/login",
////    templateUrl: "/ekpPhone/templates/login/login.html",
////    controller: 'LoginController'
////});
//})
//.run(function($rootScope,$state,$stateParams,sessionService){
//        console.log(app);
//    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
//        //storage the url information by $rootscope
//        $rootScope.returnToState = toState;
//        $rootScope.returnToStateParams = toStateParams;
//        var token = sessionService.get('auth_token');
//        //take care of the $state.go,it will cause drop-head halt.
//        //if(!token && toState.name != 'ekp.login'){
//        //    event.preventDefault();
//        //    $state.go('ekp.login');
//        //    return false;
//        //};
//        console.log(toState.name);
//    });
//    //return to the url where user come from
//    $rootScope.return_to_state = function (default_state) {
//        var state  = $rootScope.returnToState || default_state || "ekp.list",
//            params = $rootScope.returnToStateParams || {};
//
//        //delete the url infomation
//        delete $rootScope.returnToState;
//        delete $rootScope.returnToStateParams;
//        state.name == 'ekp.login' ? $state.go('ekp.list') : $state.go(state, params);
//    };
//});
