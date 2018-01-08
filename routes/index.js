var express = require('express');
var router = express.Router();
var fs = require('fs');
// var path = require('path');
var connection = require('./db');
var multiparty = require('connect-multiparty');

/* GET home page. */
router.post('/banner',multiparty(),function(req, res,next) {
      var posterData = req.files.imgFile;
      var filePath = posterData.path;
      var originalFilename = posterData.originalFilename
      if (originalFilename) {
          fs.readFile(filePath, function(err, data) {
              var timestamp = Date.now();//当前时间戳
              var type = posterData.type.split('/')[1];//图片类型
              var posterUrl = 'images/'+timestamp + '.' + type;//回发路径和名称
              var poster = 'public/images/'+timestamp + '.' + type;//图片保存路径和名称
              fs.writeFile(poster, data, function(err) {
                  if(err)
                      throw err;
                  console.log('写入图片成功');
                  //回发图片路径
                  res.send({
                      url: posterUrl
                  })
              })
          })
      }else{
          res.send('上传失败');
      }

});
module.exports = router;
