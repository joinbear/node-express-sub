const mysql = require('mysql');
const co    = require('co');
/**
 * mysql 数据库连接
 */
class MysqlDb {
	/**
	 * [constructor 构造函数]
	 * @param  {Object} config [数据库连接参数]
	 * @return {[type]}        [description]
	 */
	constructor(config = {  
			host            : 'localhost',
      user            : 'root',
      password        : '123456',
      database        : 'weixin',
      connectionLimit : 1
    }) {
    this.pool = mysql.createPool(config);
  }
  executeAsyn(conn,sql) {
    return new Promise((resolve,reject)=>{
      const query = conn.query(sql,(err, rows, fields)=>{
        if(err){
          console.error(err);
          reject(err);
        }
        resolve(rows);
        conn.release();
      });
      console.log('the query sql is------->'+query.sql);
    })
  }
  /**
   * [select 查询方法]
   * @param  {[type]}   sql      [需要执行sql]
   * @return {[type]}            [description]
   */
  select(sql) {

    const { connection , pool , executeAsyn } = this;
    return co(function *(){
      const conn   = yield connection(pool);
      const result = yield executeAsyn(conn,sql);
      return result;
    }).catch((error)=>{
      console.log(error);
    });

  }
  connection(pool) {

    return new Promise((resolve, reject)=>{
      pool.getConnection((err, connection)=> {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(connection);
      });
    });

  }
  /**
   * [delete 删除方法]
   * @param  {[type]}   sql      [删除sql]
   * @return {[type]}            [description]
   */
  delete(sql) {
    this.select(sql);
  }
  /**
   * [insert 插入数据]
   * @param  {[type]}   table      [需要插入数据的表]
   * @param  {[type]}   conditions [条件]
   * @return {[type]}              [description]
   */
  insert(table,conditions) {
    const { connection , pool } = this;
    return co(function *(){
      const conn   = yield connection(pool);
      const result = yield new Promise((resolve,reject)=>{
        const query = conn.query('INSERT INTO '+table+' SET ?',conditions,(err, rows, fields)=>{
          if(err){
            console.error(err);
            reject(err);
          }
          resolve(rows);
          conn.release();
        });
        console.log(query.sql);
      });
      return result;
    }).catch((error)=>{
      console.log(error);
    });  
  }
}

module.exports =  MysqlDb;