const request  = require('request');
const co       = require('co');
const config   = require('../config/config');
const crossUrl = config.crossUrl;
const fs       = require('fs');
require('request').debug = true;

class CommonLibrary {
	constructor() {
		this.httpRequest = this.httpRequest.bind(this);
		this.httpGet     = this.httpGet.bind(this);
	}
	/**
	 * [promise 使用promise包裹请求，返回promise]
	 * @param  {Function} fn [description]
	 * @return {[type]}      [description]
	 */
	promise(fn) {
		// yield any promise
  	const result = new Promise((resolve, reject)=>{
  		fn(resolve, reject);
  	});
  	return result;
	}
	/**
	 * [time 时间日期格式函数]
	 * @return {[type]} [description]
	 */
	time() {
		const date = new Date();
		const time = {
			date                : date,
			year                : date.getFullYear(),
			month               : date.getFullYear() + "-" + (date.getMonth() + 1),
			day                 : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute              : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
			date.getHours() + " :" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
		};
		return time;
	}
	writeFile(path,content,options){
		const { promise } = this;
		return promise((resolve, reject)=>{
			fs.writeFile(path,content,options || {},(error)=>{
				if(error) reject(error);
				resolve(true);
			});
		});
	}
	/**
	 * [sendMessage 发送短信]
	 * @param  {[type]} phonenumber [电话号码]
	 * @param  {[type]} message     [消息内容]
	 * @return {[type]}             [description]
	 */
	sendMessage(phonenumber,message){
		const { httpGet } = this;
		const msgUrl = 'http://218.6.197.181:8168/mip/sys/smsOper/send?appType=OA&passwd=kawayi&phoneNo='+ phonenumber+'&msg='+message+'&randStr='+new Date().getTime();
		return httpGet({ url : msgUrl , cross : true});
	}
	/**
	 * [buildUrl 构建url地址，主要是本域地址和外域地址，以及个人调试的测试]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	buildUrl(url,cross = false) {
		return cross ? url : config.currentHost + url;
	}
	getContent(response,getBody = true) {
		return getBody ? response.body : response;
	}
	getTranformData(json,data) {
		const body = json ? data : {};
		const form = json ? {}   : data;
		return { body , form }
	}
	/**
	 * [consoleUrl 调试检测请求]
	 * @param  {[type]} url  [请求地址]
	 * @param  {[type]} type [请求类型]
	 * @return {[type]}      [description]
	 */
	consoleUrl(url,type){
		if(config.debug){
			console.log('request url is ['+ url + ']the type is '+type);
		}
	}
	/**
	 * [httpHead http head 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpHead({url = '',cross = false}){
		const { buildUrl , consoleUrl , promise } = this;
		const requestUrl = buildUrl(url,cross);
		consoleUrl(requestUrl,'head');
	}
	/**
	 * [httpHead http head 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpGet({ url = '', cross = false , getBody = true }) {
		const { httpRequest } = this;
		return httpRequest({
			url     : url ,
			cross   : cross ,
			getBody : getBody
		});
	}
	httpGetAll({ urls = [], cross = false , getBody = true }){
		const { httpGet } = this;
		const promises = urls.map((url,index)=> {
			return httpGet({url : url ,cross : cross});
		});
		return Promise.all(promises);
	}
	/**
	 * [httpHead http post 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpPost({url = '',data = {}, cross = false , getBody = true , json = true}) {
		const { httpRequest  , getTranformData } = this;
		const dataObject = getTranformData(json,data);
		return httpRequest({
			url     : url ,
			method  : 'post',
			cross   : cross ,
			getBody : getBody,
			body    : dataObject.body,
			form    : dataObject.form,
			json    : json
		});
	}
	/**
	 * [httpHead http put 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpPut({url = '',data = {}, cross = false , getBody = true , json = true}) {
		const { httpRequest , getTranformData} = this;
		const dataObject = getTranformData(json,data);
		return httpRequest({
			url     : url ,
			method  : 'put',
			cross   : cross ,
			getBody : getBody,
			body    : dataObject.body,
			form    : dataObject.form,
			json    : json
		});
	}
	/**
	 * [httpHead http delete 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpDelete({ url = '', cross = false , getBody = true }) {
		const { httpRequest } = this;
		return httpRequest({
			url     : url ,
			method  : 'delete',
			cross   : cross ,
			getBody : getBody
		});
	}
	/**
	 * [httpHead http pipe 请求]
	 * @param  {[type]}  url   [方法url地址]
	 * @param  {Boolean} cross [是否是本域地址]
	 * @return {[type]}        [description]
	 */
	httpPipe() {
		const { buildUrl , consoleUrl , promise } = this;
		const requestUrl = buildUrl(url,cross);
		consoleUrl(requestUrl,'pipe');
	}
	// visit https://github.com/request/request for detail
	// 'content-type': 'application/x-www-form-urlencoded'
	httpRequest({
		method  = 'get',
		url     = '',
		body    = {},
		cross   = false , 
		getBody = true , 
		json    = true,
		form    = {},
    timeout = 10000
	}){
		const { buildUrl , consoleUrl , promise , getContent } = this;
		const requestUrl = buildUrl(url,cross);
		consoleUrl(requestUrl,method);
		const options = {
			method : method ,
			uri    : requestUrl ,
			json   : json,
			timeout: timeout
		};
		if(json){
			options.body = body;
		}else{
			options.form = form;
		}
		return promise((resolve,reject)=>{
			request(options,(error, response, body)=>{
				console.log(body);
				console.log(error);
				if (!error && response.statusCode == 200) {
			   	resolve(getContent(response,getBody));
			  }else{
			  	reject(error);
			  }
			})
		});
	}
}
module.exports =  CommonLibrary;