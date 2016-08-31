const express   =require('express');
const webshot   =require('webshot/lib/webshot');
// git clone the node-webshot and npm install 
// "node-webshot" : "http://github.com/brenden/node-webshot.git"
const searchUrl = 'http://cd.lianjia.com/fangjia/rs';
const router    = express.Router(); 

/* GET home page. */
router.get('/', (req, res)=> {
  const title = '房价打印工具'
  res.render('print/index', {title : title});
});

//获取打印图片
router.post('/price',(req, res)=>{
  const resData = {
    content : "",
    msg : "0"
  };
  if(req.body.keyword){
    // webshot参数配置
    var options = {
      windowSize: {
        width: 1000,
        height: 'all'
      },
      shotSize : { 
        width: 'all',
        height: 'all' 
      },
      customCSS : "html{ font-family: 'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei', 微软雅黑, 'Segoe UI', Tahoma, 宋体b8b体, SimSun, sans-serif}",
      renderDelay : 1000,
      //页面加载完成后事件
      onLoadFinished : function(){
        //此函数在目标页面执行的，上下文环境非本phantomjs，所以不能用到这个js中其他变量
        //window.scrollTo(0,10000);//滚动到底部
        function getDom(className,isAll){
          return isAll ? document.querySelectorAll(className) : document.querySelector(className);
        }
        function hideDom(dom){
          dom.style.display='none';
        }
        var 
          header      = getDom(".lianjia-header"),
          searchs     = getDom(".searchs"),
          turnover    = getDom(".turnover"),
          intro       = getDom(".intro"),
          footer      = getDom(".footer"),
          bg          = getDom(".turnover-con .bg"),
          view        = getDom(".turnover-con .view"),
          style02     = getDom(".style02",true),
          alink       = getDom(".nearday a",true),
          // priceMap = getDom(".priceMap"),
          orderList   = getDom(".order-list"),
          fix         = getDom(".fix-right-v2"),
          lianjiaim   = getDom(".lianjiaim"),
          lianjiaim_shandow   = getDom(".lianjiaim-shandow"),
          body        = getDom("body"),
          house_list  = getDom(".house_list"),
          back_top    = getDom("#back-top");
          hideDom(header);
          hideDom(searchs);
          hideDom(intro);
          hideDom(footer);
          hideDom(back_top);
          hideDom(lianjiaim_shandow);
          // hideDom(priceMap);
          hideDom(house_list);
          hideDom(orderList);
          hideDom(fix);
          hideDom(lianjiaim);
          hideDom(turnover);
          //console.log(body);
          //body.style.fontFamily = "'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei', 微软雅黑, 'Segoe UI', Tahoma, 宋体b8b体, SimSun, sans-serif";
          bg.style.backgroundColor = '#e6e6e6';
          bg.style.backgroundImage = 'none';
          view.style.color ="#333";
          view.style['text-shadow'] ="0 1px 2px #fff";
          var plist = getDom(".nearday a",true);
          var len = plist.length;
          while(len){
            len--;
            var el = plist[len];
            el.style.color = "#333";
          }
          var plist1 = getDom(".semid .style02",true);
          var len1 = plist1.length;
          while(len1){
            len1--;
            var el1 = plist1[len1];
            el1.style.backgroundColor = "#e6e6e6";
          }
      }
    };
    var 
      timeStamp = new Date().getTime(),
      imgPath = process.cwd() + '/runtime/picture/print/' + timeStamp + 'print.jpg';
    //抓取页面，生成图片
    webshot(searchUrl + req.body.keyword, imgPath , options, function(err) {
      console.log('err:'+err);
      if(!err){
        resData.content = "/website/print/"+timeStamp+"print.jpg?timeStamp="+timeStamp;
        resData.msg = "1";
      }else {
        resData.content = err;
        resData.msg = "0";
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(resData));
    });
  }else{
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(resData));
  }
});

module.exports = router;