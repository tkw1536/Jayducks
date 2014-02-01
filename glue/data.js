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

module.exports.create_course = function(name, cb){
	backend.Courses.create(function(success, res){
		if(!success){
			cb(success, res); 
		} else {
			backend.Courses.setName(function(success, res2){
				if(!success){
					cb(success, res2); 
				} else {
					cb(true, {"name": name, "id": res})
				}
			}, res, name); 
		}
	}); 
};

module.exports.create_course = function(name, cb){
	backend.Courses.create(function(success, res){
		if(!success){
			cb(success, res); 
		} else {
			backend.Courses.setName(function(success, res2){
				if(!success){
					cb(success, res2); 
				} else {
					cb(true, {"name": name, "id": res})
				}
			}, res, name); 
		}
	}); 
}; 

module.exports.delete_course = function(id, cb){
	backend.Courses.delete(function(success, res){
			cb(success, res); 
	}, id); 
}; 