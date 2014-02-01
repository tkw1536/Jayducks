var write_user_name = function(){
	loadExternalJS("/request/user?type=js&varname=user", function(){
		if(user.success){
			$("#username").text(user.result.username); 
		} else {
			alert("Fail!"); 
		}
	})
}