var http = require('http');
var qs = require('querystring');
function fetch(method, url, data, cb){
    if(method === 'get'){
        http.get(url + '?' + qs.stringify(data), function(res){
            res.setEncoding('utf8');
            res.on('data',(data)=>{
                cb(data);
            });
            res.on('end', () => {});
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }else{
        //POST请求
        var postData = qs.stringify(data);
        var options = {
            hostname: host,
            port: 80,
            path: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            var resData = [];
            res.on('data', function (chunk) {
                resData.push(chunk);
                cb(resData);
            });
            res.on('end', function() {
                var data = resData.join("");
                console.log(data);
            })
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
// 发送请求
        req.write(postData);
        req.end();
    }
}

module.exports = fetch;