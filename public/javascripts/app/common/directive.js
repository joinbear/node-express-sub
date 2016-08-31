;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
angular.module('webapp.directive',[])
.directive("dyName", [
    function() {
      return {
        require: "ngModel",
        link: function(scope, elm, iAttrs, ngModelCtr) {
          ngModelCtr.$name = scope.$eval(iAttrs.dyName)
          var formController = elm.controller('form') || {
            $addControl: angular.noop
          };
          formController.$addControl(ngModelCtr);

          scope.$on('$destroy', function() {
            formController.$removeControl(ngModelCtr);
          });
        }
      };
    }
])
.directive('dyShow',function(){
  // // 一个指令定义对象
  // return {
  //   // 通过设置项来定义指令，在这里进行覆写
  //   restrict: 'A',
  // };
})
.directive('myDialog', function() {
  return {
    restrict: 'EA',
    scope : {
      isOpen : '=',
      title : '@',
      sureBtn : '@',
      cancelBtn : '@',
      sureFn : '&'
    },
    template: 
      '<div>\
        <div class="dialog" ng-show="isOpen">\
          <div class="dialog-title">\
              <h2 class="dialog-txt">{{title}}</h2>\
              <div class="dialog-close">x</div>\
          </div>\
          <div class="dialog-content">\
              <div ng-transclude></div>\
          </div>\
          <div class="dialog-btns">\
              <button class="dialog-btn" ng-show="sureBtn" ng-click="sureFn();">{{sureBtn}}</button>\
              <button class="dialog-btn" ng-show="cancelBtn" ng-click="cancel();">{{cancelBtn}}</button>\
          </div>\
        </div>\
        <div class="mask" ng-show="isOpen"></div>\
      <div>',
    replace: true,
    transclude: true,
    link : function(scope, element, attrs){
      scope.cancel = function(){
        if(scope.isOpen){
          scope.isOpen = false;
        }
      }
    }
  };
});