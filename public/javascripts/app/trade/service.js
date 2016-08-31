;'use strict';
/**
 * autor qiaoni
 * createTime 2015/07/02
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */

//define a trade service module 交易合同service
angular.module('webapp')
.factory('TradeService', function(MsgTransmitService){
  return {
    /**
     * [initMsg 初始化消息传递方法]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    initMsg :function($scope){
      //console.log('tradeinit');
      MsgTransmitService.init($scope,"TradeIndexCtrChange","CtrChangeFromTradeIndexCtr");
    },
    /**
     * [sendMsg 发送消息]
     * @param  {[type]} $scope [作用域对象]
     * @param  {[type]} msg    [传递的消息]
     * @return {[type]}        [description]
     */
    sendMsg : function($scope,msg){
      //console.log('tradesend');
      MsgTransmitService.send($scope,"TradeIndexCtrChange",msg);
    },
    /**
     * [receiveMsg 接受消息]
     * @param  {[type]}   $scope   [作用域对象]
     * @param  {Function} callback [接收消息的回调函数]
     * @return {[type]}            [description]
     */
    receiveMsg : function($scope,callback){
      //console.log('traderecieve');
      MsgTransmitService.receive($scope,"CtrChangeFromTradeIndexCtr", function (event, msg) {
        if(callback){
            callback(msg);
        }else{
            $scope.tradeData = msg;
        }
      });
    },
    //nav内容数组
    navItems : [{
      navName : '合同信息',
      navUrl : 'ekp.trade.info'
    },{
      navName : '过户贷款信息',
      navUrl : 'ekp.trade.loan'
    },{
      navName : '办件进度',
      navUrl : 'ekp.trade.progress'
    }],
    //常用文字信息
    titleItems : {
      tradeInfo : '合同信息',
      tradeLoan : '过户信息',
      tradeProgress : '交易流程',
      tradeIndex : '交易点件',
      tradeList : '合同列表',
      tradeFail : '没有找到该合同信息!',
      tradeLoad : '获取数据中...',
      tradeSubmitFail:'提交数据失败...',
      tradeSubmit:'提交数据中...',
      unOperated : '你不能进行该项操作',
      isSending : '提交数据',
      sendSuccess : '提交成功！',
      sendFail : '提交失败！',
      operateSuccess : '操作成功',
      operateFail : '操作失败！错误信息：'
    },
    //交易合同对象
    tradeLoanObj : {
      ownerInfo : [{
          name : "netsignedDate",
          tagName : "网签时间",
          type : "text"
      },{
          name : "netsignedNo",
          tagName : "网签编号",
          type : "text"
      },{
          name : "netsignedType",
          tagName : "网签类型",
          type : "select"
      },{
          name : "parking",
          tagName : "车位数量",
          type : "text"
      },{
          name : "taxesPrice",
          tagName : "网签报税价",
          type : "text"
      },{
          name : "taxesPrice1",
          tagName : "税务通过价",
          type : "text"
      },{
          name : "propertyDepart",
          tagName : "过户房管局",
          type : "select"
      }],
      customInfo : [{
          name : "cuser",
          tagName : "主产权人",
          type : "text"
      },{
          name : "caddress",
          tagName : "户籍地",
          type : "select"
      },{
          name : "cmarriage",
          tagName : "婚姻状况",
          type : "select"
      },{
          name : "cuser1",
          tagName : "买方共有人1",
          type : "text"
      },{
          name : "caddress1",
          tagName : "户籍地",
          type : "select"
      },{
          name : "cmarriage1",
          tagName : "婚姻状况",
          type : "select"
      },{
          name : "cuser2",
          tagName : "买方共有人2",
          type : "text"
      },{
          name : "caddress2",
          tagName : "户籍地",
          type : "select"
      },{
          name : "cmarriage2",
          tagName : "婚姻状况",
          type : "select"
      }],
      loanInfo : [{
          name : "creditType",
          tagName : "贷款类型",
          type : "select"
      },{
          name : "creditBank",
          tagName : "商贷银行",
          type : "select"
      },{
          name : "creditMoney",
          tagName : "商贷金额（万",
          type : "text"
      },{
          name : "creditYear",
          tagName : "贷款年限",
          type : "text"
      },{
          name : "creditBankG",
          tagName : "公贷银行",
          type : "select"
      },{
          name : "creditMoneyG",
          tagName : "公贷金额(万)",
          type : "text"
      },{
          name : "creditYear",
          tagName : "贷款年限",
          type : "text"
      },{
          name : "creditRate",
          tagName : "贷款利率",
          type : "select"
      },{
          name : "creditCount",
          tagName : "贷款次数",
          type : "text"
      },{
          name : "estimateCo",
          tagName : "评估公司",
          type : "select"
      },{
          name : "estimatePrice",
          tagName : "评估总价(万)",
          type : "text"
      },{
          name : "estimateUnprice",
          tagName : "评估单价",
          type : "text"
      },{
          name : "salesManager",
          tagName : "客户经理",
          type : "text"
      },{
          name : "trustFundsFlag",
          tagName : "是否资金托管",
          type : "select"
      }]
    }
  };
})
//根据合同id获取合同信息
.factory('DataService',function(TradeDetail,MessageShow,sessionService){
  return {
    getData : function(callback){
      var  contractId = sessionService.get('contractId') || '';
      if(contractId){
        TradeDetail.get({"contractId": contractId}).$promise.then(function(res){
            callback(res);
        },function(err){
          MessageShow.netErrMsg();
        });
      }
    }
  }
});