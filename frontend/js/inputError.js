if(location.hash == "#fail"){
	loadExternalJS("/request/result/?type=js", function(){
		if(response_result.success){
			if(!response_result.result.success){
				//display the error message
				$("<div class='alert alert-danger'>")
				.text(response_result.result.result)
				.appendTo($("#msg")); 
			}
		}
	})
}