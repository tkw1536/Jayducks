var backend = require('../backend/backend.js'); 


module.exports.list_courses = function(cb){
	backend.Courses.list(function(success, res){
		if(!success){
			cb(success, res); 
		} else {

			var cache = []; 
			var iterator = function(i){
				if(i>=res.length){
					return cb(true, cache); 
				}
				var ress = res[i].toString(); 
				backend.Courses.getName(function(suc, res){
					if(!suc){
						cb(suc, res); 
					} else {
						cache.push({
							"name": res, 
							"id": ress
						})
						iterator(i+1); 
					}
				}, ress); 
			}; 

			iterator(0); 
		}
	}); 
}; 