var MongoClient = require('mongodb').MongoClient;

var config = require("./config");


var collection_names = ["Students", "Courses", "DocumentGroups", "Documents"];


// handle cmd-line arguments
if(process.argv.length != 3) {
	var tmp = process.argv[1].split('/');
	var prog = tmp[tmp.length - 1];

	console.log("Usage: node " + prog + " <action>");
	return;
}
cmd = process.argv[2];

// execute stuff in database
function clear_db(db) {
	c = 0;

	for(var p in collection_names) {
		db.collection(collection_names[p]).drop(function(foo) {
			console.log(foo);
			c++;

			if(c == collection_names.length) {
				// last collection was deleted, bye
				shutdown();
			}
		});
	}
}

function show_db(db) {
	c = 0;

	for(var p in collection_names) {
		db.collection(collection_names[p]).find().toArray(function(err, res) {
			if(err) {
				console.log("Error while showing collection");
				return console.dir(err);
			}

			console.log(res);

			c++;
			if(c == collection_names.length) {
				// last collection was deleted, bye
				shutdown();
			}
		});
	}
}

// get of of here!
function shutdown() {
	process.exit();
}

// put it all together
function handle_db(err, db) {
	if(err) {
		console.log("Error while connecting to the database");
		return console.dir(err);
	}

	if(cmd == "clear") {
		clear_db(db);
	} else if(cmd == "show") {
		show_db(db);
	} else {
		console.log("Invalid argument (use show/clear)");
		shutdown();
	}
}


// connect to database
MongoClient.connect("mongodb://" + config["address"] + ":" + config["port"] + "/" + config["database"], handle_db);