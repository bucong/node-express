let express = require('express');
let router = express.Router();
let connection = require('./utils/db');
let fetch = require('./utils/fetch');
const loginByQQ = require('./utils/loginByQQ'); //QQ授权登录封装
const sendVerificationCode = require('./utils/verificationCode'); //发送手机验证码封装

//获取短信验证码
router.post('/get_check_msg', (request, res) => {
  let user = request.body;
  console.log('短信验证码');
  console.log(user.mobile);
  //查看手机号是否注册过
  connection.query('select verificationTime from user where mobile="' + user.mobile + '"', (error, result) => {
    if (error) throw error;
    else {
      //生成短信验证码
      let verificationCode = "";
      let codeLength = 6;//验证码的长度
      let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);//随机数
      for (let i = 0; i < codeLength; i++) {//循环操作
        let index = Math.floor(Math.random() * 10);//取得随机数的索引（0~35）
        verificationCode += random[index];//根据索引取得随机数加到code上
      }
      console.log('生成的随机验证码是：' + verificationCode);
      let nowTime = new Date().getTime(); //当前时间

      if (result.length > 0) {
        //注册过，查看验证码前一次发送时间是否超过1分钟
        let timeInterval = ((nowTime - result[0].verificationTime)/1000).toFixed(0);
        console.log('用户：'+user.mobile+',两次验证码时间间隔是'+timeInterval);
        if(timeInterval < 60){
          res.send({
            code: 1,
            result: {},
            msg: '距离上一次发送验证码时间太短'
          })
        }else{
          let sql = 'update user set verificationCode=?,verificationTime=? where mobile=?';
          let sqlData = [verificationCode, nowTime, user.mobile];
          connection.query(sql, sqlData, function (error, result) {
            if (error) {
              throw error
            }
            else {
              sendVerificationCode(user.mobile, verificationCode, (res)=>{});
              res.send({
                code: 0,
                result: {
                  success: true
                },
                msg: ''
              })
            }
          });
        }
      } else {
        //没注册过生成新纪录，保存手机号，验证码，发送时间
        let sql = 'insert into user(mobile, verificationCode, verificationTime)  value(?,?,?)';
        let sqlData = [user.mobile, verificationCode, nowTime];
        connection.query(sql, sqlData, function (error, result) {
          if (error) {
            throw error
          }
          else {
            sendVerificationCode(user.mobile, verificationCode, (res)=>{});
            res.send({
              code: 0,
              result: {
                success: true
              },
              msg: ''
            })
          }
        });
      }
    }
  });
});

//QQ授权登录
router.post('/registerByQQ', (req, res) => {
  let user = req.body;
  console.log('QQ登录');
  console.log(user.code);
  loginByQQ(user.code, (resp) => {
    console.log(resp);
    if (resp.result === 0) {
      connection.query('select gender,headImg,id,mobile,userName from user where openIdQQ="' + resp.user.openId + '"', function (error, result) {
        if (error) throw error;
        else {
          if (result.length > 0) {
            res.send({
              code: 0,
              result: result[0],
              msg: ''
            })
          } else {
            let userInfo = resp.user.userInfo;
            let sql = 'insert into user(openIdQQ, userName, headImg, gender) value(?,?,?,?)';
            let sqlData = [resp.user.openId, userInfo.nickname, userInfo.figureurl_2, userInfo.gender];
            connection.query(sql, sqlData, function (error, result) {
              if (error) {
                throw error
              }
              else {
                connection.query('select gender,headImg,id,mobile,userName from user where openIdQQ="' + resp.user.openId + '"', function (error, result) {
                  if (error) throw error;
                  else {
                    if (result.length > 0) {
                      res.send({
                        code: 0,
                        result: result[0],
                        msg: ''
                      })
                    } else {
                      res.send({
                        code: 1,
                        result: {},
                        msg: '登录失败'
                      })
                    }
                  }
                })
              }
            });
          }
        }
      });
    } else {
      res.send({
        code: 1,
        result: {},
        msg: resp.msg
      });
    }
  });
});

//注册
router.post('/register', (req, res) => {
  let user = req.body;
  console.log('注册');
  console.log(user.checkNum);
  console.log(user.mobile);
  connection.query('select verificationCode from user where mobile="' + user.mobile + '"', (error, result) => {
    if (error){
      res.send({
        code: 1,
        result: {},
        msg: '手机号不存在'
      });
      throw error;
    } else {
      console.log(result[0].verificationCode);
      if(result[0].verificationCode === user.checkNum){
        connection.query('select gender,headImg,id,mobile,userName from user where mobile="' + user.mobile + '"', function (error, result) {
          if (error) throw error;
          else {
            if (result.length > 0) {
              req.cookies.set('userInfo', JSON.stringify({
                id: result[0].id,
                name: result[0].mobile
              }));
              res.send({
                code: 0,
                result: result[0],
                msg: ''
              })
            } else {
              res.send({
                code: 1,
                result: {},
                msg: '注册失败'
              })
            }
          }
        })
      }else{
        res.send({
          code: 1,
          result: {},
          msg: '验证码填写错误'
        })
      }
    }
  });
});

//退出登录
router.get('/logout', (req, res) => {
  console.log('退出登录');
  req.cookies.set('userInfo', null);
  res.send({
    code: 0,
    result: {},
    msg: ''
  })
});
//用户列表
router.use('/userlist', (req, res) => {
  console.log('用户列表');
  connection.query('select * from user', function (error, result) {
    if (error) throw error
    else {
      res.send({
        code: 0,
        result: result,
        msg: ''
      })
    }
  });
});

//删除用户
router.use('/del_user', (req, res) => {
  let user = req.query;
  console.log('删除');
  console.log(user.name);
  let sql = 'delete from user where username="' + user.name + '"';
  connection.query(sql, function (error, result) {
    if (error) {
      throw error
    }
    else {
      res.send({
        code: 0,
        result: 'success',
        msg: ''
      })
    }
    console.log(result);
  });
});

//修改密码
router.use('/change_pass', (req, res) => {
  let user = req.query;
  console.log('修改密码');
  console.log('姓名：' + user.name);
  console.log('新密码：' + user.newpass);
  let sql = 'update user set userpass="' + user.newpass + '" where username="' + user.name + '"';
  connection.query(sql, function (error, result) {
    if (error) {
      throw error
    }
    else {
      res.send({
        code: 0,
        result: 'success',
        msg: ''
      })
    }
  });
});

module.exports = router;
