var 
	http = require("http"), 
	url = require("url"), 
	qs =  require('querystring'), 
	yawsl = require("yawsl"); 

var users = require("./users.js"); 

var global_session_store = {}; 



function perform(methodname, $args, req, res, data, cb){
	switch(methodname)
	{
		case "result":
			if(data.session.value.last_interactive_result){
				cb({"success": true, "result": data.session.value.last_interactive_result}); 
			} else {
				cb({"success": false, "result": "No data available"}); 
			}
			break;

		//user  stuff
		case "login": 
			users.login($args["username"], $args["pass"], data, cb); 
			break; 
		case "logout": 
			users.logout(data, cb); 
		case "user": 
			users.get_user_info(data, cb); 
			break; 
		default:
			cb({"success":false, "result": "Unknown or unimplemented method. "}); 
	}
}


function handle_non(req, res, data){
	var parsed_url = url.parse(req.url, true); 

	var $methodname = parsed_url.pathname.substr(1); 
	var varname = parsed_url.query.varname || "response_"+$methodname; 
	var type = parsed_url.query.type || "json"; 
	var params = parsed_url.query || {}; 
	perform($methodname, params, req, res, data, function(actionres){
		if(type == "json"){
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(actionres)); 
		} else if(type == "jsonp"){
			res.writeHead(200, {"Content-Type": "application/javascript"});
			res.end(varname+"("+JSON.stringify(actionres)+");"); 
		} else {
			res.writeHead(200, {"Content-Type": "application/javascript"});
			res.end("var "+varname+"="+JSON.stringify(actionres)+";"); 
		}
	}); 

	return true; 
}

function handle_interactive(req, res, data){
	//handle the interactive one here

	var body = ""; 
	req.on('data', function (data) {
		body +=data;
	});
	req.on('end',function(){
		var POST = qs.parse(body);

		var parsed_url = url.parse(req.url, true); 
		var $methodname = parsed_url.pathname.substr(1); 
		var params = POST; 
		perform($methodname, params, req, res, data, function(actionres){
			data.session.value.last_interactive_result = actionres; 
			var go_success = POST.go_success || "/"; 
			var go_fail = POST.go_fail; 

			if(actionres["success"] == true){
				res.writeHead(303, {
				  'Location': go_success
				});
				res.end('{"success": "true", result: "Redirecting"}');
			} else {
				res.writeHead(303, {
				  'Location': go_fail || go_success
				});
				res.end('{"success": "false", result: "Redirecting"}');
			}
		}); 

		
		return false; 
	});

	return true; 
	
}



function main(port){
	http.createServer(yawsl.make(
		yawsl.session(function(){return {}; }, 60*60*24*7, global_session_store, [
			yawsl.subServer("request", handle_non), 
	   		yawsl.subServer("do", handle_interactive), 
	    	yawsl.staticServer("./frontend/")
		])
	    
	)).listen(port);
}


module.exports = {
	"main": function(){main(8080); }
}