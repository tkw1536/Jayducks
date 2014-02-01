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
		})
	}
})