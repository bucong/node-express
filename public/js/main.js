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
//注册
function register(){
	if($('#username').val()==''||$('#userpass').val()==''){
		alert('用户名或密码不能为空！');
		return false;
	}
	$.ajax({
		type:"post",
		url:"/user/register",
		data:{
			name:$('#username').val(),
			pass:$('#userpass').val()
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
