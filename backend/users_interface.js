// interface
var Users = new Object();


Users.exists = function(callback, username) {
    this.collection.findOne({"name": username}, function(err, item) {
        if(err) {
            callback(false, err);
            return;
        }

        if(item == null) {
            // user does not exist
            callback(true, false);
        } else {
            // user does exist
            callback(true, true);
        }
    });
};

Users.list = function(callback) {
    this.collection.find().toArray(function(err, result) {
        if(err) {
            callback(false, err);
            return;
        }

        var userid_list = [];
        for(var p in result) {
            var entry = result[p];
            userid_list.push(entry["_id"]);
        }

        callback(true, userid_list);
    });
};

Users.registerNew = function(callback, username) {
    this.collection.insert({"name": username, "attributes": {}}, {w: 1}, function(err, result) {
        if(err) {
            callback(false, err);
            return;
        }

        var userid = result[0]['_id'];

        callback(true, userid);
    });
};


// exports
exports.Users = Users;
