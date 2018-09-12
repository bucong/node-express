var qs = require('querystring');
const http = require('http');

//发送手机验证码
function sendVerificationCode(mobile, code, cb) {
  let data = {
    phone: mobile,
    apikey: '3614234760a278548889410472dd3185',
    tplId: '1',
    content: '注册验证码:' + code + '，请勿泄露。如不是本人发送，请勿理睬！'
  };//需要提交的数据
  http.get('http://api.sodocloud.com/sms/send_msg?' + qs.stringify(data), function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
      console.log('发送验证码请求：');
      console.log(data);
    });
    res.on('end', (data) => {
      //console.log(data);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

module.exports = sendVerificationCode;