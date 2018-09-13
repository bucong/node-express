var qs = require('querystring');
const https = require('https');

function loginByQQ(code, cb) {
  new Promise((resolve)=>{
    //第一步：获取token
    let queryData = {
      grant_type: 'authorization_code',
      client_id: '101479867',
      redirect_uri: 'http://share.zrpic.com/jnwtv-live-cartoon-h5/test.html',
      client_secret: '053cf1fc1b4a07f339ff213665d5523f',
      code: code
    };
    https.get("https://graph.qq.com/oauth2.0/token?" + qs.stringify(queryData), (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => {
        // console.log(chunk);
        if (chunk.substr(0, 12) === 'access_token') {
          let tokenArr = chunk.split('&');
          let token = tokenArr[0].split('=')[1];
          resolve(token);
        } else {
          console.log(chunk);
          let errMsgLen = chunk.length;
          let errMsgObj = JSON.parse(chunk.substring(9, errMsgLen - 3));
          let errMsg = errMsgObj.error_description;
          cb({
            result: 1,
            msg: errMsg
          });
        }
      });
    })
  }).then((token)=>{
    // 第二步：获取openId
    return new Promise((resolve)=>{
      https.get("https://graph.qq.com/oauth2.0/me?access_token=" + token, (resp) => {
        resp.setEncoding('utf8');
        resp.on('data', (chunk) => {
          // console.log(chunk);
          let openIdLen = chunk.length;
          let openIdObj = JSON.parse(chunk.substring(9, openIdLen - 3));
          let openId = openIdObj.openid;
          console.log(openId);
          resolve({
            openId: openId,
            token: token
          });
        })
      })
    })
  }).then((val)=>{
    // 第三步：获取用户信息
    console.log(val);
    let userInfoQuery = {
      access_token: val.token,
      oauth_consumer_key: '101479867',
      openid: val.openId
    };
    https.get("https://graph.qq.com/user/get_user_info?" + qs.stringify(userInfoQuery), (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => {
        let userInfo = JSON.parse(chunk);
        let user = {
          openId: val.openId,
          token: val.token,
          userInfo: userInfo
        };
        cb({
          result: 0,
          user: user
        });
      })
    })
  });
}

module.exports = loginByQQ;