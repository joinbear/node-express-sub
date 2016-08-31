(function($){
  
  $.extend({
    /**
     * [checkPhone 验证手机号码]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    checkPhone:function(value){
      return $.checkReg('^1[34578]\\d{9}$',value);
    },
    /**
     * [showMsg toast效果实现]
     * @param  {[type]} msg  [消息内容]
     * @param  {[type]} time [消息显示时间]
     * @return {[type]}      [description]
     */
    showMsg:function(msg,time){
      var delay = time || 1500;
      var msgHtml = '<div class="msg" id="msg" style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;padding:10px 15px;font-size:14px;"></div>'
      $("body").append(msgHtml);
      $("#msg").html(msg).show();
      setTimeout(function(){
        $("#msg").html('').hide();
      },delay);
    },
    /**
     * [trimVal 去除文本空格]
     * @param  {[type]} value [需要去除的值]
     * @return {[type]}       [返回去除的文本值]
     */
    trimVal:function (value){
      return $.trim(value);
    },
    checkReg:function(regStr,value){
      var reg = new RegExp(regStr);
      return reg.test(value) ? true : false;
    },
    /**
     * 设置cookie
     * @param {string} name key 必须
     * @param {string} value value 必须
     * @param {string/number} days 有效期，或者'session' 必须
     * @param {string} domain 作用域。可选
     */
    setCookie:function(name,value,Days,domain,path){
      var 
        Days   = Days ||360,
        path   = path ||'/',
        domain = domain ? ";domain="+domain:"",
        exp    =new Date();
      exp.setTime(exp.getTime()+Days*24*60*60*1000);
      document.cookie=name+"="+encodeURIComponent(value)+(Days == "section" ? "" : ";expires="+exp.toGMTString()) +domain+";path="+path; 
    },
    /**
     * 获取cookie
     * @param {string} name key 必须
     * @return {string} cookie值
     */
    getCookie:function(name){
      var viewCookie;
      if(document.cookie && document.cookie!=''){
        var 
          cookies = document.cookie.split(";"),
          cookieLen = cookies.length;
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
  });

})(jQuery)
/**
 * placeholder对象
 */
var placeholder = {
  //检测
  _check : function(){
      return 'placeholder' in document.createElement('input');
  },
  //初始化
  init : function(){
      if(!this._check()){
          this.fix();
      }
  },
  //修复
  fix : function(){
    $(':input[placeholder]').each(function(index, element) {
      var self = $(this), txt = self.attr('placeholder');
      self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none',display:'block'}));
      var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
      var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h+'px', lineHeight:h+'px', paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
      self.focusin(function(e) {
          holder.hide();
      }).focusout(function(e) {
          if(!self.val()){
              holder.show();
          }
      });
      holder.click(function(e) {
          holder.hide();
          self.focus();
      });
      if($.trim( self.val() ) !=''){
      	holder.click();
      }
    });
  }
};
$(function(){
  //初始化，确保placeholder生效
  placeholder.init();
});