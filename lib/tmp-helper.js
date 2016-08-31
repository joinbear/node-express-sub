// Handlebars模版中的注释可以使用 {{!-- --}} 或者 {{! }} 或者 <!-- -->.
// {{ }}和 {{{}}}和区别就是, 如果你不希望变量里面的字符串被转义就使用{{{ }}}对变量进行处理;
const Handlebars  = require('handlebars');


module.exports = {
	/**
	 * [link 文本转义 ，url加a标签]
	 * @param  {[type]} text [文本]
	 * @param  {[type]} url  [链接地址]
	 * @return {[type]}      [description]
	 */
	link : function(text, url){
		text = Handlebars.Utils.escapeExpression(text);
    url  = Handlebars.Utils.escapeExpression(url);
    var result = '<a href="' + url + '">' + text + '</a>';
    return new Handlebars.SafeString(result);
	},
	/**
	 * [list 列表数据]
	 * @param  {[type]} items   [列表选项]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 * use {{#list people}}{{firstName}} {{lastName}}{{/list}}
	 * data {
		  people: [
		    {firstName: "Yehuda", lastName: "Katz"},
		    {firstName: "Carl", lastName: "Lerche"},
		    {firstName: "Alan", lastName: "Johnson"}
		  ]
		}
	 * result 
	 * <ul>
		  <li>Yehuda Katz</li>
		  <li>Carl Lerche</li>
		  <li>Alan Johnson</li>
		 </ul>
	 */
	list : function(items, options){
		var out = "<ul>";
	  for(var i=0, l=items.length; i<l; i++) {
	  	/*options.fn相当于一个编译的函数*/
	    out = out + "<li>" + options.fn(items[i]) + "</li> " ;       
	  }  
	  return out + "</ul>";
	},
	/**
	 * [inverse description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 * use 
	 * {{#inverse}}
      <p>{{内容}}</p>
     {{else}}
      <p>inverse:{{内容}}</p>
     {{/inverse}}
	 */
	inverse: function(options){
		if( this.condition ) {
      return options.fn(this);
    }else{
      return options.inverse(this);
    }
	}
}
