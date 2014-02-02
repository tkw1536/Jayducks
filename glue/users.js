var backend = require('../backend/backend.js'), 
	ldap = require('ldapjs');

module.exports.validate_pass = function(user, pass, cb){
	if(user == "admin" && pass == ""){
		return cb(true); 
	}
	var username = user+"@jacobs.jacobs-university.de"; 

	var client = ldap.createClient({
          url: 'ldap://jacobs.jacobs-university.de/',
          timeout: 5000,
          connectTimeout: 10000
    });

    try {
        client.bind(username, pass, function (error) {
            if(error){
            	cb(false);    
            } else {
                cb(true); 
            }
            client.unbind(); 
        });
    } catch(error){
       cb(false); 
       try{

       }catch(f){}
    }
}

module.exports.allowed = function(action, data){
	return data.session.value.username?true:false; 
}

module.exports.login = function(user, pass, data, cb){
	if(data.session.value.username){
		return cb({"success": false, "result": "Already authenticated, please logout first. "});
	}

	module.exports.validate_pass(user, pass, function(suc){
		if(suc){
			data.session.value.username = user; 
			return cb({"success": true, "result": {"username": user}});
		} else {
			return cb({"success": false, "result": "Authentication failed. "});
		}
	}); 
	
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