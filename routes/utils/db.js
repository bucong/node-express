const mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Bucong0934',
    database : 'node'
});
connection.connect();

module.exports = connection;