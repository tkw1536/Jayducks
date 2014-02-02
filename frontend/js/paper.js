$(function(){
	var id = location.hash.substring(1); 
	var parent_id = undefined; 
	var pparent_id; 

	loadExternalJS("/request/document_info?type=js&varname=document_info&id="+id, function(){
		if(document_info.success){

			$("#title").text(document_info.result.name); 
			parent_id = document_info.result.parent; 
			pparent_id = document_info.result.pparent; 

			$("#course-link").attr("href", "/courses/#"+pparent_id); 
			$("#category-link").attr("href", "/category/#"+parent_id); 
		} else {}
	}); 

	$("#do-delete").click(function(){
		$("<form action='/do/delete_document' method='POST'>")
		.append(
			"<input type='hidden' name='id' value='"+id+"'>", 
			"<input type='hidden' name='go_success' value='/category/#"+parent_id+"'>", 
			"<input type='hidden' name='go_fail' value='"+location.pathname+location.hash+">"
			)
		.submit(); 
		return false; 
	}); 

	$("#result").attr("data", "/get/"+id); 
	$("#result").find("a").attr("href", "/get/"+id); 
	$("#dwn").attr("href", "/get/"+id);
})