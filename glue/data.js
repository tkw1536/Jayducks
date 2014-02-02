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

module.exports.list_docgroups = function(id, cb){
	backend.Courses.listGroups(function(success, res){
		if(!success){
			cb(success, res); 
		} else {
			var cache = []; 
			var iterator = function(i){
				if(i>=res.length){
					return cb(true, cache); 
				}
				var ress = res[i].toString();
				backend.DocumentGroups.getName(function(suc, res){
					if(!suc){
						cb(suc, res); 
					} else {
						cache.push({
							"name": res, 
							"id": ress
						}); 
						iterator(i+1); 
					}
				}, ress); 
			}; 

			iterator(0); 
		}
	}, id); 
}; 

module.exports.list_docs = function(id, cb){
	backend.DocumentGroups.listDocuments(function(success, res){
		if(!success){
			cb(success, res); 
		} else {
			var cache = []; 
			var iterator = function(i){
				if(i>=res.length){
					return cb(true, cache); 
				}
				var ress = res[i].toString();
				backend.Documents.getName(function(suc, res){
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
	}, id); 
}; 

module.exports.course_info = function(id, cb){
	backend.Courses.getName(function(suc, res){
		if(!suc){
			cb(suc, res); 
		} else {
			cb(true, {
				"name": res, 
				"id": id
			}); 
		}
	}, id.toString()); 
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

module.exports.create_docgroup = function(id, name, cb){
	backend.DocumentGroups.create(function(success, res){
		if(!success){
			cb(success, res); 
		} else {
			backend.DocumentGroups.setName(function(success, res2){
				if(!success){
					cb(success, res2); 
				} else {
					cb(true, {"name": name, "id": res})
				}
			}, res, name); 
		}
	}, id); 
};
 

module.exports.delete_course = function(id, cb){
	backend.Courses.delete(function(success, res){
			cb(success, res); 
	}, id); 
}; 


module.exports.delete_docgroup = function(id, cb){
	backend.DocumentGroups.delete(function(success, res){
			cb(success, res); 
	}, id);
}


module.exports.docgroup_info  = function(id, cb){
	backend.DocumentGroups.getName(function(suc, res){
		if(!suc){
			cb(suc, res); 
		} else {
			backend.DocumentGroups.getCourse(function(suc, res2){
				if(!suc){
					 cb(false, res2); 
				} else {
					cb(true, {
						"name": res, 
						"parent": res2
					});
				}
			}, id.toString())
			
		}
	}, id.toString()); 
}; 

module.exports.upload_doc = function(req, cb){
	backend.Documents.create(cb, req); 
}