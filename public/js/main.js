//获取短信验证码
$('.get-check').click(function(){
    if($('#mobile').val().length!=11){
        alert('手机号格式不正确！');
        return false;
    }
    $.ajax({
        type:"post",
        url:"/user/get_check_msg",
        data:{
            mobile:$('#mobile').val()
        },
        async:true,
        dataType:'JSON',
        success:function(res){
            console.log(res);
			alert('短信验证码是'+res.checkCode);
        },error:function(res){
            console.log(res)
        }
    });
    return false;
});
//注册
function register(){
    if($('#username').val()==''||$('#userpass').val()==''||$('#mobile').val()==''||$('#checkNum').val()==''){
        alert('请将信息填写完整！');
        return false;
    }
    $.ajax({
        type:"post",
        url:"/user/register",
        data:{
            name:$('#username').val(),
            pass:$('#userpass').val(),
            mobile:$('#mobile').val(),
            checkNum:$('#checkNum').val()
        },
        async:true,
        dataType:'JSON',
        success:function(res){
            $('.alert').hide();
            console.log(res);
            if(res.result=='success'){
                $('.alert-success').show();
                setTimeout(function(){
                    window.location.href="login.html";
                },2000)

            }else{
                $('.alert-danger').show();
                alert(res.msg);
            }
        },error:function(res){
            console.log(res)
        }
    });
    return false;
}

//登录
function login(){
	$.ajax({
		type:"post",
		url:"/user/login",
		data:{
			name:$('#username').val(),
			pass:$('#userpass').val()
		},
		async:true,
		dataType:'JSON',
		success:function(res){
			$('.alert').hide();
			console.log(res);
			if(res.result=='1'){
				$('.alert-success').show();
				setTimeout(function(){
					window.location.href="list.html";
				},2000)
			}else{
				$('.alert-danger').show();
			}
		},error:function(res){
			console.log(res)
		}
	});
	return false;
}


//删除
$('.index').on('click','.del',function(){
	var delname=$(this).prev().prev().html();
	$.ajax({
		type:"get",
		url:"/user/del_user",
		data:{
			name:delname
		},
		async:true,
		dataType:'JSON',
		success:function(res){
			console.log(res);
			if(res.result=='success'){
				window.location.reload()
			}else{
				alert('删除失败');
			}
		},error:function(res){
			console.log(res);
		}
	});
});

//修改密码
var changePassName='';
$('.index').on('click','.change-pass',function(){
	console.log($(this).prev().html());
	changePassName=$(this).prev().html();
});
$('.change-val').click(function(){
	$.ajax({
		type:"get",
		url:"/user/change_pass",
		data:{
			name:changePassName,
			newpass: $('#newpass').val()
		},
		async:true,
		dataType:'JSON',
		success:function(res){
			console.log(res);
			if(res.result=='success'){
				alert('修改成功')
			}else{
				alert('修改失败');
			}
		},error:function(res){
			console.log(res);
		}
	});
});

//存储新闻
$('.sub-news').click(function(){
    if($('.news #article-name').val()==''){
        alert('请输入文章标题！');
        return false;
    }else if($('.news #editor .w-e-text').html().length==11){
        alert('请输入文章内容！');
        return false;
    }else{
        $.ajax({
            type:"post",
            url:"/news/news_insert",
            data:{
                name:$('.news #article-name').val(),
                type:$('.news #type').val(),
                content: $('.news #editor .w-e-text').html()
            },
            async:true,
            dataType:'JSON',
            success:function(res){
                console.log(res);
                if(res.result=='success'){
                    alert('上传成功')
                }else{
                    alert('上传失败');
                }
            },error:function(res){
                console.log(res);
            }
        });
    }
});

//修改新闻
$('.change-news').click(function(){
    if($('.news #article-name').val()==''){
        alert('请输入文章标题！');
        return false;
    }else if($('.news #editor .w-e-text').html().length==11){
        alert('请输入文章内容！');
        return false;
    }else{
        $.ajax({
            type:"post",
            url:"/news/news_change",
            data:{
                id:GetUrl("id"),
                name:$('.news #article-name').val(),
                type:$('.news #type').val(),
                content: $('.news #editor .w-e-text').html()
            },
            async:true,
            dataType:'JSON',
            success:function(res){
                console.log(res);
                if(res.result=='success'){
                    alert('修改成功')
                }else{
                    alert('修改失败');
                }
            },error:function(res){
                console.log(res);
            }
        });
    }
});