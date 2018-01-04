var express = require('express');
var router = express.Router();
var connection = require('./db');

//登录
router.post('/login',(req,res)=>{
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
});


//注册
router.post('/register',(req,res)=>{
    let user=req.body;
    console.log('注册');
    console.log(user.name);
    console.log(user.pass);
    connection.query('select * from user where username="'+user.name+'"', function (error, result) {
        if (error) throw error
        else{
            if(result.length>0){
                res.send({
                    msg:'您输入的用户名已存在！'
                })
            }else{
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
            }
        }
    });
});

//用户列表
router.use('/userlist',(req,res)=>{
    console.log('用户列表');
    connection.query('select id,username,userpass from user', function (error, result) {
        if (error) throw error
        else{
            res.status(200).json(result);
        }
    });
});

//删除用户
router.use('/del_user',(req,res)=>{
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
});

//修改密码
router.use('/change_pass',(req,res)=>{
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
});

module.exports = router;
