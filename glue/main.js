var 
http = require("http"), 
url = require("url"), 
qs =  require('querystring'), 
yawsl = require("yawsl"); 

var users = require("./users.js"); 
var db_data = require("./data.js");

var global_session_store = {}; 

function strStartsWith(str, prefix) {
	return str.indexOf(prefix) === 0;
}


function perform(methodname, $args, req, res, data, cb){
	console.log("Runnning from client --->", methodname); 
	try{
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
			/* courses */
			case "list_courses": 
				if(!users.allowed("list_courses", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.list_courses(function(s, r){
					cb({"success": s, "result": r})
				}); 
				break; 
			case "create_course": 
				if(!users.allowed("create_course", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.create_course($args["name"], function(s, r){
					cb({"success": s, "result": r}); 
				});
				break; 
			case "delete_course": 
				if(!users.allowed("delete_course", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.delete_course($args["id"], function(s, r){
					cb({"success": s, "result": r})
				}); 
				break; 
			case "course_info": 
				if(!users.allowed("course_info", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.course_info($args["id"], function(s, r){
					cb({"success": s, "result": r})
				}); 
				break; 
			/* document_group */
			case "create_docgroup": 
				if(!users.allowed("create_docgroup", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.create_docgroup($args["id"], $args["name"], function(s, r){
					cb({"success": s, "result": r}); 
				});
				break; 
			case "list_docgroups": 
				if(!users.allowed("list_docgroups", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.list_docgroups($args["id"], function(s, r){
					cb({"success": s, "result": r})
				}); 
				break;
			case "delete_docgroup": 
				if(!users.allowed("delete_docgroup", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.delete_docgroup($args["id"], function(s, r){
					cb({"success": s, "result": r})
				}); 
				break; 
			/* documents */
			case "list_docs": 
				if(!users.allowed("list_docs", data)){
					return cb({"success": "false", "result": "You are unauthorised. "})
				}
				db_data.list_docs($args["id"], function(s, r){
					cb({"success": s, "result": r})
				}); 
				break;
			default:
				cb({"success":false, "result": "Unknown or unimplemented method. "}); 
		}
	} catch(e){
			console.error(e); 
			cb({"success": false, "result": "Server side error"}); 
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
			function(req, res, data){
				if(!data.session.value.username){
					if(strStartsWith(req.url, "/about/") || strStartsWith(req.url, "/libs/") || strStartsWith(req.url, "/js/") || strStartsWith(req.url, "/css/") || strStartsWith(req.url, "/login/")){

						return false; 
					}
					res.writeHead(303, {
						'Location': "/login/"
					});
					res.end('Logged out, please login at /login/. ');
					return true; 
				}
				return false; 
			}, 
			yawsl.staticServer("./frontend/")
			])
		)).listen(port);
}


module.exports = {
	"main": function(){main(8080); }
}