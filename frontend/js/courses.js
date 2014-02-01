$(function(){
	loadExternalJS("/request/list_courses?type=js&varname=courselist", function(){
		if(courselist.success){
			//display it on the page somehow
			//needs results for ids
			var courses = courselist.result; 
			/*
				{
					"name": "Some_name_here", 
					"id": "...", 
					"description": "Text"
				}
			*/
			var main_element = $(".main"); 
			
		} else {
			alert("Error: " + courselist.result); 
		}
	})
})