/* loaded on every page */

$(function(){
	//logout link

	var logout_link = $("#logout-link"); 

	if(logout_link.length > 0){
		logout_link.click(function(){
			$("<form action='/do/logout' method='POST'>")
			.append(
				"<input type='hidden' name='go_success' value='/login/'>", 
				"<input type='hidden' name='go_fail' value='"+location.pathname+"'>"
			)
			.submit(); 
			return false; 
		}); 
	}

	var user_name = $("#user-name"); 

	if(user_name.length > 0){
		loadExternalJS("/request/user?type=js&varname=user", function(){
			if(user.success){
				user_name.text(user.result.username); 
			} else {}
		}); 
	}
	
})