// import middlewares
const express        = require('express');
const path           = require('path');
const config         = require('./config/');
const ParamHandler   = config.ParamHandler;
const ErrorHandler   = config.ErrorHandler;
const Filter         = config.Filter;

// init middlewares 
const app            = new express();
const param          = new ParamHandler(app);
const error          = new ErrorHandler(app);
const filter         = new Filter(app);
const apiService     = require('./app-service/');
const websiteService = require('./app-website/');
const mobileService  = require('./app-mobile/');
const adminService  = require('./app-admin/');


//---------params config -----------
param.init();

//---------- filter -------------------
filter.init();

//---------- mount sub-app routers -------------
app.use('/api', apiService);
app.use('/website', websiteService);
app.use('/mobile', mobileService);
app.use('/admin', adminService);



//--------- handle error ---------------
error.init();

module.exports = app;