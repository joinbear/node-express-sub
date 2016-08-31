;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
angular.module('webapp')
//合同信息获取
.factory('Trade',function ($resource){
    return $resource("http://10.63.0.86:3000/trade.json",{
        contractNum : "@contractNum",
        contractType : "@contractType"
    },{});
})
//交易数据接口
.factory('TradeList',function ($resource,HttpHost) {
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_proc/tmTfProc.do?method=wxAppReadProcList&argDateType=contractDate&argBeginDate=1000-01-01&argEndDate=3000-01-01&argProcStatus=IS_PROCESSING',{
		argKeyChars : "@argKeyChars"
	},{})
})
//交易数据提交
.factory('TradeSubmit',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_transac/tmTfTransac.do?method=wxAppUpdateAsync',{
		fdId : "@fdId",
		data : "@data"
	},{
		sendData : {
      method : "post"
    }
	})
})
//转交下一步接口
.factory('TradeStep',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_remark/tmTfRemark.do?method=wxAppAdd&forWhat=FOR_NODE',{
		nodeId : "@nodeId",
		isRunToBusi : "@isRunToBusi"
	},{})
})
//更新金融单接口
.factory('UpdateFinance',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_proc/tmTfProc.do?method=updateChildEndFinance',{
		financeId : "@financeId"
	},{})
})
//提交通用接口数据
.factory('AddRemark',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_remark/tmTfRemark.do?method=wxAppSave',{
		data : "@data"
	},{})
})
//保存评估信息
.factory('SaveLoan',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_transac/tmTfTransac.do?method=wxAppUpdateAsyncByEvaluateNodeBusiData',{
		data : "@data"
	},{})
})
//验证流程节点接口
.factory('CheckStep',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_transac/tmTfTransac.do?method=sendForwardCheck',{
		nodeId : "@nodeId"
	},{})
})
//转交下一步接口
.factory('GoNext',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_transac/tmTfTransac.do?method=sendForward',{
		nodeId : "@nodeId"
	},{})
})
//提交网签接口
.factory('SubmitNetsignedNo',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_transac/tmTfTransac.do?method=updateNetsignedNo',{
		contractId : "@contractId",
		netsignedNo : "@netsignedNo"
	},{})
})
//交易详情
.factory('TradeDetail',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_proc/tmTfProc.do?method=wxAppReadMainData',{
		contractId : "@contractId"
	},{})
})
//获取备注相关信息
.factory('CommentInfo',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_remark/tmTfRemark.do?method=wxAppAdd&forWhat=FOR_PROC',{
		procId : "@procId",
		contractId : "@contractId"
	},{})
})
//提交备注
.factory('SubmitComment',function($resource,HttpHost){
	return $resource(HttpHost.host+'/ekp/ecen/tm/tf/tm_tf_remark/tmTfRemark.do?method=wxAppSave',{
		data : "@data"
	},{})
});