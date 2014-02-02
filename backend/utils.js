var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');

var config = require("./config");


// fs stuff
function download_file(callback, req) {
    var form = formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        // copy file, etc.


        callback(true, fields);
    });
}

// database stuff
function connect_database(callback) {
    //MongoClient.connect("mongodb://box.w1536.tk:27017/hackathon-w14", callback);
    MongoClient.connect("mongodb://" + config["address"] + ":" + config["port"] + "/" + config["database"], callback);
}

// catch all the errors!
function catch_error(callback, cont_func, err, res) {
    if(err) {
        callback(false, err);
        return;
    }
    cont_func(callback, res);
}

// generic helper functions
function exists(callback, collection, key, value) {
    var query = {};
    query[key] = value;

    function handler(callback, result) {
        if(result == null) {
            // entry does not exist
            callback(true, false);
        } else {
            // entry does exist
            callback(true, true);
        }
    }

    collection.findOne(query, function(err, res) {
        catch_error(callback, handler, err, res);
    });
}

function createEntry(callback, collection, key, value) {
    // TODO: check if entry already exists

    var query = {};
    query[key] = value;
    query["attributes"] = {};

    function handler(callback, result) {
        var id = result[0]['_id'].toString();
        callback(true, id);
    }

    collection.insert(query, {w: 1}, function(err, res) {
        catch_error(callback, handler, err, res);
    });
};   

function listEntries(callback, collection) {
    function handler(callback, result) {
        var id_list = [];
        for(var p in result) {
            var entry = result[p];
            id_list.push(entry["_id"].toString());
        }

        callback(true, id_list);
        //callback(true, result); // TODO: fix this
    }

    collection.find().toArray(function(err, res) {
        catch_error(callback, handler, err, res);
    });
}

function getProperty(callback, collection, key, value, property_key) {
    var query = {};
    query[key] = value;

    function handler(callback, result) {
        if(result.length == 0) {
            callback(false, "Entry '" + value + "' does not exist");
        } else if(result.length == 1) {
            callback(true, result[0][property_key]);
        } else {
            callback(false, "Multiple entries '" + value + "' exist, what did you do?!");
        }
    }

    collection.find(query).toArray(function(err, res) {
        catch_error(callback, handler, err, res);
    });
}

function setProperty(callback, collection, key, value, property_key, property_value, merge) {
    function handler(callback, result) {
        callback(true, result);
    }

    function update_attributes(attr) {
        var query = {};
        query[key] = value;

        var inserter = {};
        inserter[property_key] = property_value;

        collection.update(
            query,
            {
                "$set": inserter
            }, {w: 1},
            function(err, res) {
                catch_error(callback, handler, err, res);
            }
        );
    }

    if(merge) {
        getProperty(
            function(success, result) {
                if(!success) {
                    callback(false, result);
                    return;
                }

                // merge attributes
                for(var key in property_value) {
                    result[key] = property_value[key];
                }

                update_attributes(result);
            },
            collection,
            key, value,
            property_key
        );
    } else {
        update_attributes(property_value);
    }
}

function deleteEntry(callback, collection, key, value) {
    var query = {};
    query[key] = value;

    function handler(callback, result) {
        if(result == 0) {
            callback(false, "Entry \"" + value + "\" does not exist");
        } else {
            callback(true, result);
        }
    }

    collection.remove(query, function(err, res) {
        catch_error(callback, handler, err, res);
    });
}


// exports
exports.download_file = download_file;

exports.connect_database = connect_database;

exports.exists = exists;
exports.createEntry = createEntry;
exports.listEntries = listEntries;
exports.getProperty = getProperty;
exports.setProperty = setProperty;
exports.deleteEntry = deleteEntry;
