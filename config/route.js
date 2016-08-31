const requireDirectory  = require('require-directory');

/**
 * 路由挂载Handler
 */
class RouterHandler {

	constructor(app) {

		this.app = app;

	}

	/**
	 * [mount 路由挂载方法]
	 * @param  {String} path   [需要挂载路由的地址]
	 * @param  {String} preset [预置路由地址，默认为空，例如：/ekp/user/,ekp即为预置路由地址]
	 * @return {[type]}        [description]
	 */
	mount(path, preset = '') {

		const { app } = this;
		const routes  = requireDirectory(module,path);
	  const pre = preset ? preset + '/' : '';
	  for (let route in routes) {

	    var path = '';
	    if(typeof routes[route] == 'object') {

	      mount(route , pre + route + '/');

	    }else {

	      path = '/' + pre + '' + route;
	      console.log('the path is :'+path);
	      app.use(path,routes[route]);

	    }
	  }

	}

}

module.exports = RouterHandler;