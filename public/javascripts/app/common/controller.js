;'use strict';
/**
* autor qiaoni
* createTime 2015/07/02
* version 1.0
* qq 739016023
* @copy 链家成都分公司
*/
//登录控制器
angular.module('webapp.controller',['webapp.service'])
.controller('LoginController',function($rootScope,$scope,$state,
  Login,CookieService,MessageShow,sessionService,MsgTransmitService){
  //设置header标题
  $rootScope.indexList.headerContent="登录";
  $rootScope.indexList.showLogout = false;
  $rootScope.indexList.showBackBtn = false;
  //用户账号信息
  $scope.user = {
    username : CookieService.get('ec_username') || '',
    password : CookieService.get('ec_password') || '',
    userinfo : '',
    isPassword : false
  };
  $scope.pwdFocus = function(){
    //动画控制变量
    $scope.user.isPassword = true;
  };
  $scope.pwdBlur = function(){
    //动画控制变量
    $scope.user.isPassword = false;
  };
  //登录方法
  $scope.loginIn = function(){
    if($scope.user.username != '' && $scope.user.password != ''){
      MessageShow.showMsg('正在登录中...');
      var user = {
        username : $scope.user.username,
        password : $scope.user.password
      };
      //调用登录接口
      Login.check(user).$promise.then(function(res){
        if(res.code == 1){
          MessageShow.hideMsg();
          CookieService.set('ec_username',$scope.user.username,30*24*60*60*1000);
          CookieService.set('ec_password',$scope.user.password);
          sessionService.set('ec_userinfo',res.userinfo);
          sessionService.set('auth_token',1);
          $rootScope.return_to_state();
        }else{
          MessageShow.toastMsg(res.mes);
        }
      },function(err){
        MessageShow.netErrMsg();
      });
    }
  };
  //向上顶层发送消息
  MsgTransmitService.sendHeader($scope,$rootScope.indexList);
})
//首页控制器
.controller('IndexController',function($rootScope,$scope,$state,LoginOut,MsgTransmitService,MessageShow,CookieService){
  //定义footer菜单
  $rootScope.indexList = {
    navItem : [],
    headerContent: '',
    showLogout: true,
    showBackBtn: false,
    showFooter: false
  };
  //注销
  $scope.logout = function(){
    //调用注销接口
    LoginOut.get().$promise.then(function(res){
      if(res.code == 1){
        CookieService.set('ec_username',CookieService.get('ec_username'),-1);
        CookieService.set('ec_password',CookieService.get('password'),-1);
        $state.go('ekp.login');
      }
    },function(err){
      MessageShow.netErrMsg();
    });
  };
  //返回列表页面
  $scope.goBack = function(){
    $state.go('ekp.list')
  };
  //创建顶层消息监听
  MsgTransmitService.initHeader($scope);
})
.controller('ListController',function($rootScope,$scope,MsgTransmitService){
  $rootScope.indexList.headerContent="首页";
  //向上顶层发送消息
  MsgTransmitService.sendHeader($scope,$rootScope.indexList);
});
