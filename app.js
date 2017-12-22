const express = require('express');
const server = express();
const mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mysql',
  database : 'node'
});
connection.connect();
//登录
server.use('/login',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.query;
	console.log('登录')
	console.log(user.name);
	console.log(user.pass);
	connection.query('select * from user', function (error, result) {
		if (error) throw error
		else{
			let loginRes=0;
			for(let item of result){
				if(user.name==item.username && user.pass==item.userpass){
					loginRes++;
				}
			}
			res.send({
				result: loginRes
			})
		}
	});
})

//注册
server.use('/register',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.query;
	console.log('注册');
	console.log(user.name);
	console.log(user.pass);
	let sql='insert into user(username,userpass)  value(?,?)';
	let sqlData=[user.name,user.pass];
	connection.query(sql,sqlData, function (error, result) {
		if (error) {throw error}
		else{
			res.send({
				result: 'success'
			})
		}
		console.log(result);
	});
})

//用户列表
server.use('/userlist',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	console.log('用户列表');
	connection.query('select * from user', function (error, result) {
		if (error) throw error
		else{
			res.send({
				result: result
			})
		}
	});
})
server.use(express.static('./'));

//connection.end();

server.listen(3000,function(err){
    if(err){
        throw err;//抛出异常，终止程序
    }
    console.log("myserver is started at port:3000");
});