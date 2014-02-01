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
			
			var courseTable=$("<table/>").attr("id","tab");
              $("#TableHere").append(courseTable);
              for(var i=0;i<courses.length;i++)
              {
              	$("<tr>")
              	.append(
					$("<td>").text(courses[i]["id"]), 
	           		 $("<td>").text(courses[i]["name"])
              	).appendTo(courseTable)
	            	
              } 


		} else {
			alert("Error: " + courselist.result); 
		}
	})
})