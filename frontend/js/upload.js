$(function(){
	var id = location.hash.substring(1);
	$(document.getElementById("id")).val(id); 
	$(document.getElementById("go_fail")).val(location.pathname + location.hash); 
	$(document.getElementById("go_success")).val("/category/" + location.hash); 
}); 