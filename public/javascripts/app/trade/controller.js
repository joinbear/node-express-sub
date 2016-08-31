;
/**
 * autor qiaoni
 * createTime 2015/08/05
 * version 1.0
 * qq 739016023
 * @copy 链家成都分公司
 */
//交易点件首页
angular.module('tradeContrller',['oc.lazyLoad'])
.controller('TradeIndexController',function($rootScope,$scope,$state,Trade,
  sessionService,MsgTransmitService,TradeService,MessageShow,animateService,LocalService,TradeList){
  //方便压缩时使用
  var 
    titleItems = TradeService.titleItems,
    navItems = TradeService.navItems ,
    i = 0;
  //设置header标题
  $rootScope.indexList.headerContent = titleItems.tradeIndex;
  $rootScope.indexList.showLogout    = true;
  // $rootScope.indexList.showBackBtn = true;
  $scope.animateClass = animateService.swipeLeft;
  $scope.swipeLeft = function(){
    i = i > 1 ? 0 :  i + 1;
    $scope.animateClass = animateService.swipeLeft;
    animateService.goPage(navItems[i].navUrl);
  };
  $scope.swipeRight = function(){
    i = i == 0 ? 2 :  i - 1;
    $scope.animateClass = animateService.swipeRight;
    animateService.goPage(navItems[i].navUrl);
  };
  //定义交易点件Tab
  $rootScope.indexList.navItem = TradeService.navItems;
  //交易合同信息对象
  $scope.tradeObj = {
    "hasInfo": false,//合同信息是否有内容
    "tradeNum":""//合同编号
  };
  //合同信息数据模型
  $scope.tradeData = {
    "contractInfo": [],//合同信息
    "loan": {},//贷款过户信息
    "progress": [],//流程信息
    "progressTable":[]//流程步骤详情
  };
  $scope.goList = function(){
    MessageShow.showMsg(titleItems.tradeLoad);
    TradeList.get({"argKeyChars":$scope.tradeObj.tradeNum})
    .$promise.then(function(res){
      if(res.data.object && res.data.object.length > 0){
        MessageShow.hideMsg();
        console.log(res.data.object);
        LocalService.set('listData',JSON.stringify(res.data.object));
        $state.go('ekp.trade.list');
        $rootScope.indexList.showFooter = false;
      }else{
        MessageShow.toastMsg("没有获取到相关数据");
      }
    },function(){
      MessageShow.netErrMsg();
    })  
  }
  //获取交易合同对象
  $scope.tradeObj = angular.fromJson(sessionService.get('tradeObj')) || $scope.tradeObj;
  //显示footer变量
  $rootScope.indexList.showFooter = $scope.tradeObj.hasInfo;
  //向上顶层发送消息
  MsgTransmitService.sendHeader($scope,$rootScope.indexList);
  //初始化消息
  TradeService.initMsg($scope);
  //获取子controller消息
  TradeService.receiveMsg($scope);
})
//合同信息控制器
.controller('TradeListController',function($rootScope,$scope,$state,
  MsgTransmitService,TradeService,sessionService,TradeDetail,MessageShow,LocalService,DataService){
    var titleItems = TradeService.titleItems;
    //设置header标题
    $rootScope.indexList.headerContent=titleItems.tradeList;
    //向上顶层发送消息
    MsgTransmitService.sendHeader($scope,$rootScope.indexList);
    //接受trade父级的消息
    TradeService.receiveMsg($scope);
    $scope.getList = function(){
      $scope.listData = angular.fromJson( LocalService.get('listData') ) || [];
    }
    //获取合同信息
    $scope.getContractInfo = function(contractId,contractNum){
      MessageShow.showMsg(titleItems.tradeLoad);
      sessionService.set('contractId',contractId);
      //获取合同数据
      DataService.getData(function(res){
        if(res.data.object){
          MessageShow.hideMsg();
          $scope.tradeData = res.data.object;
          //显示footer变量
          $rootScope.indexList.showFooter = $scope.tradeObj.hasInfo = true;
          //向下广播消息
          $scope.tradeObj.tradeNum = contractNum;
          //向上顶层发送消息
          MsgTransmitService.sendHeader($scope,$rootScope.indexList.showFooter);
          //TradeService.sendMsg($scope,$scope.tradeObj);
          TradeService.sendMsg($scope,$scope.tradeData);
          $state.go('ekp.trade.info');
        }else{
          MessageShow.toastMsg(res.data.retMsg);
        }
      });
    };
})
//合同信息控制器
.controller('TradeInfoController',function($rootScope,$scope,MsgTransmitService,TradeService){
  var titleItems = TradeService.titleItems;
  //设置header标题
  $rootScope.indexList.headerContent=titleItems.tradeInfo;
  //向上顶层发送消息
  MsgTransmitService.sendHeader($scope,$rootScope.indexList);
  //接受trade父级的消息
  TradeService.receiveMsg($scope);
})
//贷款信息控制器
.controller('TradeLoanController',function($rootScope,$scope,$state,MsgTransmitService,TradeService,
    TradeSubmit,MessageShow){
    var titleItems = TradeService.titleItems;
    //设置header标题
    $rootScope.indexList.headerContent = titleItems.tradeLoan;
    //向上顶层发送消息
    MsgTransmitService.sendHeader($scope,$rootScope.indexList);
    //接受trade父级的消息
    TradeService.receiveMsg($scope);
    //交易合同交易过户中间对象
    $scope.loanObj = TradeService.tradeLoanObj;
    $scope.dataObj = {};
    $scope.dataObj.fdId = $scope.tradeData.loan.fdId;
    var buildData = function(buildData){
      for(var i in buildData){
        var data = buildData[i];
        if(typeof data == 'string'){
            $scope.dataObj[i] = data;
        }else{
          for(var j in data){
            if(typeof data[j] == 'string'){
              $scope.dataObj[i] = data[j];
            } 
          }
        }
      }
    }
    //数据提交方法
    $scope.submitData = function(fdId){
      //todo 提交修改数据
      buildData($scope.tradeData.loan.customInfo);
      buildData($scope.tradeData.loan.loanInfo);
      buildData($scope.tradeData.loan.ownerInfo);
      TradeService.sendMsg($scope,$scope.tradeData);
      //向上发送消息
      TradeService.sendMsg($scope);
      console.log($scope.dataObj);
      MessageShow.showMsg(titleItems.tradeSubmit);
      //提交数据
      TradeSubmit.sendData({fdId:fdId,data:$scope.dataObj}).$promise.then(function(res){
        if(res.status == '0000'){
          MessageShow.hideMsg();
        }else{
          MessageShow.toastMsg(res.retMsg);
        }
      },function(err){
        MessageShow.netErrMsg();
      });
    }

})
//交易进度控制器
.controller('TradeProgressController',function($rootScope,$scope,$http,$resource,
  MsgTransmitService,TradeService,TradeStep,MessageShow,UpdateFinance,CheckStep,
  GoNext,sessionService,AddRemark,HttpHost,SubmitNetsignedNo,SaveLoan,DataService,CommentInfo,SubmitComment){
  var titleItems = TradeService.titleItems;
  //设置header标题
  $rootScope.indexList.headerContent=titleItems.tradeProgress;
  //向上顶层发送消息
  MsgTransmitService.sendHeader($scope,$rootScope.indexList);
  //接受trade父级的消息
  TradeService.receiveMsg($scope);

  //是否显示流程弹窗
  $scope.progressObj = {
    editForNode : false ,//通用弹窗
    endChildFinance : false,//金融弹窗
    editForEvaluateNode : false,//评估弹窗
    fillNetsignedNo : false,//网签弹窗
    addComment : false
  };
  //网签对象
  $scope.fillNetsignedNo = {
    remindDateBegin : '',
    contractNo : $scope.tradeObj.tradeNum//合同号
  }
  //转交下一步对象
  $scope.remarkObj = {
    isSendMsg : false,
    isEscortCustomer : false,
    isShowEscortCustomer : false,
    remark : ''
  };
  $scope.isCheck = false;
  //转交下一步
  $scope.goNext = function(nodeId,isUserCanProcess){
    //判断是否有权限操作
    if(isUserCanProcess){
      checkNode(nodeId);
    }else{
      MessageShow.toastMsg(TradeService.titleItems.unOperated);
    }
  };
  /**
   * [checkNode 验证节点，获取节点类型]
   * @param  {[type]} nodeId [流程节点id]
   * @return {[type]}        [description]
   */
  var checkNode = function (nodeId){
    MessageShow.showMsg(titleItems.tradeLoad);
    //验证流程
    CheckStep.get({nodeId:nodeId}).$promise.then(function (res){
      MessageShow.hideMsg();
      $scope.isCheck = res.result;
      //走网签节点
      if(!res.result && res.callbackMethod){
        $scope.fillNetsignedNo.nodeId = nodeId;
        $scope.progressObj.fillNetsignedNo = true;
      }else {
        //下一步
        goToNext(nodeId);
      }
    }, function (err){
        MessageShow.netErrMsg();
    });
  },
  //下一步
  goToNext = function (nodeId,isRunToBusi){
    MessageShow.showMsg(titleItems.tradeLoad);
    var sendData = {
      nodeId : nodeId
    };
    if(isRunToBusi != undefined){
      sendData.isRunToBusi = false;
    }
    //获取节点内容以及类型
    TradeStep.get(sendData).$promise.then(function (response){
      MessageShow.hideMsg();
      var url = response.data.object.redirectToUrl;
      //当有url地址时，需要再次请求该地址获取节点类型
      if(url){
        getContractVo(url);
      }else {
        //真正的转交下一步操作
        realNodeNext(response);
      }
    },function (err){
      MessageShow.netErrMsg();
    });
  },
  //获取真实节点
  getContractVo = function(url){
    var getRealType = $resource(HttpHost.host + url,{},{});
    MessageShow.showMsg(titleItems.tradeLoad);
    getRealType.get({}).$promise.then(function (res){
      MessageShow.hideMsg();
      realNodeNext(res);
    }, function (err){
      MessageShow.netErrMsg();
    });
  },
  /**
   * [realNodeNext 转交下一步节点的操作]
   * @param  {[type]} response [响应信息]
   * @return {[type]}          [description]
   */
  realNodeNext = function(response){
    var type = response.data.object && response.data.object.nodePageKind || '';
    switch(type){
      //通用节点
      case 'editForNode' :
        $scope.progressObj.editForNode = true;
        $scope.remarkObj = response.data.object.pageData;
      break;
      //金融节点
      case 'endChildFinance' :
        $scope.progressObj.endChildFinance = true;
        $scope.progressObj.contractVosComByProc =  response.data.object.pageData.contractVosComByProc;
      break;
      //评估节点
      case 'editForEvaluateNode' :
        $scope.progressObj.editForEvaluateNode = true;
        $scope.progressObj.busiData = response.data.object.pageData.busiData;
        $scope.progressObj.busiData.nodeId = response.data.object.pageData.nodeId;
      break;
      //默认节点
      default :
        MessageShow.toastMsg(titleItems.unOperated);
      break;
    }
  };
  
  //关闭弹层
  // $scope.closePopup = function(nodeName){
  //   console.log(nodeName);
  //   switch(nodeName){
  //     case 'editForNode' :
  //       $scope.progressObj.editForNode = false;
  //     break;
  //     case 'endChildFinance' :
  //       $scope.progressObj.endChildFinance = false;
  //     break;
  //     case 'editForEvaluateNode' :
  //       $scope.progressObj.editForEvaluateNode = false;
  //     break;
  //     case 'fillNetsignedNo' :
  //       $scope.progressObj.fillNetsignedNo = false;
  //     break;
  //   }
  // };
  //添加网签方法
  $scope.addNetsignedNo = function(){
    MessageShow.showMsg(titleItems.tradeLoad);
    var  contractId = sessionService.get('contractId') || '';
    SubmitNetsignedNo.get({contractId:contractId,netsignedNo:$scope.fillNetsignedNo.remindDateBegin}).$promise.then(function (response){
      MessageShow.hideMsg();
      if(response.status == '0000') {
        $scope.progressObj.fillNetsignedNo = false;
        //转交下一步节点
        goToNext($scope.fillNetsignedNo.nodeId);
      }else{
        MessageShow.toastMsg(response.msg);
      }
    },function (err){
      MessageShow.netErrMsg();
    })
  }
  //添加评估价格
  $scope.addPrice = function(fdId,nodeId){
    var sendData = {
      estimateCo : $scope.progressObj.busiData.estimateCo.value,//评估银行
      estimatePrice : $scope.progressObj.busiData.estimatePrice,//评估价格
      fdId : $scope.progressObj.busiData.fdId
    }
    MessageShow.showMsg(titleItems.isSending);
    SaveLoan.get({data: sendData}).$promise.then(function (res){
      if(res.data && res.data.retCode == 1){
        MessageShow.toastMsg(titleItems.sendSuccess);
        goToNext($scope.progressObj.busiData.nodeId,false);
      }else{
        MessageShow.toastMsg(titleItems.sendFail);
      }
    }, function(){
      MessageShow.netErrMsg();
    })
    $scope.progressObj.editForEvaluateNode = false;
  }
  //转交下一步方法
  $scope.addRemark = function(){
    MessageShow.showMsg(titleItems.tradeSubmit);
    //todo 提交remark
    AddRemark.get({data:$scope.remarkObj}).$promise.then(function (response){
      $scope.progressObj.editForNode = false;
      if(response.data && response.data.retCode == 1){
        MessageShow.toastMsg(titleItems.sendSuccess);
        //刷新数据
        DataService.getData(function(res){
          $scope.tradeData = res.data.object;
          TradeService.sendMsg($scope,$scope.tradeData);
        });
      }else{
        if(response.data.retMsg){
          MessageShow.toastMsg(response.data.retMsg);
        }else{
          MessageShow.toastMsg(titleItems.sendFail);
        }
        
      }
    },function (err){
      MessageShow.netErrMsg();
    })
  };
  /**
   * [doUpdateChildEndFinance 金融节点完成方法]
   * @param  {[type]} fdId       [fdId]
   * @param  {[type]} contractNo [合同号]
   * @return {[type]}            [description]
   */
  $scope.doUpdateChildEndFinance = function(fdId,contractNo) {
    MessageShow.showMsg(titleItems.tradeSubmit);
    UpdateFinance.query({financeId:fdId}).$promise.then(function (res) {
      if(res[2]){
        MessageShow.hideMsg();
        if(res[2].retCode == 1){
          MessageShow.toastMsg(titleItems.operateSuccess);
          //重新获取数据
          DataService.getData(function(res){
            $scope.tradeData = res.data.object;
            TradeService.sendMsg($scope,$scope.tradeData);
          });
        }else {
          MessageShow.toastMsg(titleItems.operateFail+res[2].retMsg);
        }
      }else{
        MessageShow.toastMsg(res[1]);
      }
    }, function (err){
      MessageShow.netErrMsg();
    })
  }
  //显示添加备注弹窗
  $scope.showAddComment = function(procId){
    var  contractId = sessionService.get('contractId') || '';
    MessageShow.showMsg(titleItems.tradeLoad);
    CommentInfo.get({procId:procId,contractId :contractId}).$promise.then(function (res){
      MessageShow.hideMsg();
      var data = res.data.object && res.data.object.pageData; 
      $scope.commentObj = {
        procId:data.procId,
        contractId:data.contractId,
        remark:data.remark,
        remarkType:data.remarkType,
        isSendMsg:data.isSendMsg
      }
      $scope.progressObj.addComment = true;
    }, function (err){
      MessageShow.netErrMsg();
    })
  }
  //添加备注
  $scope.addComment = function(){
    var sendData = $scope.commentObj;
     MessageShow.showMsg(titleItems.tradeLoad);
    SubmitComment.get({ data : sendData}).$promise.then(function (res){
      MessageShow.hideMsg();
      if(res.data && res.data.retCode == 1){
        MessageShow.toastMsg(res.data.retMsg);
        $scope.progressObj.addComment = false;
      }else {
        MessageShow.toastMsg(res.data.retMsg);
      }
    }, function (err){
      MessageShow.netErrMsg();
    });
  }
});