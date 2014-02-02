$(function(){
	var id = location.hash.substring(1); 
	var parent_id = undefined; 

	$("#upload-doc").attr("href", "/new/doc/#"+id); 

	loadExternalJS("/request/docgroup_info?type=js&varname=docgroup_info&id="+id, function(){
		if(docgroup_info.success){
			$("#title").text(docgroup_info.result.name); 
			parent_id = docgroup_info.result.parent; 

			$("#course-link").attr("href", "/courses/#"+parent_id); 
		} else {}
	}); 

	$("#delete-docgroup").click(function(){

		$("<form action='/do/delete_docgroup' method='POST'>")
		.append(
			"<input type='hidden' name='id' value='"+id+"'>", 
			"<input type='hidden' name='go_success' value='/courses/#"+parent_id+"'>", 
			"<input type='hidden' name='go_fail' value='"+location.pathname+location.hash+">"
			)
		.submit(); 
		return false; 
	}); 

	loadExternalJS("/request/list_docs?type=js&varname=doc_List&id="+id, function(){
		if(doc_List.success){
			var docList = doc_List.result; 
			var ol = $("<ol>").appendTo("#docList"); 

			for(var i=0;i<docList.length;i++)
			{

				$("<li>")
				.append(
					$("<a>")
					.attr("href","/paper/#"+docList[i]["id"])
					.text(docList[i]["name"]))
				.appendTo(ol); 
			} 

		} else {
			alert("Error: " + doc_List.result); 
		}
	})
})