const path              = require('path');
const express           = require('express');
const favicon           = require('serve-favicon');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const logger            = require('morgan');
const multer            = require('multer');
const fs                = require('fs-extra');
const res_api           = require('res.api');
const config            = require('./config');
const exphbs            = require('express-handlebars');
const compression       = require('compression');
const HandlerbarsHelper = require('../lib/tmp-helper');

/**
 * set view , static source , parser 
 */
class ParamHandler {
	constructor(app) {
		this.app = app;
	}
	init() {
		this.setCompress();
		this.setView();
		this.setStatic(path.join(process.cwd(), 'public'));
		//this.setUpload();
		this.setParser();
		this.setLogs();
		this.setRestful();
		console.log('finish config');
	}
	setCompress() {
		const { app } = this;
		//set compress filter
		app.use(compression({filter: (req, res)=>{
			if (req.headers['x-no-compression']) {
		    // don't compress responses with this request header
		    return false
		  }
		  // fallback to standard filter function
		  return compression.filter(req, res)
		}}));
	}
	/**
	 * [setView 模板文件视图]
	 * @param {[type]} laydir   [模板路径]
	 * @param {[type]} viewPath [视图路径]
	 */
	setView(viewPath,engine = 'html') {
		const { app } = this;
		// 设置视图路径
		app.set('views', viewPath);
		// console.log(viewPath);
		//配置handlerbar为模板引擎
		app.engine(engine, exphbs({
		  layoutsDir: viewPath,//模板路径
		  partialsDir: viewPath + '/partials/',//特殊模板
		  defaultLayout: viewPath + '/layouts/layout',//主体
		  extname: '.' + engine,//后缀
		  helpers: HandlerbarsHelper//模板解析扩展
		}));

		//设置handlerbar为模板解析引擎
		app.set('view engine', engine);
	}
	/**
	 * [setStatic 静态资源文件路径]
	 * @param {[type]} staticPath [description]
	 */
	setStatic(staticPath) {
		const { app } = this;
		// 静态资源的路径
		app.use(express.static(staticPath));
	}
	/**
	 * [setUpload 上传文件路径]
	 * @param {[type]} uploadPath [description]
	 */
	setUpload(uploadPath,callback) {
		const { app } = this;
		//图片上传工具
		// app.use(multer({
		//   //存放图片位置
		//   dest: uploadPath,
		//   //rename 函数用来修改上传后的文件名
		//   rename: function (fileoldname, filename) {
		//     return filename;
		//   }
		// }));
	}

	setLogs() {
		const { app } = this;
		const accessFilePath = path.join(config.rootPath,config.logPath,'access.log');
		try {
		  fs.ensureFileSync(accessFilePath);
		  console.log("file create success!");
		  const accessLog = fs.createWriteStream(accessFilePath,{flags : 'a'});
		  app.use(logger('dev'));
			app.use(logger({stream : accessLog}));
		} catch (err) {
		  console.error(err)
		}	  
	}
	setParser() {
		const { app } = this;
		//解析内容主体
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());
		
		//session工具
		// app.use(session({
		//   secret: config.cookieSecret,
		//   key: config.db,//cookie name
		//   cookie: {maxAge: 1000 * 60 * 60 * 8 * 1},//8小时
		//   store: new MongoStore({
		//     db: config.db,
		//     host: config.host,
		//     port: config.port
		//   })
		// }));

	}
	setRestful(){
		const { app } = this;
		app.use(res_api);
	}
	bindErrorHanlder() {
		const { app } = this;
		/**
		 * [errorHandler 错误处理方法]
		 * @param  {[type]} error [错误信息]
		 * @param  {[type]} res   [response对象，返回json数据]
		 * @return {[type]}       [description]
		 */
		app.locals.errorHandler = (res,error)=>{
			console.log(error);
			const errorMsg = typeof error == 'string' ? error : error.toString() ;
			res.api_error_status_msg = errorMsg;
  		return res.api_error();
		};
	}
}


module.exports = ParamHandler;
