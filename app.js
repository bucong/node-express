const express = require('express');
const server = express();
const bodyParser = require('body-parser');//post接收参数
const mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mysql',
  database : 'node'
});
connection.connect();

//把post请求的参数转换为json对象
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));

//登录
server.post('/login',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.body;
	console.log('登录');
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
server.post('/register',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.body;
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
	});
})

//用户列表
server.use('/userlist',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	console.log('用户列表');
	connection.query('select id,username,userpass from user', function (error, result) {
		if (error) throw error
		else{
			res.status(200).json(result);
		}
	});
})

//删除用户
server.use('/del_user',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.query;
	console.log('删除');
	console.log(user.name);
	let sql='delete from user where username="'+user.name+'"';
	connection.query(sql, function (error, result) {
		if (error) {throw error}
		else{
			res.send({
				result: 'success'
			})
		}
		console.log(result);
	});
})

//修改密码
server.use('/change_pass',(req,res)=>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	let user=req.query;
	console.log('修改密码');
	console.log('姓名：'+user.name);
	console.log('新密码：'+user.newpass);
	let sql='update user set userpass="'+user.newpass+'" where username="'+user.name+'"';
	connection.query(sql, function (error, result) {
		if (error) {throw error}
		else{
			res.send({
				result: 'success'
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