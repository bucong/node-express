var qs = require('querystring');
const https = require('https');
function loginByQQ(code, cb) {
    //获取token
    let queryData = {
        grant_type: 'authorization_code',
        client_id: '101479867',
        redirect_uri: 'http://share.zrpic.com/jnwtv-live-cartoon-h5/test.html',
        client_secret: '053cf1fc1b4a07f339ff213665d5523f',
        code: code
    };
    https.get("https://graph.qq.com/oauth2.0/token?"+qs.stringify(queryData), (resp) => {
        resp.setEncoding('utf8');
        resp.on('data', (chunk) => {
            // console.log(chunk);
            if(chunk.substr(0, 12) === 'access_token'){
                let tokenArr = chunk.split('&');
                let token = tokenArr[0].split('=')[1];
                //获取openId
                // let token = "BD8440247775F6052F8FBD8C5DC8D493"; //测试案例
                https.get("https://graph.qq.com/oauth2.0/me?access_token="+token, (resp) => {
                    resp.setEncoding('utf8');
                    resp.on('data', (chunk) => {
                        // console.log(chunk);
                        let openIdLen = chunk.length;
                        let openIdObj = JSON.parse(chunk.substring(9, openIdLen - 3));
                        let openId = openIdObj.openid;
                        // console.log(openId);
                        //获取用户信息
                        let userInfoQuery = {
                            access_token: token,
                            oauth_consumer_key: '101479867',
                            openid: openId
                        };
                        https.get("https://graph.qq.com/user/get_user_info?"+qs.stringify(userInfoQuery), (resp) => {
                            resp.setEncoding('utf8');
                            resp.on('data', (chunk) => {
                                let userInfo = JSON.parse(chunk);
                                let user = {
                                    openId: openId,
                                    token: token,
                                    userInfo: userInfo
                                };
                                cb({
                                    result: 0,
                                    user: user
                                });
                            })
                        })
                        //用户信息结束
                    })
                })
                //openid结束
            }else{
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
}

module.exports = loginByQQ;