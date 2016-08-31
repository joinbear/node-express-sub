// import middlewares
const express       = require('express');
const path          = require('path');
const raml2html     = require('raml2html');
const config        = require('../config/');
const RouterHandler = config.RouterHandler;
const ParamHandler  = config.ParamHandler;

// init middlewares 
const apiService    = new express();
const routes        = new RouterHandler(apiService);
const params        = new ParamHandler(apiService);

// mount path 
const ekpPath       = path.resolve(__dirname,'./apps/demo/actions/');

params.bindErrorHanlder();

// api doc router
const template      = raml2html.getDefaultConfig();
//---------- mount routers -------------

apiService.on('mount', function (parent) {
	// apiService.locals.errorHandler = parent.locals.errorHandler;
	routes.mount(ekpPath);
	// console.log(apiService.locals.errorHandler);
  // console.log('apiService Mounted');
  // console.log(parent); // refers to the parent app
});


//---------- api document --------------
apiService.use('/api-doc/:api',(req,res)=>{
	// console.log(process.cwd() + '/document/'+ req.params.api +'.raml');
	// console.log(configWithDefaultTemplates);
	// source can either be a filename, url, file contents (string) or parsed RAML object
	raml2html.render(process.cwd() + '/document/'+ req.params.api +'.raml', template).then((result)=> {
		res.end(result);
	  // Save the result to a file or do something else with the result
	}, (error)=> {
	  // Output error
	  res.end(error.toString());
	});
});


module.exports = apiService;