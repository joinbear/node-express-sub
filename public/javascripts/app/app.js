;'use strict';
/**
 * autor qiaoni
 * createTime 2015/08/05
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
angular.module("webapp",
    ['ngAnimate','ngTouch','ui.router','oc.lazyLoad',
    'webapp.service','webapp.resource','webapp.controller'])
.config(function($httpProvider) {
    //if we want to ur CORS, we should do as follow:
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //we should change the post and put content-type to ensure the data can be transmitted successfully
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='+ encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
})
//put the interceptor into $httpProvider
.config(function($httpProvider) {
    // $httpProvider.interceptors.push('AuthInterceptor');
})
.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.when("", "ekp/login");
    //首页路由
    $stateProvider.state('ekp',{
        url: "/ekp",
        abstract: true,
        templateUrl: "/templates/index.html",
        controller: 'IndexController'
    })
    //首页入口列表
    .state('ekp.list',{
        url: "/list",
        templateUrl: "/templates/list.html",
        controller: 'ListController'
    })
    //登录页面
    .state('ekp.login',{
        url: "/login",
        templateUrl: "/templates/login/login.html",
        controller: 'LoginController'
    })
    //--------------------交易过户路由开始--------------------------
    //交易过户index页面
    .state('ekp.trade',{
        url: "/trade",
        templateUrl: "/templates/trade/trade_index.html",
        controller: 'TradeIndexController',
        resolve:{
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load files for an existing module
                return $ocLazyLoad.load([
                    '/javascripts/app/trade/trade.min.js'
                ]);
            }]
        }
    })
    //交易过户列表页面
    .state('ekp.trade.list',{
        url: "/list",
        templateUrl: "/templates/trade/trade_list.html",
        controller: 'TradeListController',
        resolve:{
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load files for an existing module
                // return $ocLazyLoad.load([
                //     // '/javascripts/app/trade/trade.min.js'
                // ]);
            }]
        }
    })
    //交易用户信息页面
    .state('ekp.trade.info',{
        url: "/info",
        templateUrl: "/templates/trade/trade_info.html",
        controller: 'TradeInfoController',
        resolve:{
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load files for an existing module
                //return $ocLazyLoad.load('/javascripts/app/trade/trade.min.js');
            }]
        }
    })
    //交易贷款页面
    .state('ekp.trade.loan',{
        url: "/loan",
        templateUrl: "/templates/trade/trade_loan.html",
        controller: 'TradeLoanController',
        resolve:{
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load files for an existing module
                //return $ocLazyLoad.load('/javascripts/app/trade/trade.min.js');
            }]
        }
    })
    //交易进度页面
    .state('ekp.trade.progress',{
        url: "/progress",
        templateUrl: "/templates/trade/trade_progress.html",
        controller: 'TradeProgressController',
        resolve:{
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load files for an existing module
                //return $ocLazyLoad.load('/javascripts/app/trade/trade.min.js');
            }]
        }
    });
    //--------------------交易过户路由结束--------------------------
})
.run(function($rootScope,$state,$stateParams,sessionService){
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        //storage the url information by $rootscope
        $rootScope.returnToState = toState;
        $rootScope.returnToStateParams = toStateParams;
        var token = sessionService.get('auth_token');
        //take care of the $state.go,it will cause drop-head halt.
        if(!token && toState.name != 'ekp.login'){
           event.preventDefault();
           $state.go('ekp.login');
           return false;
        };
    });
    //return to the url where user come from
    $rootScope.return_to_state = function (default_state) {
        var state  = default_state || $rootScope.returnToState || "ekp.trade.info",
            params = $rootScope.returnToStateParams || {};
        //delete the url infomation
        delete $rootScope.returnToState;
        delete $rootScope.returnToStateParams;
        state.name == 'ekp.login' ? $state.go('ekp.trade') : $state.go(state.name, params);
    };
});

