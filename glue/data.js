var backend = require('../backend/backend.js'); 
var formidable = require('formidable');
var fs = require("fs"); 


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

module.exports.delete_document = function(id, cb){
	backend.Documents.delete(function(success, res){
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

module.exports.upload_doc = function(id, name, path, cb){
	backend.Documents.create(function(suc, res){
		if(!suc){
			cb(false, res); 
			return; 
		}
		backend.Documents.setName(function(success, res2){
			if(!success){
				cb(success, res2); 
			} else {
				cb(true, {"name": name, "id": res})
			}
		}, res, name); 
	}, id, path); 
}

module.exports.document_info  = function(id, cb){
	backend.Documents.getName(function(suc, res){
		if(!suc){
			cb(suc, res); 
		} else {
			backend.Documents.getGroup(function(suc, res2){
				if(!suc){
					cb(suc, res2); 
				} else { 
					backend.DocumentGroups.getCourse(function(suc, res3){
						if(!suc){
							cb(false, res3); 
						} else {
							cb(true, { 
								"name": res, 
								"parent": res2, 
								"pparent": res3.toString()
							});
						}
					}, res2)

				}
			}, id.toString())
			
		}
	}, id.toString()); 
}; 

module.exports.redirect_file = function(id, req, resp){
	//pass through file or send 404

	console.log(id); 

	backend.Documents.getPath(function(suc, res){
		if(!suc){
			res.writeHead(404);
			res.end(res);
		} else {
			try{
				resp.writeHead(200, {"Content-Type": "application/pdf"}); 
				var fileStream = fs.createReadStream(res);//pump to the client
				fileStream.pipe(resp);
			} catch(e){
				resp.writeHead(500);
				resp.end("STREAM_PIPE_FAIL");
			}
			
		}
	}, id); 
}; 