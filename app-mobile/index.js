// import middlewares
const express       = require('express');
const path          = require('path');
const config        = require('../config/');
const RouterHandler = config.RouterHandler;
const ParamHandler  = config.ParamHandler;
const rootPath      = process.cwd();
const staticPath    = path.resolve(rootPath,'app-mobile/views');

// init middlewares 
const mobileService = new express();
const routes        = new RouterHandler(mobileService);
const paramHandler  = new ParamHandler(mobileService);

// mount path 
const ekpPath       = path.resolve(__dirname,'./apps/demo/actions/');

//---------- mount routers -------------

mobileService.on('mount', function (parent) {
  console.log('mobileService Mounted');
  // console.log(parent); // refers to the parent app
  
  // --------- mount routers ------------
  
  // routes.mount(weixinPath,'weixin');
	routes.mount(ekpPath);
	// routes.mount(homelinkPath,'link');
	

	//---------- set view and static path ----------
	paramHandler.setView(staticPath);
});



module.exports = mobileService;