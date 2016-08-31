const oracledb = require('oracledb');
const co       = require('co');
/**
 * oracle 数据库连接
 */
class OracleDb {
	/**
	 * [constructor 构造函数]
	 * @param  {Object} config [指定默认数据库连接]
	 * @return {[type]}        [description]
	 */
	constructor( config = {
		user          : "dbname",
	  password      : "passwor",
	  connectString : "host"
	}) {
		this.dbConfig = config;
	}
	/**
	 * [execute 函数执行方法]
	 * @param  {[type]}   sql      [执行sql]
	 * @param  {[type]}   data     [配置数据对象，详情查看https://github.com/oracle/node-oracledb/]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
  executeAsyn(sql,bindParams,connection,rows) {
  	return new Promise((resolve, reject)=> {
      connection.execute(sql, bindParams, (err, result)=> {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        rows ? resolve(result.rows) : resolve(result);
      });
    });
  }
  /**
   * [execute 外部调用执行方法]
   * @param  {[type]} sql        [sql语句]
   * @param  {[type]} bindParams [参数配置]
   * @return {[type]}            [description]
   */
  execute(sql,bindParams,rows = true) {
		const { connection , executeAsyn , dbConfig } = this;
		console.log('the sql is :------->'+sql);
  	return co(function *() {
			const conn   = yield connection(dbConfig);
			const result = yield executeAsyn(sql, bindParams , conn,rows);
			conn.release();
	    return result;
		}).catch((error)=>{
			console.log(error);
		});
  }
  // 链接数据库
  connection(config) {
  	return new Promise((resolve, reject)=>{
      oracledb.getConnection(config,(err, connection)=> {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(connection);
      });
    });
  }
}

module.exports = OracleDb;