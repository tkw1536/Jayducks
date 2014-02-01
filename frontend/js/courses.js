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
			
			$("#ListCoursesHere").append($("<ol>"))
              for(var i=0;i<courses.length;i++)
              {
              	$("<li>")
					.append(
						$("<a>")
							.attr("href","/courses/#"+courses[i]["id"])
						.text(courses[i]["name"]))
              		.appendTo($("#ListCoursesHere"))
              } 

		} else {
			alert("Error: " + courselist.result); 
		}
	})
})