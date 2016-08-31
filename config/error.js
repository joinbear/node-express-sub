const fs     = require('fs-extra');
const path   = require('path');
const config = require('./config');

/**
 * error hanlder middleware object
 */
class ErrorHandler {
	constructor(app) {
		this.app = app;
	}
	// initialization the middleware
	init() {
		this.handleNotFound();
		this.writeLogs();
		this.handleError();
		console.log('end');
	}
	// catch 404 and forward to error handler
	handleNotFound() {
		const { app } = this;
		app.use(function(req, res, next){
			const err = new Error('Not Found');
		  err.status = 404;
		  next(err);
		})
	}
	// write error logs to file
	writeLogs() {
		const { app } = this;
		app.use(function (err, req, res, next){
			const meta = '[' + new Date() + '] ' + req.url + '\n';
			const errorFilePath = path.join(config.rootPath,config.logPath,'error.log');
			try {
			  fs.ensureFileSync(errorFilePath);
			  console.log("error file create success!")
			  const errorLog = fs.createWriteStream(errorFilePath,{flags : 'a'});
			  errorLog.write(meta + err.stack + '\n');
			  next();
			} catch (err) {
			  console.error(err)
			}
		});
	}
	// catch error and render to view
	handleError() {
		const { app } = this;
		app.use(function(err, req, res, next) {
		  res.status(err.status || 500);
		  res.json({
		    message: err.message,
		    code: err.status
		  });
		});
	}
}

module.exports = ErrorHandler;