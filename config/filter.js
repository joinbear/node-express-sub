/**
 * 接口过滤方法
 */
class Filter {
	constructor(app) {
		this.app = app;
		this.staticReg = /\/ekp\//;
		this.init();
	}
	/**
	 * [init 过滤无效拦截地址]
	 * @return {[type]} [description]
	 */
	init() {
		const { app , staticReg } = this;
		const that = this;
		app.use(function(req, res, next){
			const allow = staticReg.test(req.url);
			if(allow){
				console.log('i come in filter=======>'+req.url);
				that.filter(req, res, next);
			}else{
				next();
			}
		});
	}
	/**
	 * [filter 拦截 返回相关json数据]
	 * @return {[type]} [description]
	 */
	filter(req, res, next) {
		//console.log(req.headers);
		next();
	}
}


module.exports = Filter;