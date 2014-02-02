$(function(){
	loadExternalJS("/request/list_courses?type=js&varname=courselist", function(){
		if(courselist.success){
			var courses = courselist.result; 

			var ol = $("<ol>"); 
			for(var i=0;i<courses.length;i++)
			{
				$("<li>")
				.append(
					$("<a>")
					.attr("href","/courses/#"+courses[i]["id"])
					.text(courses[i]["name"])
					)
				.appendTo(ol)
			} 

			$("#ListCoursesHere").append(ol); 

		} else {
			alert("Error: " + courselist.result); 
		}
	})
})