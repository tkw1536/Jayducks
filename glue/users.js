var backend = require('../backend/backend.js'); 

module.exports.validate_pass = function(user, pass){
	/*
		function check_ldap_pass($user, $pass) {
			//connect to ldap and check pass
			if($user == "" || $pass == ""){
				return false; 
			}
			$ldap_host = 'jacobs.jacobs-university.de';
			$ldap_port = 389;
			$ds = @ldap_connect($ldap_host,$ldap_port);
			$res = @ldap_bind($ds, $user . "@" . $ldap_host, $pass); 
			@ldap_unbind($ds); 
			return $res; 
		}
	*/
	return user=="admin" && pass=="test"; 
}

module.exports.login = function(user, pass, data, cb){
	if(data.session.value.username){
		return cb({"success": false, "result": "Already authenticated, please logout first. "});
	}
	var suc = module.exports.validate_pass(user, pass); 
 
	//TODO: Create user if required. 

	if(suc){
		data.session.value.username = user; 
		return cb({"success": true, "result": {"username": user}});
	} else {
		return cb({"success": false, "result": "Authentication failed. "});
	}
}

module.exports.logout = function(data, cb){

	if(data.session.value.username !== ""){
		delete data.session.value.username;
		return cb({"success": true, "result": "Logged out. "});
	} else {
		return cb({"success": false, "result": "Not logged in. "});
	}
}

module.exports.get_user_info = function(data, cb){
	if(!data.session.value.username){
		return cb({"success": false, "result": "Not authenticated. "});
	}
	cb({"success": true, "result": {"username": data.session.value.username}});
}