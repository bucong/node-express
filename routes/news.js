var express = require('express');
var router = express.Router();
var connection = require('./db');

//插入文章
router.post('/news_insert',(req,res)=>{
    let news=req.body;
    console.log('插入文章');
    console.log(news.name);
    console.log(news.type);
    console.log(news.content);
    var datetime=Date.parse(new Date());
    console.log(datetime);
    let sql='insert into news(type,name,content,datetime)  value(?,?,?,?)';
    let sqlData=[news.type,news.name,news.content,datetime];
    connection.query(sql,sqlData, function (error, result) {
        if (error) throw error
        else{
            res.send({
                result: 'success'
            })
        }
    });
});

//文章列表
router.get('/news_list',(req,res)=>{
    console.log('文章列表');
    let sql='select id,name,type from news';
    connection.query(sql, function (error, result) {
        if (error) throw error
        else{
            res.status(200).json(result);
        }
    });
});
//文章内容
router.get('/news_detail',(req,res)=>{
    let news=req.query;
    console.log('文章详情');
    console.log(news.id);
    let sql='select * from news where id='+news.id;
    connection.query(sql, function (error, result) {
        if (error) throw error
        else{
            res.status(200).json(result[0]);
        }
    });
});

//修改文章
router.post('/news_change',(req,res)=>{
    let news=req.body;
    console.log('修改文章');
    console.log(news.id);
    console.log(news.name);
    console.log(news.type);
    console.log(news.content);
    var datetime=Date.parse(new Date());
    console.log(datetime);
    let sql='update news set name="'+news.name+'",type="'+news.type+'",content="'+news.content+'",datetime="'+datetime+'" where id='+news.id;
    console.log(sql)
    connection.query(sql, function (error, result) {
        if (error) throw error
        else{
            res.send({
                result: 'success'
            })
        }
    });
});


module.exports = router;
