$(function(){
	var id = location.hash.substring(1); 

	loadExternalJS("/request/docgroup_info?type=js&varname=docgroup_info&id="+id, function(){
		if(docgroup_info.success){
			$("#title").text(docgroup_info.result.name); 
		} else {}
	}); 

	$("#delete-docgroup").click(function(){

		$("<form action='/do/delete_docgroup' method='POST'>")
		.append(
			"<input type='hidden' name='id' value='"+id+"'>", 
			"<input type='hidden' name='go_success' value='/'>", 
			"<input type='hidden' name='go_fail' value='"+location.pathname+location.hash+">"
		)
		.submit(); 
		return false; 
	}); 

	loadExternalJS("/request/list_docs?type=js&varname=docList&id="+id, function(){
		if(docList.success){
			//display it on the page somehow
			//needs results for ids
			var docList = docList.result; 
			/*
				{
					"name": "Some_name_here", 
					"id": "..."
				}
			*/
			
			var ol = $("<ol>").appendTo("#docList"); 
              for(var i=0;i<courses.length;i++)
              {
              	$("<li>")
					.append(
						$("<a>")
							.attr("href","/docs/#"+docGroups[i]["id"])
						.text(docGroups[i]["name"]))
              		.appendTo(ol); 
              } 

		} else {
			alert("Error: " + docList.result); 
		}
	})
})