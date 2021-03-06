var ObjectID = require('mongodb').ObjectID; // needed to handle _id
var fs = require('fs');

var utils = require('./utils');
var DocumentGroups_Interface = require('./documentgroups_interface');


// interface
var Documents = new Object();


Documents.exists = function(callback, id) {
    utils.exists(callback, this.collection["documents"], "_id", ObjectID(id.toString()));
};

Documents.create = function(callback, dgroupid, tmp_path) {
    // TODO: add groups in a better way
    var docid = undefined;
    var documents = undefined;
    var me = this;

    function adder_dummy(success, result) {
        if(success) {
            docid = result;

            // add parent entry
            utils.setProperty(
                function(success, res) {
                    // TODO: check if an error occurs here
                }, me.collection["documents"], "_id", ObjectID(docid.toString()), "parent", dgroupid, false
            );

            // empty comments array
            utils.setProperty(
                function(success, res) {
                    // TODO: check if an error occurs here
                }, me.collection["documents"], "_id", ObjectID(docid.toString()), "comments", [], false
            );

            // get current course ids
            utils.getProperty(get_group_dummy, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "documents");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            documents = result || [];

            // add and set new group id(s)
            documents.push(docid);
            utils.setProperty(set_group_dummy, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "documents", documents);
        } else {
            callback(false, result);
        }
    }

    function set_group_dummy(success, result) {
        if(success) {
            var path = "./data/" + dgroupid + "/";

            // add path
            utils.setProperty(
                function(err, res) {
                    // TODO: check if an error occurs here
                }, me.collection["documents"], "_id", ObjectID(docid.toString()), "path", path + docid.toString(), false
            );

            function on_file_loaded(success, res) {
                if(!success) {
                    callback(false, res);
                    return;
                }

                callback(true, docid);
            }

            utils.save_file(on_file_loaded, tmp_path, path, docid);
        } else {
            callback(false, result);
        }
    }

    utils.createEntry(adder_dummy, this.collection["documents"], "name", "");
};

Documents.delete = function(callback, id) {
    var me = this;

    function delete_file(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        // delete file
        fs.unlinkSync(res);
        
        // delete database entry
        utils.deleteEntry(callback, me.collection["documents"], "_id", ObjectID(id.toString()));
    }

    function dummy(){
        console.log(arguments); 
    }

    function got_group(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        DocumentGroups_Interface.DocumentGroups.removeDocument(dummy, res, id);
    }

    Documents.getPath(delete_file, id);
    Documents.getGroup(got_group, id);
};

Documents.addComment = function(callback, id, data) {
    var me = this;

    function set_prop(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        callback(true, "the joke of the day");
    }

    function got_comments(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        res.push(data);
        utils.setProperty(set_prop, me.collection["documents"], "_id", ObjectID(id.toString()), "comments", res);
    }

    utils.getProperty(got_comments, this.collection["documents"], "_id", ObjectID(id.toString()), "comments");
};

Documents.getCommentNumber = function(callback, id) {
    function got_comments(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        callback(true, res.length);
    }

    utils.getProperty(got_comments, this.collection["documents"], "_id", ObjectID(id.toString()), "comments");
};

Documents.getComment = function(callback, id, comid) {
    function got_comments(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        if(comid >= 0 && comid < res.length) {
            callback(true, res[comid]);
        } else {
            callback(false, "Comment id out of bounds");
        }
    }

    utils.getProperty(got_comments, this.collection["documents"], "_id", ObjectID(id.toString()), "comments");
};

Documents.getName = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "name");
};

Documents.setName = function(callback, id, name) {
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "name", name);
};

Documents.getGroup = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "parent");
};

Documents.getAttributes = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "attributes");
};

Documents.setAttributes = function(callback, id, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "attributes", attributes, merge);
};

Documents.getPath = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "path");
};


// exports
exports.Documents = Documents;
