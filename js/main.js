function login(){
	$.ajax({
		type:"get",
		url:"http://127.0.0.1:3000/login",
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
					window.location.href="../index.html";
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
function register(){
	$.ajax({
		type:"get",
		url:"http://127.0.0.1:3000/register",
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
			}
		},error:function(res){
			console.log(res)
		}
	});
	return false;
}