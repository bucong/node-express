//公共方法
/**
 * 判断浏览器类型
 */
function is_weixn_qq() {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return "wx"; //是微信
  } else if (ua.match(/QQ/i) == "qq") {
    return "qq"; //是QQ
  } else {
    return false; //其他浏览器
  }
}

/**
 * 对LocalStorage 进行 存， 取， 移除 操作
 * method: 'get' , 'set' , 'remove'
 */
function handleLocalStorage(method, key, value) {
  switch (method) {
    case 'get' : {
      let temp = window.localStorage.getItem(key);
      if (temp) {
        return temp
      } else {
        return false
      }
    }
    case 'set' : {
      window.localStorage.setItem(key, value);
      break
    }
    case 'remove': {
      window.localStorage.removeItem(key);
      break
    }
    default : {
      return false
    }
  }
}

/**
 * 获取当前时间
 */
function now_part_time() {
  let date = new Date();
  // let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  // let s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
  return (M + '-' + D + ' ' + H + ':' + m);
}

/**
 * 获取当前时间（全）
 */
function now_time() {
  let date = new Date();
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s);
}

function fetch(method, url, data, cb) {
  if (method === 'get') {
    $.ajax({
      type: "get",
      url: url,
      data: data,
      async: true,
      dataType: 'JSON',
      success: (res) => {
        console.log(res);
        if (res.code === 0) {
          cb(res.result);
        } else {
          alert(res.msg);
        }
      }, error: function (res) {
        console.log(res)
      }
    });
  } else {
    $.ajax({
      type: "post",
      url: url,
      data: data,
      async: true,
      dataType: 'JSON',
      success: (res) => {
        console.log(res);
        if (res.code === 0) {
          cb(res.result);
        } else {
          alert(res.msg);
        }
      }, error: function (res) {
        console.log(res)
      }
    });
  }
}

/**
 * 获取url问号后参数
 */
function getUrlParam(name) {
  let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(window.location.href)) {
    return unescape(RegExp.$2.replace(/\+/g, " "))
  } else {
    return false;
  }
}


//获取短信验证码
$('.get-check').click(function () {
  if ($('#mobile').val().length != 11) {
    alert('手机号格式不正确！');
    return false;
  }
  $('.get-check').attr('disabled', 'disabled');
  var time = 60;
  timeSet = setInterval(function () {
    time--;
    if (time <= 0) {
      $('.get-check').html('免费获取短信验证码');
      $('.get-check').removeAttr('disabled');
      clearInterval(timeSet);
    } else {
      $('.get-check').html('再次发送剩余：' + time + 's');
    }
  }, 1000);
  $.ajax({
    type: "post",
    url: "/user/get_check_msg",
    data: {
      mobile: $('#mobile').val()
    },
    async: true,
    dataType: 'JSON',
    success: function (res) {
      console.log(res);
      if (res.code == 0) {
        alert('短信验证码是' + res.result);
      } else {
        alert('获取失败！')
      }
    }, error: function (res) {
      console.log(res)
    }
  });
  return false;
});

//注册
function register() {
  if ($('#mobile').val() == '' || $('#checkNum').val() == '') {
    alert('请将信息填写完整！');
    return false;
  }
  $.ajax({
    type: "post",
    url: "/user/register",
    data: {
      name: $('#username').val(),
      mobile: $('#mobile').val(),
      checkNum: $('#checkNum').val()
    },
    async: true,
    dataType: 'JSON',
    success: function (res) {
      $('.alert').hide();
      console.log(res);
      if (res.code == 0) {
        $('.alert-success').show();
        handleLocalStorage('set', 'userInfo', JSON.stringify(res.result));
        setTimeout(function () {
          window.location.href = "/";
        }, 1000)
      } else {
        $('.alert-danger').show();
        alert(res.msg);
      }
    }, error: function (res) {
      console.log(res)
    }
  });
  return false;
}

//登录
function login() {
  console.log($('#username').val());
  console.log($('#userpass').val());
  if ($('#username').val() == '' || $('#userpass').val() == '') {
    alert('用户名和密码不能为空！');
    return false;
  } else if ($('#username').val().legth < 6 || $('#userpass').val().legth < 6) {
    alert('用户名和密码不得少于6位！');
    return false;
  }
  $.ajax({
    type: "post",
    url: "/user/login",
    data: {
      name: $('#username').val(),
      pass: $('#userpass').val()
    },
    headers: {
      Accept: "application/json; charset=utf-8"
    },
    async: true,
    dataType: 'JSON',
    success: function (res) {
      $('.alert').hide();
      console.log(res);
      if (res.result == '1') {
        $('.alert-success').show();
        setTimeout(function () {
          window.location.href = "/";
        }, 2000)
      } else {
        $('.alert-danger').show();
      }
    }, error: function (res) {
      console.log(res)
    }
  });
  return false;
}

