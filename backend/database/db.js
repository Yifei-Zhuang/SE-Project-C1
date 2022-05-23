let mysql = require('mysql')
let config = {
    host: 'localhost',
    user: 'root',
    password: 'xx', // 你的数据库密码
    port: '3306',
    database: 'StockTrading'
};

var pool = mysql.createPool(config);
var MySQLquery = function (Sql, SqlParams, callback) {
    pool.getConnection(function (error, connect) {
        if (error) {
            console.log("获取数据库实例失败");
            callback(error, null, null);
        } else {
            connect.query(Sql, SqlParams, function (err, results, fields) {
                callback(err, results, fields);
            });
            connect.release();
        }
    });
};

module.exports = MySQLquery;
