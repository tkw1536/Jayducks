$(function(){
	var id = location.hash.substring(1); 

	loadExternalJS("/request/course_info?type=js&varname=course_info&id="+id, function(){
		if(course_info.success){
			$("#title").text(course_info.result.name); 
		} else {}
	}); 

	$("#delete-course").click(function(){
		$("<form action='/do/delete_course' method='POST'>")
		.append(
			"<input type='hidden' name='id' value='"+id+"'>", 
			"<input type='hidden' name='go_success' value='/'>", 
			"<input type='hidden' name='go_fail' value='"+location.pathname+location.hash+">"
		)
		.submit(); 
		return false; 
	}); 

	loadExternalJS("/request/list_docgroups?type=js&varname=docGroupList&id="+id, function(){
		if(docGroupList.success){

			var docGroups = docGroupList.result; 
			var ol = $("<ol>").appendTo("#docGroupList"); 

			console.log(docGroups); 
			
              for(var i=0;i<docGroups.length;i++)
              {
              	$("<li>")
					.append(
						$("<a>")
						.attr("href","/category/#"+docGroups[i]["id"])
						.text(docGroups[i]["name"])
					)
              		.appendTo(ol)
              } 

		} else {
			alert("Error: " + docGroupList.result); 
		}
	})

	$(document.getElementById("create-docgroup")).attr("href", "/new/category/#"+id); 
})