//QQ登录
$('.login-by-qq').click(function () {
  window.location.href = "https://graph.qq.com/oauth2.0/authorize?client_id=101479867&redirect_uri=http%3a%2f%2fshare.zrpic.com%2fjnwtv-live-cartoon-h5%2ftest.html&response_type=code&scope=get_user_info&state=http%3a%2f%2foffice.zrpic.com%2fregister";
});
//退出登录
$('.logout').click(function () {
  handleLocalStorage('remove', 'userInfo');
  $.ajax({
    type: "get",
    url: "/user/logout",
    data: '',
    async: true,
    dataType: 'JSON',
    success: function (res) {
      console.log(res);
      if (res.code == 0) {
        window.location.reload()
      } else {
        alert('退出失败');
      }
    }, error: function (res) {
      console.log(res);
    }
  });
});

//删除用户
$('.index').on('click', '.del', function () {
  var delname = $(this).prev().prev().html();
  if (confirm('确定要删除该用户吗？')) {
    $.ajax({
      type: "get",
      url: "/user/del_user",
      data: {
        name: delname
      },
      async: true,
      dataType: 'JSON',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          window.location.reload()
        } else {
          alert('删除失败');
        }
      }, error: function (res) {
        console.log(res);
      }
    });
  }
});

//修改密码
var changePassName = '';
$('.index').on('click', '.change-pass', function () {
  console.log($(this).prev().html());
  changePassName = $(this).prev().html();
});
$('.change-val').click(function () {
  if ($('#newpass').val().length < 6) {
    alert('密码长度不得少于6位！');
    return false;
  }
  $.ajax({
    type: "get",
    url: "/user/change_pass",
    data: {
      name: changePassName,
      newpass: $('#newpass').val()
    },
    async: true,
    dataType: 'JSON',
    success: function (res) {
      console.log(res);
      if (res.code == 0) {
        alert('修改成功')
      } else {
        alert('修改失败');
      }
    }, error: function (res) {
      console.log(res);
    }
  });
});

//存储新闻
$('.sub-news').click(function () {
  if ($('.news #article-name').val() == '') {
    alert('请输入文章标题！');
    return false;
  } else if ($('.news #editor .w-e-text').html().length == 11) {
    alert('请输入文章内容！');
    return false;
  } else {
    $.ajax({
      type: "post",
      url: "/news/news_insert",
      data: {
        name: $('.news #article-name').val(),
        type: $('.news #type').val(),
        content: $('.news #editor .w-e-text').html()
      },
      async: true,
      dataType: 'JSON',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          alert('上传成功')
        } else {
          alert(res.msg);
        }
      }, error: function (res) {
        console.log(res);
      }
    });
  }
});

//修改新闻
$('.change-news').click(function () {
  if ($('.news #article-name').val() == '') {
    alert('请输入文章标题！');
    return false;
  } else if ($('.news #editor .w-e-text').html().length == 11) {
    alert('请输入文章内容！');
    return false;
  } else {
    $.ajax({
      type: "post",
      url: "/news/news_change",
      data: {
        id: GetUrl("id"),
        name: $('.news #article-name').val(),
        type: $('.news #type').val(),
        content: $('.news #editor .w-e-text').html()
      },
      async: true,
      dataType: 'JSON',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          alert('修改成功')
        } else {
          alert('修改失败');
        }
      }, error: function (res) {
        console.log(res);
      }
    });
  }
});

//上传首页banner
$('#banner').change(function () {
  var imgUpload = $(this)[0];
  console.log(imgUpload.type)
  // if(!/image\/\w+/.test(imgUpload.type)){
  //     alert('上传的文件必须为图片。');
  //     return false;
  // }
  var formData = new FormData($('#bannerForm')[0]);
  $.ajax({
    url: '/banner_set',
    type: 'POST',
    data: formData,
    dataType: 'json',
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (res) {
      console.log(res)
      if (res.code == 0) {
        window.location.reload();
      }
    }, error: function (res) {
      console.log(res)
    }
  })
});

//删除首页banner
$('.banner-list').on('click', '.del-banner', function () {
  console.log($(this).prev().attr('src'));
  if (confirm('确定要删除该图吗？')) {
    $.ajax({
      type: 'post',
      url: '/banner_del',
      data: {
        file: $(this).prev().attr('src')
      },
      async: true,
      dataType: 'JSON',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          window.location.reload();
        }
      }, error: function (res) {
        console.log(res);
      }
    });
  }
});