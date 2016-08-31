;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
angular.module('webapp')
// .directive('my-dialog', function(){
// 	console.log(1);
// 	return {
// 		restrict: 'A',
//     templateUrl: '/templates/common/dialog.html',
//     scope : {
//     	isOpen : '=',
//     	sureBtn : '=',
//     	sureFn : '&',
//     	cancelBtn : '=',
//     	cancelFn : '&',
//     },
//     link : function(scope, element, attrs) {
//     	console.log(scope);
// 			scope.openDialog    = scope.isOpen;
// 			scope.showSureBtn   = scope.showSureBtn;
// 			scope.sureFn        = sureFn;
// 			scope.showCancelBtn = scope.showCancelBtn;
// 			scope.cancelFn      = cancelFn;
//     },
//     transclude: true,
//     replace:true
// 	};
// })
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