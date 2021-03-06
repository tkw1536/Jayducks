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


	var refresh_comments = function(){
		loadExternalJS("/request/list_comments?type=js&varname=comment_info&time="+(new Date()).getTime().toString()+"&id="+id, function(){
			if(comment_info.success){
				$("#comments").empty().append(
				$("<form role='form'>")
				.append(
					"<input type='hidden' name='id' value='"+id+"'>", 
					"<input type='text' class='form-control' style='width:500px;' name='message' value='' id='commenttext'>", $("<br>"),
					$("<button class='btn btn-primary'>").text("Add comment").click(function(){
						loadExternalJS("/request/add_comment?type=js&varname=_nothing_&text="+escape($("#commenttext").val())+"&id="+id, $("<br>"),function(){
							refresh_comments();
						}); 
						return false; 
					})
				)
				)
				comment_info.result.map(function(c){
					var author = c["user"];
					var text = c["text"];

					$("#comments").append($("<br>"))
						.append($("<div style='width:500px;' class=\"well\">")
							.append(
								$("<strong>").text(author)," : "+text)); 
				}); 
			} else {}
		}); 
	}
	refresh_comments();
	

	$("#email").find("a").attr("href","mailto:?subject=I wanted you to see this site&amp;body=Check out this pastpaper:"+location.href+location.hash)
	$("#result").attr("data", "/get/"+id); 
	$("#result").find("a").attr("href", "/get/"+id); 
	$("#dwn").attr("href", "/get/"+id);
})