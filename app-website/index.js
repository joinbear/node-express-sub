// import middlewares
const express        = require('express');
const path           = require('path');
const config         = require('../config/');
const RouterHandler  = config.RouterHandler;
const ParamHandler   = config.ParamHandler;
const rootPath       = process.cwd();
const staticPath     = path.resolve(rootPath,'app-website/views');
// 图片打印缓存路径
const cachePath      = path.resolve(rootPath,'runtime/picture/');

// init middlewares 
const websiteService = new express();
const routes         = new RouterHandler(websiteService);
const paramHandler   = new ParamHandler(websiteService);

// mount path 
// const weixinPath     = path.resolve(__dirname,'./apps/weixin/actions/');
const ekpPath        = path.resolve(__dirname,'./apps/ecen/actions/');
// const homelinkPath   = path.resolve(__dirname,'./apps/homelink/actions/');

//---------- mount routers -------------

websiteService.on('mount', function (parent) {
  console.log('websiteService Mounted');
  // console.log(parent); // refers to the parent app
  
  // --------- mount routers ------------
  
  // routes.mount(weixinPath,'weixin');
	routes.mount(ekpPath);
	// routes.mount(homelinkPath,'link');
	

	//---------- set view and static path ----------
	paramHandler.setView(staticPath);
	paramHandler.setStatic(staticPath);
	paramHandler.setStatic(cachePath);
});



module.exports = websiteService;