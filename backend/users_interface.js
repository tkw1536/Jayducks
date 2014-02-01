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
    // TODO: check if user already exists
    this.collection.insert({"name": username, "attributes": {}}, {w: 1}, function(err, result) {
        if(err) {
            callback(false, err);
            return;
        }

        var userid = result[0]['_id'];
        callback(true, userid);
    });
};

Users.getAttributes = function(callback, username) {
    this.collection.find({"name": username}).toArray(function(err, result) {
        if(err) {
            callback(false, err);
            return;
        }

        // username is unique, thus $result has only one entry
        if(result.length == 0) {
            callback(false, "User \"" + username + "\" does not exist");
        } else if(result.length == 1) {
            callback(true, result[0]["attributes"]);
        } else {
            callback(false, "Multiple users \"" + username + "\" exist, what did you do?!");
        }
    });
};

Users.setAttributes = function(callback, username, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    var coll = this.collection;
    
    function update_attributes(attr) {
        coll.update({"name": username}, {"$set": {"attributes": attr}}, {w: 1}, function(err, result) {
            if(err) {
                callback(false, err);
                return;
            }

            callback(true, {"modified_num": result, "attributes": attr});
        });
    }

    if(merge) {
        this.getAttributes(function(success, result) {
            if(!success) {
                callback(false, result);
                return;
            }

            // merge attributes
            for(var key in attributes) {
                result[key] = attributes[key];
            }

            update_attributes(result);
        }, username);
    } else {
        update_attributes(attributes);
    }
};

Users.deleteUser = function(callback, username) {
    this.collection.remove({"name": username}, function(err, result) {
        if(err) {
            callback(false, err);
            return;
        }

        if(result == 0) {
            callback(false, "User \"" + username + "\" does not exist");
        } else {
            callback(true, result);
        }
    });
};


// exports
exports.Users = Users;
