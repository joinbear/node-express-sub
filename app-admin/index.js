// import middlewares
const express       = require('express');
const path          = require('path');
const config        = require('../config/');
const RouterHandler = config.RouterHandler;
const ParamHandler  = config.ParamHandler;
const rootPath      = process.cwd();
const staticPath    = path.resolve(rootPath,'app-mobile/views');
// 交易点件模板路径

// init middlewares 
const adminService = new express();
const routes        = new RouterHandler(adminService);
const paramHandler  = new ParamHandler(adminService);

// mount path 
const ekpPath       = path.resolve(__dirname,'./apps/demo/actions/');

//---------- mount routers -------------

adminService.on('mount', function (parent) {
  console.log('adminService Mounted');
  // console.log(parent); // refers to the parent app
  
  // --------- mount routers ------------
  
  // routes.mount(weixinPath,'weixin');
	routes.mount(ekpPath);
	// routes.mount(homelinkPath,'link');
	

	//---------- set view and static path ----------
	paramHandler.setView(staticPath);
});



module.exports = adminService;