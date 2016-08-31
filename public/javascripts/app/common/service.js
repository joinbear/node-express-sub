;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */

//define a service module
angular.module('webapp.service',[])
.factory('HttpHost',function () {
    return {
        host : '/api/ekp/transfer'
    };
})
.factory('MsgTransmitService', function(){
    return {
        init :function($scope,emitName,broadcastName){
            $scope.$on(emitName, function (event, msg) {
                //console.log("parent", msg);
                $scope.$broadcast(broadcastName, msg);
            });
        },
        send : function($scope,emitName,msg){
            //console.log('send',msg);
            //console.log(msg);
            $scope.$emit(emitName, msg);
        },
        receive : function($scope,broadcastName,callback){
            $scope.$on(broadcastName, function (event, msg) {
                //console.log('recieve',msg);
                callback(event, msg);
            });
        },
        initHeader : function($scope){
            this.init($scope,"TopCtrChange","TopCtrChangeFromParrent");
        },
        sendHeader : function($scope,msg){
            //console.log('header',msg);
            this.send($scope,"TopCtrChange", msg);
        }
    };
})
.factory('CookieService', function(){
	return {
		/**
		 * 设置cookie
		 * @param {string} name key 必须
		 * @param {string} value value 必须
		 * @param {string/number} msec 有效期(毫秒)，或者'session' 必须
		 * @param {string} domain 作用域。可选
		 */
		set:function(name,value,msec,domain,path){
			var msec = msec || 8*60*60*1000;
			var path = path ||'/';
			var domain = domain ? ";domain="+domain:"";
			var exp=new Date();
			exp.setTime(exp.getTime()+msec);
			document.cookie=name+"="+encodeURIComponent(value)+(msec == "section" ? "" : ";expires="+exp.toGMTString()) +domain+";path="+path;
		},
		/**
		 * 获取cookie
		 * @param {string} name key 必须
		 * @return {string} cookie值
		 */
		get:function(name){
	 	  	var viewCookie;
	 	  	if(document.cookie && document.cookie!=''){
	 	  		var cookies = document.cookie.split(";");
	 	  		var cookieLen = cookies.length;
	 	  		for(var i = 0; i < cookieLen; i++){
	 	  			var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g,"");
	 	  			if(cookie.substring(0,name.length + 1) == name+"="){
	 	  				viewCookie = decodeURIComponent(cookie.substring(name.length + 1));
	 	  				break;
	 	  			}
	 	  		}
	 	  	}
	 	  	return viewCookie;
		}
	};
})
.factory('animateService',function($state,$timeout){
    return {
        swipeLeft  : 'swipe-left',
        swipeRight : 'swipe-right',
        swipeUp : 'swipe-up',
        goPage :function(url) {
            $timeout(function(){
                $state.go(url);
            },50);
        }
    }
})
.factory('LocalService', function(){
	return {
        get: function(key) {
            return localStorage.getItem(key);
        },
        set: function(key, val) {
            return localStorage.setItem(key, val);
        },
        unset: function(key) {
            return localStorage.removeItem(key);
        }
    };
})
.factory('sessionService', function(){
    return {
        get: function(key) {
            return sessionStorage.getItem(key);
        },
        set: function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        unset: function(key) {
            return sessionStorage.removeItem(key);
        }
    };
})
.factory('ListFilter', function(){
	return {
		filter:function(jsonData,conditionKey,conditionValue){
			var returnData;
			for(var i in jsonData){
				if( jsonData[i][conditionKey] == conditionValue){
					returnData = jsonData[i];
				}
			}
			return returnData;

		}
	}
})
.factory('MessageShow',function($rootScope,$timeout){
    return {
        showMsg:function(msg){
            $rootScope.hasMessage = true;
            $rootScope.messages = msg;
        },
        hideMsg:function(){
            $rootScope.hasMessage = false;
        },
        toastMsg:function(msg){
            var that = this;
            this.showMsg(msg);
            $timeout(function(){
                that.hideMsg();
            },2500)
        },
        netErrMsg:function(){
            this.toastMsg('网络错误，请稍后再试！');
        }
    }
})
//build a interceptor 拦截器
.factory('AuthInterceptor', function($q, $injector) {
    var CookieService = $injector.get('CookieService');
    return {
        request: function(config) {
            var token = CookieService.get('auth_token') || '';
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
                CookieService.set('auth_token',CookieService.get('auth_token'),-1);
                $injector.get('$state').go('ekp.login');
            }
            return $q.reject(response);
        }
    };
});
